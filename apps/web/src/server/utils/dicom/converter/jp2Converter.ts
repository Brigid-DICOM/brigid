import { MagickFormat } from "@imagemagick/magick-wasm";
import type { Transcoder$FormatClass } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/img/Transcoder$Format";
import { BaseConverter } from "./baseConverter";

export class Jp2Converter extends BaseConverter {
    getMimeType(): string {
        return "image/jp2";
    }

    protected async getTranscodeFormat(): Promise<Transcoder$FormatClass> {
        const { Transcoder$Format } = await import(
            "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/img/Transcoder$Format"
        );

        return Transcoder$Format.JP2 as Transcoder$FormatClass;
    }

    protected getMagickFormat(): MagickFormat {
        return MagickFormat.Jp2;
    }

    getFileExtension(): string {
        return "jp2";
    }
}
