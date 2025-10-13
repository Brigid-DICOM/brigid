import {
    createReadStream,
    createWriteStream,
    type ReadStream,
    statSync,
    writeFileSync,
} from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import tmp from "tmp";
import type {
    ConvertOptions,
    ConvertResult,
    DicomSource,
    OutputFormat,
} from "@/server/types/dicom/convert";
import { BaseConverter } from "./baseConverter";

export class JpegConverter extends BaseConverter {
    async convert(
        source: DicomSource,
        options: ConvertOptions,
    ): Promise<ConvertResult> {
        const { Dcm2imageWrapper } = await import(
            "raccoon-dcm4che-bridge/src/dcm2img"
        );
        const { DicomFileInputStream } = await import(
            "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/img/stream/DicomFileInputStream"
        );
        const { Tag } = await import(
            "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Tag"
        );

        if (source.kind !== "stream") {
            throw new Error("Not implemented");
        } else {
            const tmpFile = tmp.fileSync();

            await pipeline(source.stream, createWriteStream(tmpFile.name));

            const imageTranscodeParam =
                await this.getImageTranscodeParam(options);

            const dicomFileInputStream =
                await DicomFileInputStream.newInstanceAsync(
                    path.resolve(tmpFile.name),
                );
            const dataset = await dicomFileInputStream.readDataset();
            const numberOfFramesStr = await dataset?.getString(
                Tag.NumberOfFrames,
            );
            const numberOfFrames = parseInt(numberOfFramesStr || "1", 10);

            const frames: {
                stream: ReadStream;
                index: number;
                size?: number;
            }[] = [];
            if (numberOfFrames > 1) {
                for (let i = 1; i <= numberOfFrames; i++) {
                    const destFile = `${tmpFile.name}.${i}.jpg`;
                    writeFileSync(destFile, "");
                    await Dcm2imageWrapper.dcm2Image(
                        tmpFile.name,
                        destFile,
                        imageTranscodeParam,
                        i,
                    );

                    await this.handleConvertOptions(destFile, options);

                    frames.push({
                        stream: createReadStream(destFile),
                        index: i,
                        size: statSync(destFile).size,
                    });
                }

                return {
                    frames,
                    contentType: "image/jpeg" as OutputFormat,
                };
            } else {
                const destFile = `${tmpFile.name}.jpg`;
                writeFileSync(destFile, "");
                await Dcm2imageWrapper.dcm2Image(
                    tmpFile.name,
                    destFile,
                    imageTranscodeParam,
                    1,
                );

                await this.handleConvertOptions(destFile, options);

                return {
                    frames: [
                        {
                            stream: createReadStream(destFile),
                            index: 1,
                            size: statSync(destFile).size,
                        },
                    ],
                    contentType: "image/jpeg" as OutputFormat,
                };
            }
        }
    }

    getMimeType(): string {
        return "image/jpeg";
    }
}
