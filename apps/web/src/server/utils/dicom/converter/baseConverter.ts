import { writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
    type IMagickImage,
    ImageMagick,
    initializeImageMagick,
    MagickFormat,
    MagickGeometry,
} from "@imagemagick/magick-wasm";
import { join } from "desm";
import type { ImageTranscodeParamClass } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/img/ImageTranscodeParam";
import type {
    ConvertOptions,
    ConvertResult,
    DicomSource,
} from "@/server/types/dicom/convert";
import type { DicomToImageConverter } from "./covert.interface";

export abstract class BaseConverter implements DicomToImageConverter {
    public abstract convert(
        source: DicomSource,
        options: ConvertOptions,
    ): Promise<ConvertResult>;

    public abstract getMimeType(): string;

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
            MagickFormat.Jpeg,
            async (image) => {
                await this.handleQuality(image, options);
                await this.handleViewport(image, options);
                await this.handleImageICCProfile(image, options);

                await image.write(MagickFormat.Jpeg, async (data) => {
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
