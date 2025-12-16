import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import type { Context } from "hono";
import { z } from "zod";
import type { ConvertResult, DicomSource } from "@/server/types/dicom/convert";
import { getDicomToImageConverter } from "@/server/utils/dicom/converter/converterFactory";
import { toConvertOptions } from "@/server/utils/dicom/converter/convertOptions";
import { resolveOutputFormat } from "@/server/utils/dicom/converter/formatUtils";
import { getStorageProvider } from "@/server/utils/storage/storageFactory";
import { parseAcceptHeader } from "@/server/utils/webUtils";
import type { WadoResponseHandler } from "./wadoResponseHandler.interface";

export class SingleFrameHandler implements WadoResponseHandler {
    canHandle(accept: string) {
        const acceptSchema = z.enum([
            "image/jpeg",
            "image/jp2",
            "image/png",
            "*/*",
        ]);

        return acceptSchema.safeParse(accept).success;
    }

    async handle(
        c: Context,
        args: { instances: InstanceEntity[]; accept: string },
    ) {
        const { instances, accept } = args;
        const storage = getStorageProvider();
        const acceptType = parseAcceptHeader(accept)?.type || "image/jpeg";
        const outputFormat = resolveOutputFormat(acceptType) || "jpeg";

        const keys = instances.map((instance) => instance.instancePath);
        if (!keys.every((key) => key)) {
            return c.json(
                {
                    message: "Instance paths not found",
                },
                404,
            );
        }

        const converter = getDicomToImageConverter(outputFormat);
        let result: ConvertResult | undefined;
        for (const instance of instances) {
            const key = instance.instancePath;

            const convertOptions = toConvertOptions({
                ...c.req.query(),
            });
            const { body } = await storage.downloadFile(key);

            const source: DicomSource = { kind: "stream", stream: body };

            result = await converter.convert(source, convertOptions);
        }

        if (!result?.frames.length) {
            return c.json(
                {
                    message: "No frames found",
                },
                404,
            );
        }

        // @ts-expect-error
        return new Response(result?.frames[0].stream, {
            headers: {
                "Content-Type": result?.contentType,
                "Content-Length": result?.frames[0].size?.toString() || "0",
            },
        });
    }
}
