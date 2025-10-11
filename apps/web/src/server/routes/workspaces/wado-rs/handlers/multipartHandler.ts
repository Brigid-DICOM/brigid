import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import env from "@brigid/env";
import type { Context } from "hono";
import { z } from "zod";
import multipartMessage from "@/server/utils/multipartMessage";
import { getStorageProvider } from "@/server/utils/storage/storageFactory";
import { parseAcceptHeader } from "@/server/utils/webUtils";
import type { WadoResponseHandler } from "./wadoResponseHandler.interface";

export class MultipartHandler implements WadoResponseHandler {
    canHandle(accept: string): boolean {
        const multipartAcceptSchema = z.enum([
            'multipart/related; type="application/dicom"',
            'multipart/related; type="application/octet-stream"',
            'multipart/related; type="image/jpeg"',
            'multipart/related; type="image/jp2"',
            'multipart/related; type="image/png"',
            "*/*"
        ]);

        return multipartAcceptSchema.safeParse(accept).success;
    }

    async handle(
        c: Context,
        args: { instances: InstanceEntity[]; accept: string }
    ): Promise<Response> {
        const { instances, accept } = args;

        const keys = instances.map(instance => instance.instancePath);
        if (!keys.every(key => key)) {
            return c.json(
                {
                    message: "Instance paths not found"
                },
                404
            );
        }

        // TODO: dicom image converter (jpeg, jp2, png)

        const storage = getStorageProvider();
        
        const datasets = [];
        for (const instance of instances) {
            const key = instance.instancePath;
            const { body, size } = await storage.downloadFile(key);
            datasets.push({
                stream: body,
                size,
                contentLocation: 
                `${env.NEXT_PUBLIC_APP_URL}/api/workspaces/${instance.workspaceId}` + 
                `/studies/${instance.studyInstanceUid}` +
                `/series/${instance.seriesInstanceUid}` +
                `/instances/${instance.sopInstanceUid}`
            });
        }
        
        const multipart = multipartMessage.multipartEncodeByStream(
            datasets,
            undefined, // default to use guid boundary
            parseAcceptHeader(accept)?.type || "application/dicom"
        );

        // @ts-expect-error
        return new Response(multipart.data, {
            headers: {
                "Content-Type": `multipart/related; boundary=${multipart.boundary}`
            }
        });
    }
}
