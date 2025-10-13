import type { ConvertOptions, ConvertResult, DicomSource } from "@/server/types/dicom/convert";
import { BaseConverter } from "./baseConverter";

export class Jp2Converter extends BaseConverter{
    convert(source: DicomSource, options: ConvertOptions): Promise<ConvertResult> {
        throw new Error("Not implemented");
    }

    getMimeType(): string {
        return "image/jp2";
    }
}