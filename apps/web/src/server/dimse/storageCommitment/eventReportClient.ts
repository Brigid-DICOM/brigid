import dcmjsDimse from "dcmjs-dimse";
import { appLogger } from "../../utils/logger";

const { constants, requests } = dcmjsDimse;
const { Status, SopClass } = constants;

const logger = appLogger.child({
    module: "StorageCommitmentEventReportClient",
});

export const STORAGE_COMMITMENT_PUSH_MODEL_INSTANCE_UID =
    "1.2.840.10008.1.20.1.1";

export interface ReferencedSopInstance {
    classUid: string;
    instanceUid: string;
}

export async function sendStorageCommitmentEventReportOnAssociation(
    scp: dcmjsDimse.Scp,
    options: {
        transactionUid: string;
        successInstances: ReferencedSopInstance[];
        failedInstances: ReferencedSopInstance[];
    },
): Promise<void> {
    const request = new requests.NEventReportRequest(
        SopClass.StorageCommitmentPushModel,
        STORAGE_COMMITMENT_PUSH_MODEL_INSTANCE_UID,
        2,
    );
    request.setEventTypeId(2);

    const dataset = new dcmjsDimse.Dataset();
    dataset.setElement("TransactionUID", options.transactionUid);

    if (options.successInstances.length > 0) {
        dataset.setElement(
            "ReferencedSOPSequence",
            options.successInstances.map((instance) => ({
                ReferencedSOPClassUID: instance.classUid,
                ReferencedSOPInstanceUID: instance.instanceUid,
            })) as unknown as string,
        );
    }

    if (options.failedInstances.length > 0) {
        dataset.setElement(
            "FailedSOPSequence",
            options.failedInstances.map((instance) => ({
                ReferencedSOPClassUID: instance.classUid,
                ReferencedSOPInstanceUID: instance.instanceUid,
                FailureReason: Status.NoSuchObjectInstance,
            })) as unknown as string,
        );
    }

    request.setDataset(dataset);

    await new Promise<void>((resolve, reject) => {
        let settled = false;
        const finish = () => {
            if (settled) {
                return;
            }
            settled = true;
            resolve();
        };

        request.on("response", (response) => {
            const status = response.getStatus();
            if (status !== Status.Success) {
                logger.error("Storage Commitment N-EVENT-REPORT failed", {
                    status,
                });
            }
            finish();
        });

        request.on("done", finish);
        request.on("error", reject);

        try {
            scp.sendRequests(request);
        } catch (error) {
            reject(error);
        }
    });
}
