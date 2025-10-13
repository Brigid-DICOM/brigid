import type { ConvertOptions, ConvertResult, DicomSource } from "@/server/types/dicom/convert";

export interface DicomToImageConverter {
    convert(source: DicomSource, options: ConvertOptions): Promise<ConvertResult>;

    getMimeType(): string;
}