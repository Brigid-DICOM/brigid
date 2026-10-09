import { AppDataSource } from "@brigid/database";
import { DimseAllowedRemoteEntity } from "@brigid/database/src/entities/dimseAllowedRemote.entity";
import dcmjsDimse from "dcmjs-dimse";
import { appLogger } from "../../utils/logger";
import { resolveMoveInstances } from "./instanceResolver";
import { storeInstancesToDestination } from "./storeClient";

const { constants, responses } = dcmjsDimse;
const { CMoveResponse } = responses;
const { Status } = constants;

const logger = appLogger.child({
    module: "CMoveExecutor",
});

function getMoveDestination(
    request: dcmjsDimse.requests.CMoveRequest,
): string | undefined {
    const moveDestination = request
        .getCommandDataset()
        .getElement("MoveDestination");
    if (typeof moveDestination !== "string") {
        return undefined;
    }

    const trimmed = moveDestination.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

function buildStatusResponse(
    request: dcmjsDimse.requests.CMoveRequest,
    status: number,
): dcmjsDimse.responses.CMoveResponse {
    const response = CMoveResponse.fromRequest(request);
    response.setStatus(status);
    return response;
}

function buildProgressResponse(
    request: dcmjsDimse.requests.CMoveRequest,
    options: {
        status: number;
        remaining: number;
        completed: number;
        failures: number;
    },
): dcmjsDimse.responses.CMoveResponse {
    const response = CMoveResponse.fromRequest(request);
    response.setStatus(options.status);
    response.setRemaining(options.remaining);
    response.setCompleted(options.completed);
    response.setWarnings(0);
    response.setFailures(options.failures);
    return response;
}

export async function executeCMove(options: {
    workspaceId: string;
    calledAeTitle: string;
    callingAeTitle: string;
    identifier: dcmjsDimse.Dataset | undefined;
    request: dcmjsDimse.requests.CMoveRequest;
    sendResponse: (
        response: dcmjsDimse.responses.CMoveResponse,
    ) => void;
}): Promise<dcmjsDimse.responses.CMoveResponse[]> {
    const {
        workspaceId,
        calledAeTitle,
        callingAeTitle,
        identifier,
        request,
        sendResponse,
    } = options;

    const moveDestination = getMoveDestination(request);
    if (!moveDestination) {
        logger.error("Missing MoveDestination in C-MOVE request");
        return [buildStatusResponse(request, Status.MoveDestinationUnknown)];
    }

    const allowedRemote = await AppDataSource.manager.findOne(
        DimseAllowedRemoteEntity,
        {
            where: {
                aeTitle: moveDestination,
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
        logger.error(`No allowed remotes found for ${moveDestination}`);
        return [buildStatusResponse(request, Status.MoveDestinationUnknown)];
    }

    if (!identifier) {
        return [buildStatusResponse(request, Status.ProcessingFailure)];
    }

    const instances = await resolveMoveInstances(workspaceId, identifier);
    if (instances.length === 0) {
        return [buildStatusResponse(request, Status.NoSuchObjectInstance)];
    }

    logger.info(
        `C-MOVE request from ${callingAeTitle} to ${moveDestination}@${allowedRemote.host}:${allowedRemote.port}`,
        {
            op: "C-MOVE",
            workspaceId,
            instanceCount: instances.length,
        },
    );

    let remaining = instances.length;
    let completed = 0;
    let failures = 0;

    try {
        return await new Promise<dcmjsDimse.responses.CMoveResponse[]>(
            (resolve, reject) => {
                void storeInstancesToDestination({
                    instances,
                    host: allowedRemote.host,
                    port: allowedRemote.port,
                    callingAeTitle,
                    calledAeTitle: moveDestination,
                    onStoreResponse: ({ status }) => {
                        remaining--;
                        if (status === Status.Success) {
                            completed++;
                        } else {
                            failures++;
                        }

                        if (remaining === 0) {
                            const finalStatus =
                                failures > 0
                                    ? Status.ProcessingFailure
                                    : Status.Success;
                            resolve([
                                buildProgressResponse(request, {
                                    status: finalStatus,
                                    remaining: 0,
                                    completed,
                                    failures,
                                }),
                            ]);
                            return;
                        }

                        sendResponse(
                            buildProgressResponse(request, {
                                status: Status.Pending,
                                remaining,
                                completed,
                                failures,
                            }),
                        );
                    },
                }).catch(reject);
            },
        );
    } catch (error) {
        logger.error("Failed to execute C-MOVE", error, {
            op: "C-MOVE",
            workspaceId,
        });
        return [buildStatusResponse(request, Status.ProcessingFailure)];
    }
}
