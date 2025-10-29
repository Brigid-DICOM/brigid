import type { ReadStream } from "node:fs";
import type { Readable } from "node:stream";
import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import env from "@brigid/env";
import type { Context } from "hono";
import { z } from "zod";
import type { DicomSource } from "@/server/types/dicom/convert";
import { getDicomToImageConverter } from "@/server/utils/dicom/converter/converterFactory";
import { toConvertOptions } from "@/server/utils/dicom/converter/convertOptions";
import { resolveOutputFormat } from "@/server/utils/dicom/converter/formatUtils";
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
        const storage = getStorageProvider();
        const acceptType = parseAcceptHeader(accept)?.type || "application/dicom"
        const outputFormat = resolveOutputFormat(acceptType);

        const keys = instances.map(instance => instance.instancePath);
        if (!keys.every(key => key)) {
            return c.json(
                {
                    message: "Instance paths not found"
                },
                404
            );
        }

        const datasets: { 
            stream: ReadStream | Readable; 
            size?: number; 
            contentLocation?: string 
        }[] = [];

        if (!outputFormat) {
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
                acceptType
            );
    
            // @ts-expect-error
            return new Response(multipart.data, {
                headers: {
                    "Content-Type": `multipart/related; boundary=${multipart.boundary}`
                }
            });
        }

        const converter = getDicomToImageConverter(outputFormat);

        for (const instance of instances) {
            const key = instance.instancePath;
            const convertOptions = toConvertOptions({
                ...c.req.query(),
            });
            const { body } = await storage.downloadFile(key);

            const source: DicomSource = { kind: "stream", stream: body };

            const result = await converter.convert(source, convertOptions);

            for (const frame of result.frames) {
                datasets.push({
                    stream: frame.stream,
                    size: frame.size,
                    contentLocation: 
                    `${env.NEXT_PUBLIC_APP_URL}/api/workspaces/${instance.workspaceId}` + 
                    `/studies/${instance.studyInstanceUid}` +
                    `/series/${instance.seriesInstanceUid}` +
                    `/instances/${instance.sopInstanceUid}` +
                    `/frames/${frame.index}/rendered`
                });
            }
        }

        const multipart = multipartMessage.multipartEncodeByStream(
            datasets,
            undefined, // default to use guid boundary
            acceptType
        );

        // @ts-expect-error
        return new Response(multipart.data, {
            headers: {
                "Content-Type": `multipart/related; type="${acceptType}"; boundary=${multipart.boundary}`
            }
        });
    }
}
