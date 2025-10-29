import { createReadStream, createWriteStream, type ReadStream, statSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import {
    type IMagickImage,
    ImageMagick,
    initializeImageMagick,
    type MagickFormat,
    MagickGeometry,
} from "@imagemagick/magick-wasm";
import { join } from "desm";
import fsE from "fs-extra";
import { HTTPException } from "hono/http-exception";
import type { AttributesClass} from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Attributes";
import type { ImageTranscodeParamClass } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/img/ImageTranscodeParam";
import type { Transcoder$Format } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/img/Transcoder$Format";
import tmp from "tmp";
import type {
    ConvertOptions,
    ConvertResult,
    DicomSource,OutputFormat 
} from "@/server/types/dicom/convert";
import { appLogger } from "@/server/utils/logger";
import type { DicomToImageConverter } from "./covert.interface";

const logger = appLogger.child({
    module: "BaseConverter"
});

export abstract class BaseConverter implements DicomToImageConverter {

    private dicomDataset: AttributesClass | null = null;
    
    public abstract getMimeType(): string;
    
    protected abstract getTranscodeFormat(): Promise<Transcoder$Format>;
    
    protected abstract getMagickFormat(): MagickFormat;

    protected abstract getFileExtension(): string;

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
            this.dicomDataset = await dicomFileInputStream.readDataset(-1, Tag.PixelData);
            const numberOfFramesStr = await this.dicomDataset?.getString(
                Tag.NumberOfFrames,
            );
            const numberOfFrames = parseInt(numberOfFramesStr || "1", 10);

            const frames: {
                stream: ReadStream;
                index: number;
                size?: number;
            }[] = [];

            const frameNumbers = (() => {
                if (!options.frameNumber) {
                    return numberOfFrames > 1 ? 
                    Array.from({ length: numberOfFrames }, (_, i) => i + 1) : [1];
                }

                if (Array.isArray(options.frameNumber)) {
                    return options.frameNumber;
                }

                return [options.frameNumber];
            })();

            for (const frameNumber of frameNumbers) {
                if (frameNumber > numberOfFrames || frameNumber < 1) {
                    throw new HTTPException(400, {
                        message: `Invalid frame number: ${frameNumber}. Valid range: 1-${numberOfFrames}`
                    });
                }
            }

            for (const frameNumber of frameNumbers) {
                const destFile = `${tmpFile.name}.${frameNumber}.${this.getFileExtension()}`;
                writeFileSync(destFile, "");
                await Dcm2imageWrapper.dcm2Image(
                    tmpFile.name,
                    destFile,
                    imageTranscodeParam,
                    frameNumber
                );

                await this.handleConvertOptions(destFile, options);
                const fileStream = createReadStream(destFile);
                fileStream.once("close", async () => {
                    await fsE.remove(destFile);
                    logger.info(`Deleted converted file successfully: ${destFile}`);
                    
                    if (frameNumber === frameNumbers[frameNumbers.length - 1]) {
                        // Clean up temp file on last frame
                        fsE.remove(tmpFile.name).then(() => {
                            logger.info(`Deleted temp file successfully: ${tmpFile.name}`);
                        }).catch();
                    }
                });

                frames.push({
                    stream: fileStream,
                    index: frameNumber,
                    size: statSync(destFile).size,
                });
            }

            return {
                frames,
                contentType: this.getMimeType() as OutputFormat,
            }
        }
    }

    protected async getImageTranscodeParam(
        options: ConvertOptions,
    ): Promise<ImageTranscodeParamClass> {
        const { DicomImageReadParam } = await import(
            "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/img/DicomImageReadParam"
        );
        const { ImageTranscodeParam } = await import(
            "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/img/ImageTranscodeParam"
        );
        const { LutShape } = await import(
            "raccoon-dcm4che-bridge/src/wrapper/org/weasis/opencv/op/lut/LutShape"
        );

        const dicomImageReadParam = new DicomImageReadParam();
        if (options.windowCenter && options.windowWidth) {
            await dicomImageReadParam.setWindowWidth(options.windowWidth);
            await dicomImageReadParam.setWindowCenter(options.windowCenter);
        }

        if (options.voiLutFunction) {
            switch (options.voiLutFunction) {
                case "linear":
                    await dicomImageReadParam.setVoiLutShape(LutShape.LINEAR);
                    break;
                case "linear-exact":
                    await dicomImageReadParam.setVoiLutShape(LutShape.LINEAR);
                    break;
                case "sigmoid":
                    await dicomImageReadParam.setVoiLutShape(LutShape.SIGMOID);
                    break;
            }
        }

        const imageTranscodeParam = new ImageTranscodeParam(
            dicomImageReadParam,
            await this.getTranscodeFormat(),
        );
        return imageTranscodeParam;
    }

    protected async handleConvertOptions(
        filename: string,
        options: ConvertOptions,
    ) {
        const magickWasmPath = await this.resolveMagickWasmPath();
        const magickWasmBuffer = await readFile(magickWasmPath);

        await initializeImageMagick(magickWasmBuffer);

        const imageBuffer = await readFile(path.resolve(filename));
        await ImageMagick.read(
            imageBuffer,
            this.getMagickFormat(),
            async (image) => {
                await this.handleQuality(image, options);
                await this.handleViewport(image, options);
                await this.handleImageICCProfile(image, options);
                await this.handleRegion(image, options, image.width, image.height);

                await image.write(this.getMagickFormat(), async (data) => {
                    return writeFileSync(path.resolve(filename), data);
                });
            },
        );
    }

    protected async handleQuality(
        image: IMagickImage,
        options: ConvertOptions,
    ) {
        if (
            this.getMimeType() === "image/jpeg" ||
            this.getMimeType() === "image/png"
        ) {
            if (options.quality) {
                image.quality = options.quality;
            }
        }
    }

    protected async handleViewport(
        image: IMagickImage,
        options: ConvertOptions,
    ) {
        if (options.resize) {
            if (options.resize?.width && options.resize?.height) {
                image.resize(options.resize.width, options.resize.height);
            }

            if (options.crop) {
                if (
                    "x" in options.crop &&
                    "y" in options.crop &&
                    "width" in options.crop &&
                    "height" in options.crop
                ) {
                    const cropX = options.crop.x || 0;
                    const cropY = options.crop.y || 0;
                    let cropWidth = options.crop.width || 0;
                    if (cropWidth && cropWidth < 0) {
                        image.flip();
                        cropWidth = -cropWidth;
                    }

                    let cropHeight = options.crop.height || 0;
                    if (cropHeight && cropHeight < 0) {
                        image.flop();
                        cropHeight = -cropHeight;
                    }

                    image.crop(
                        new MagickGeometry(cropX, cropY, cropWidth, cropHeight),
                    );
                }
            }
        }
    }

    protected async handleImageICCProfile(
        image: IMagickImage,
        options: ConvertOptions,
    ) {
        if (options.profile) {
            switch (options.profile) {
                case "no":
                    break;
                case "yes": {
                    const { Tag } = await import(
                        "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Tag"
                    );
                    let iccProfileBytes: Buffer | null = null;
                    if (this.dicomDataset) {
                        iccProfileBytes = await this.dicomDataset.getBytes(Tag.ICCProfile);
                        if (!iccProfileBytes) {
                            const opticalPath = await this.dicomDataset.getNestedDataset(Tag.OpticalPathSequence);
                            if (opticalPath) {
                                iccProfileBytes = await opticalPath.getBytes(Tag.ICCProfile);
                            }
                        }
                    }

                    if (iccProfileBytes) {
                        image.setProfile("icc", iccProfileBytes);
                    }
                    break;
                }
                case "srgb": {
                    const srgbProfile = await readFile(
                        path.resolve(
                            join(import.meta.url, "iccprofiles/sRGB.icc"),
                        ),
                    );
                    image.setProfile("icc", srgbProfile);
                    break;
                }
                case "adobergb": {
                    const adobergbProfile = await readFile(
                        path.resolve(
                            join(import.meta.url, "iccprofiles/adobeRGB.icc"),
                        ),
                    );
                    image.setProfile("icc", adobergbProfile);
                    break;
                }
                case "rommrgb": {
                    const rommrgbProfile = await readFile(
                        path.resolve(
                            join(import.meta.url, "iccprofiles/rommRGB.icc"),
                        ),
                    );
                    image.setProfile("icc", rommrgbProfile);
                    break;
                }
                case "displayp3": {
                    const displayp3Profile = await readFile(
                        path.resolve(
                            join(import.meta.url, "iccprofiles/Display-P3.icc"),
                        ),
                    );
                    image.setProfile("icc", displayp3Profile);
                    break;
                }
            }
        }
    }

    protected async handleRegion(
        image: IMagickImage,
        options: ConvertOptions,
        width: number,
        height: number,
    ) {
        const imageWidth = options.resize?.width || width;
        const imageHeight = options.resize?.height || height;

        if (options.region) {
            const cropX = options.region.xmin * imageWidth;
            const cropY = options.region.ymin * imageHeight;
            const cropWidth = (options.region.xmax - options.region.xmin) * imageWidth;
            const cropHeight = (options.region.ymax - options.region.ymin) * imageHeight;
            image.crop(new MagickGeometry(cropX, cropY, cropWidth, cropHeight));
        }
    }

    private async resolveMagickWasmPath(): Promise<string> {
        const possiblePaths = [
            path.resolve(
                "node_modules/@imagemagick/magick-wasm/dist/magick.wasm"
            ),
            path.resolve(
                "../../node_modules/@imagemagick/magick-wasm/dist/magick.wasm"
            ),
            path.resolve(
                "apps/web/node_modules/@imagemagick/magick-wasm/dist/magick.wasm"
            )
        ];

        for (const wasmPath of possiblePaths) {
            if (await fsE.pathExists(wasmPath)) {
                logger.info(`Found magick.wasm at: ${wasmPath}`);
                return wasmPath;
            }
        }

        const errorMsg = `magick.wasm not found. Searched paths: ${possiblePaths.join(", ")}`;
        logger.error(errorMsg);
        throw new Error(errorMsg);
    }
}
