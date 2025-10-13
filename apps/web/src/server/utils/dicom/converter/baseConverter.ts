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
import type { ImageTranscodeParamClass } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/img/ImageTranscodeParam";
import type { Transcoder$Format } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/img/Transcoder$Format";

import tmp from "tmp";
import type {
    ConvertOptions,
    ConvertResult,
    DicomSource,OutputFormat 
} from "@/server/types/dicom/convert";
import type { DicomToImageConverter } from "./covert.interface";


export abstract class BaseConverter implements DicomToImageConverter {
    
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
        const tempFiles: string[] = [];

        if (source.kind !== "stream") {
            throw new Error("Not implemented");
        } else {
            const tmpFile = tmp.fileSync();
            tempFiles.push(tmpFile.name);

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
                    const destFile = `${tmpFile.name}.${i}.${this.getFileExtension()}`;
                    writeFileSync(destFile, "");
                    tempFiles.push(destFile);
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
                    tempFiles,
                    contentType: this.getMimeType() as OutputFormat,
                };
            } else {
                const destFile = `${tmpFile.name}.${this.getFileExtension()}`;
                writeFileSync(destFile, "");
                tempFiles.push(destFile);
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
                    tempFiles,
                    contentType: this.getMimeType() as OutputFormat,
                };
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
        const magickWasmPath = path.resolve(
            "node_modules/@imagemagick/magick-wasm/dist/magick.wasm",
        );
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
                case "yes":
                    // TODO: implement
                    break;
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
            }
        }
    }
}
