import { AppDataSource } from "@brigid/database";
import { DimseAllowedRemoteEntity } from "@brigid/database/src/entities/dimseAllowedRemote.entity";
import dcmjsDimse from "dcmjs-dimse";
import { appLogger } from "../../utils/logger";
import {
    sendStorageCommitmentEventReportOnAssociation,
    type ReferencedSopInstance,
} from "./eventReportClient";
import { instanceExistsInWorkspace } from "./instanceResolver";

const { constants, responses } = dcmjsDimse;
const { NActionResponse } = responses;
const { SopClass, Status } = constants;

const STORAGE_COMMITMENT_REQUEST_ACTION_TYPE = 1;

const logger = appLogger.child({
    module: "StorageCommitmentExecutor",
});

function buildStatusResponse(
    request: dcmjsDimse.requests.NActionRequest,
    status: number,
): dcmjsDimse.responses.NActionResponse {
    const response = NActionResponse.fromRequest(request);
    response.setStatus(status);
    return response;
}

function readReferencedSopFromItem(
    item: unknown,
): ReferencedSopInstance | undefined {
    if (item instanceof dcmjsDimse.Dataset) {
        const classUid = item.getElement("ReferencedSOPClassUID");
        const instanceUid = item.getElement("ReferencedSOPInstanceUID");
        if (
            typeof classUid === "string" &&
            classUid.length > 0 &&
            typeof instanceUid === "string" &&
            instanceUid.length > 0
        ) {
            return { classUid, instanceUid };
        }
        return undefined;
    }

    if (typeof item === "object" && item !== null) {
        const record = item as Record<string, unknown>;
        const classUid = record.ReferencedSOPClassUID;
        const instanceUid = record.ReferencedSOPInstanceUID;
        if (
            typeof classUid === "string" &&
            classUid.length > 0 &&
            typeof instanceUid === "string" &&
            instanceUid.length > 0
        ) {
            return { classUid, instanceUid };
        }
    }

    return undefined;
}

function parseReferencedSopSequence(
    dataset: dcmjsDimse.Dataset,
): ReferencedSopInstance[] {
    const sequence = dataset.getElement("ReferencedSOPSequence");
    if (!Array.isArray(sequence)) {
        return [];
    }

    const instances: ReferencedSopInstance[] = [];
    for (const item of sequence) {
        const parsed = readReferencedSopFromItem(item);
        if (parsed) {
            instances.push(parsed);
        }
    }

    return instances;
}

export async function executeStorageCommitment(options: {
    workspaceId: string;
    calledAeTitle: string;
    callingAeTitle: string;
    request: dcmjsDimse.requests.NActionRequest;
    scp: dcmjsDimse.Scp;
}): Promise<dcmjsDimse.responses.NActionResponse> {
    const { workspaceId, calledAeTitle, callingAeTitle, request, scp } =
        options;

    if (
        request.getRequestedSopClassUid() !==
        SopClass.StorageCommitmentPushModel
    ) {
        return buildStatusResponse(request, Status.NoSuchSopClass);
    }

    if (request.getActionTypeId() !== STORAGE_COMMITMENT_REQUEST_ACTION_TYPE) {
        return buildStatusResponse(request, Status.NoSuchActionType);
    }

    const dataset = request.getDataset();
    if (!dataset) {
        return buildStatusResponse(request, Status.ProcessingFailure);
    }

    const transactionUid = dataset.getElement("TransactionUID");
    if (typeof transactionUid !== "string" || transactionUid.length === 0) {
        return buildStatusResponse(request, Status.ProcessingFailure);
    }

    const referencedInstances = parseReferencedSopSequence(dataset);
    if (referencedInstances.length === 0) {
        return buildStatusResponse(request, Status.ProcessingFailure);
    }

    const allowedRemote = await AppDataSource.manager.findOne(
        DimseAllowedRemoteEntity,
        {
            where: {
                aeTitle: callingAeTitle,
                dimseConfig: {
                    aeTitle: calledAeTitle,
                },
            },
            relations: {
                dimseConfig: true,
            },
        },
    );

    if (!allowedRemote) {
        logger.error(
            `No commitment report destination found for ${callingAeTitle}`,
        );
        return buildStatusResponse(request, Status.ProcessingFailure);
    }

    const successInstances: ReferencedSopInstance[] = [];
    const failedInstances: ReferencedSopInstance[] = [];

    for (const instance of referencedInstances) {
        const exists = await instanceExistsInWorkspace(
            workspaceId,
            instance.instanceUid,
        );
        if (exists) {
            successInstances.push(instance);
        } else {
            failedInstances.push(instance);
        }
    }

    logger.info(
        `Storage Commitment request from ${callingAeTitle} (${successInstances.length} success, ${failedInstances.length} failed)`,
        {
            op: "N-ACTION",
            workspaceId,
            destination: `${callingAeTitle}@${allowedRemote.host}:${allowedRemote.port}`,
        },
    );

    const nActionResponse = buildStatusResponse(request, Status.Success);

    try {
        await sendStorageCommitmentEventReportOnAssociation(scp, {
            transactionUid,
            successInstances,
            failedInstances,
        });
    } catch (error) {
        logger.error("Failed to send Storage Commitment N-EVENT-REPORT", error, {
            op: "N-EVENT-REPORT",
            workspaceId,
            callingAeTitle,
        });
        return buildStatusResponse(request, Status.ProcessingFailure);
    }

    return nActionResponse;
}
