import type { OutputFormat } from "@/server/types/dicom/convert";
import type { DicomToImageConverter } from "./covert.interface";
import { Jp2Converter } from "./jp2Converter";
import { JpegConverter } from "./jpegConverter";
import { PngConverter } from "./pngConverter";

export function getDicomToImageConverter(format: OutputFormat): DicomToImageConverter {
    switch (format) {
        case "jpeg":
            return new JpegConverter();
        case "jp2":
            return new Jp2Converter();
        case "png":
            return new PngConverter();
        default:
            throw new Error(`Unsupported format: ${format}`);
    }
}