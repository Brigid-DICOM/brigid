import { AppDataSource } from "@brigid/database";
import { DimseConfigEntity } from "@brigid/database/src/entities/dimseConfig.entity";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { RoutingDestinationEntity } from "@brigid/database/src/entities/routingDestination.entity";
import type { RoutingJobEntity } from "@brigid/database/src/entities/routingJob.entity";
import dcmjsDimse from "dcmjs-dimse";
import { storeInstancesToDestination } from "@/server/dimse/cmove/storeClient";
import { getStorageProvider } from "@/server/utils/storage/storageFactory";
import { sendStowRs } from "./dicomweb/stowRsClient";

const { constants } = dcmjsDimse;
const { Status } = constants;

export type RoutingOutboundResult =
    | { outcome: "succeeded"; warning?: string }
    | { outcome: "failed"; error: string };

async function readInstanceBytes(instancePath: string): Promise<Buffer> {
    const storage = getStorageProvider();
    const { body } = await storage.downloadFile(instancePath);
    const chunks: Buffer[] = [];
    for await (const chunk of body) {
        chunks.push(chunk as Buffer);
    }
    return Buffer.concat(chunks);
}

async function executeDimseOutbound(
    job: RoutingJobEntity,
    instance: InstanceEntity,
    destination: RoutingDestinationEntity,
): Promise<RoutingOutboundResult> {
    if (!destination.aeTitle || !destination.host || !destination.port) {
        return {
            outcome: "failed",
            error: "Destination DIMSE configuration is incomplete",
        };
    }

    const dimseConfig = await AppDataSource.getRepository(
        DimseConfigEntity,
    ).findOne({
        where: { workspaceId: job.workspaceId },
    });
    if (!dimseConfig) {
        return {
            outcome: "failed",
            error: "Workspace DIMSE configuration not found",
        };
    }

    let lastStatus: number | undefined;

    try {
        await storeInstancesToDestination({
            instances: [instance],
            host: destination.host,
            port: destination.port,
            callingAeTitle: dimseConfig.aeTitle,
            calledAeTitle: destination.aeTitle,
            onStoreResponse: (result) => {
                lastStatus = result.status;
            },
        });
    } catch (error) {
        return {
            outcome: "failed",
            error: error instanceof Error ? error.message : String(error),
        };
    }

    if (lastStatus !== undefined && lastStatus !== Status.Success) {
        return {
            outcome: "failed",
            error: `C-STORE failed with status 0x${lastStatus.toString(16)}`,
        };
    }

    return { outcome: "succeeded" };
}

async function executeDicomwebOutbound(
    instance: InstanceEntity,
    destination: RoutingDestinationEntity,
): Promise<RoutingOutboundResult> {
    if (!destination.baseUrl) {
        return {
            outcome: "failed",
            error: "Destination base URL is missing",
        };
    }

    const dicomBytes = await readInstanceBytes(instance.instancePath);
    const arrayBuffer = dicomBytes.buffer.slice(
        dicomBytes.byteOffset,
        dicomBytes.byteOffset + dicomBytes.byteLength,
    ) as ArrayBuffer;

    return sendStowRs({
        baseUrl: destination.baseUrl,
        authType: destination.authType ?? "none",
        authUsername: destination.authUsername,
        authSecretEncrypted: destination.authSecretEncrypted,
        dicomBytes: arrayBuffer,
    });
}

export async function executeRoutingJob(
    job: RoutingJobEntity,
): Promise<RoutingOutboundResult> {
    const instance = await AppDataSource.getRepository(InstanceEntity).findOne(
        {
            where: {
                workspaceId: job.workspaceId,
                sopInstanceUid: job.sopInstanceUid,
            },
        },
    );
    if (!instance) {
        return { outcome: "failed", error: "Instance not found" };
    }

    const destination = await AppDataSource.getRepository(
        RoutingDestinationEntity,
    ).findOne({
        where: { id: job.destinationId, workspaceId: job.workspaceId },
    });
    if (!destination) {
        return { outcome: "failed", error: "Routing destination not found" };
    }
    if (!destination.enabled) {
        return { outcome: "failed", error: "Routing destination is disabled" };
    }

    if (destination.type === "dimse") {
        return executeDimseOutbound(job, instance, destination);
    }

    return executeDicomwebOutbound(instance, destination);
}
