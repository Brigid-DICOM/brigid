import { MagickFormat } from "@imagemagick/magick-wasm";
import type { Transcoder$FormatClass } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/img/Transcoder$Format";
import { BaseConverter } from "./baseConverter";

export class JpegConverter extends BaseConverter {
    getMimeType(): string {
        return "image/jpeg";
    }

    protected async getTranscodeFormat(): Promise<Transcoder$FormatClass> {
        const { Transcoder$Format } = await import(
            "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/img/Transcoder$Format"
        );

        return Transcoder$Format.JPEG as Transcoder$FormatClass;
    }

    protected getMagickFormat(): MagickFormat {
        return MagickFormat.Jpeg;
    }

    getFileExtension(): string {
        return "jpg";
    }
}
