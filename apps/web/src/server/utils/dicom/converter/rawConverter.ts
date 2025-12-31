import {
    createReadStream,
    createWriteStream,
    type ReadStream,
    statSync,
    writeFileSync,
} from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import fsE from "fs-extra";
import { importClassAsync } from "java-bridge";
import type { AttributesClass } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Attributes";
import tmp from "tmp";
import type {
    ConvertOptions,
    ConvertResult,
    DicomSource,
    OutputFormat,
} from "@/server/types/dicom/convert";
import { appLogger } from "@/server/utils/logger";
import type { DicomToImageConverter } from "./covert.interface";

const logger = appLogger.child({
    module: "RawConverter",
});

export class RawConverter implements DicomToImageConverter {
    private dicomDataset: AttributesClass | null = null;

    getMimeType(): string {
        return "application/octet-stream";
    }

    async convert(
        source: DicomSource,
        options: ConvertOptions,
    ): Promise<ConvertResult> {
        const { Tag } = await import(
            "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Tag"
        );

        const { DicomFileInputStream } = await import(
            "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/img/stream/DicomFileInputStream"
        );

        if (source.kind !== "stream") {
            throw new Error("Not implemented");
        } else {
            const tmpFile = tmp.fileSync();
            await pipeline(source.stream, createWriteStream(tmpFile.name));

            const dicomFileInputStream =
                await DicomFileInputStream.newInstanceAsync(
                    path.resolve(tmpFile.name),
                );
            this.dicomDataset = await dicomFileInputStream.readDataset(
                -1,
                Tag.PixelData,
            );
            const numberOfFramesStr = await this.dicomDataset?.getString(
                Tag.NumberOfFrames,
            );
            const numberOfFrames = parseInt(numberOfFramesStr || "1", 10);

            const metaInfo =
                (await dicomFileInputStream.readFileMetaInformation()) as AttributesClass;
            const transferSyntaxUid = await metaInfo.getString(
                Tag.TransferSyntaxUID,
            );

            const generateRawFrameFn =
                transferSyntaxUid === "1.2.840.10008.1.2" ||
                transferSyntaxUid === "1.2.840.10008.1.2.1"
                    ? this.generateUncompressedRawFrameStream
                    : this.generateRawFrameStream;
            const frames: {
                stream: ReadStream;
                index: number;
                size?: number;
            }[] = [];
            if (numberOfFrames > 1 && !("frameNumber" in options)) {
                for (let i = 1; i <= numberOfFrames; i++) {
                    const destFile = `${tmpFile.name}.${i}.raw`;
                    writeFileSync(destFile, "");
                    await generateRawFrameFn(tmpFile.name, destFile, i);

                    const fileStream = createReadStream(destFile);
                    fileStream.once("close", async () => {
                        await fsE.remove(destFile);
                        logger.info(
                            `Deleted converted file successfully: ${destFile}`,
                        );

                        fsE.remove(tmpFile.name)
                            .then(() => {
                                logger.info(
                                    `Deleted temp file successfully: ${tmpFile.name}`,
                                );
                            })
                            .catch();
                    });

                    frames.push({
                        stream: fileStream,
                        index: i,
                        size: statSync(destFile).size,
                    });
                }
            } else {
                const inputFrameNumber = Array.isArray(options.frameNumber)
                    ? options.frameNumber[0]
                    : options.frameNumber || 1;
                const destFile = `${tmpFile.name}.${inputFrameNumber}.raw`;
                writeFileSync(destFile, "");

                await generateRawFrameFn(
                    tmpFile.name,
                    destFile,
                    inputFrameNumber,
                );

                const fileStream = createReadStream(destFile);
                fileStream.once("close", async () => {
                    await fsE.remove(destFile);
                    logger.info(
                        `Deleted converted file successfully: ${destFile}`,
                    );

                    fsE.remove(tmpFile.name)
                        .then(() => {
                            logger.info(
                                `Deleted temp file successfully: ${tmpFile.name}`,
                            );
                        })
                        .catch();
                });

                frames.push({
                    stream: fileStream,
                    index: 1,
                    size: statSync(destFile).size,
                });
            }

            return {
                frames,
                contentType: "application/octet-stream" as OutputFormat,
            };
        }
    }

    private async generateRawFrameStream(
        source: string,
        dest: string,
        frameNumber: number,
    ): Promise<void> {
        const { File } = await import(
            "raccoon-dcm4che-bridge/src/wrapper/java/io/File"
        );
        const { DicomInputStream } = await import(
            "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/io/DicomInputStream"
        );
        const { DecompressFramesOutput } = await import(
            "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/img/DecompressFramesOutput"
        );
        const JavaFileOutputStream = await importClassAsync(
            "java.io.FileOutputStream",
        );

        const file = await File.newInstanceAsync(source);
        const dicomInputStream = await DicomInputStream.newInstanceAsync(file);

        const decompressor = await DecompressFramesOutput.newInstanceAsync(
            dicomInputStream,
            frameNumber - 1,
        );

        const outputStream = await JavaFileOutputStream.newInstanceAsync(dest);

        // @ts-expect-error
        await decompressor.write(outputStream);

        await outputStream.close();
        await decompressor.close();
        await dicomInputStream.close();
    }

    private async generateUncompressedRawFrameStream(
        source: string,
        dest: string,
        frameNumber: number,
    ): Promise<void> {
        const { UncompressedFrameOutput } = await import(
            "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/img/UncompressedFrameOutput"
        );
        const JavaFileOutputStream = await importClassAsync(
            "java.io.FileOutputStream",
        );

        const uncompressedFrameOutput = new UncompressedFrameOutput(
            source,
            frameNumber,
        );
        const outputStream = new JavaFileOutputStream(dest);

        try {
            // @ts-expect-error
            await uncompressedFrameOutput.write(outputStream);
        } catch (e) {
            // 有些 dicom 檔案可能 frame length 的長度不正確，導致 StreamUtils 拋出 EOFException 異常
            // 但實際應該是有資料的
            // 因此我們可以檢查檔案大小是否為 0，如果為 0，則拋出異常
            const fileSize = (await stat(dest)).size;
            if (fileSize === 0) {
                throw e;
            }
        }
        await outputStream.close();

        await uncompressedFrameOutput.close();
    }
}
