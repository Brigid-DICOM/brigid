import type { ConvertOptions, ConvertResult, DicomSource } from "@/server/types/dicom/convert";
import type { DicomToImageConverter } from "./covert.interface";

export class PngConverter implements DicomToImageConverter {
    convert(source: DicomSource, options: ConvertOptions): Promise<ConvertResult> {
        throw new Error("Not implemented");
    }
}