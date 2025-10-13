import {
    createReadStream,
    createWriteStream,
    type ReadStream,
    statSync,
    writeFileSync,
} from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import type { IMagickImage } from "@imagemagick/magick-wasm";
import {
    ImageMagick,
    initializeImageMagick,
    MagickFormat,
    MagickGeometry,
} from "@imagemagick/magick-wasm";
import { join } from "desm";
import type { ImageTranscodeParamClass } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/img/ImageTranscodeParam";
import tmp from "tmp";
import type {
    ConvertOptions,
    ConvertResult,
    DicomSource,
    OutputFormat,
} from "@/server/types/dicom/convert";
import type { DicomToImageConverter } from "./covert.interface";

export class JpegConverter implements DicomToImageConverter {
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

    private async getImageTranscodeParam(
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
        const { Transcoder$Format } = await import(
            "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/img/Transcoder$Format"
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
            Transcoder$Format.JPEG,
        );
        return imageTranscodeParam;
    }

    private async handleConvertOptions(
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
            MagickFormat.Jpeg,
            async (image) => {
                await this.handleViewport(image, options);
                await this.handleImageICCProfile(image, options);

                await image.write(MagickFormat.Jpeg, async (data) => {
                    return writeFileSync(path.resolve(filename), data);
                });
            },
        );
    }

    private async handleViewport(image: IMagickImage, options: ConvertOptions) {
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

    private async handleImageICCProfile(
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
