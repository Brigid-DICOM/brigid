import type { ReadStream } from "node:fs";

export type OutputFormat = "jpeg" | "jp2" | "png" | "raw";

export type DicomSource =
    | { kind: "filePath", path: string }
    | { kind: "stream", stream: Readable };

export type ConvertResult = {
    contentType: OutputFormat;
    frames: {
        stream: ReadStream;
        index: number;
        size?: number;
    }[];
}

export type ConvertOptions = {
    quality?: number;
    frameNumber?: number;
    windowWidth?: number;
    windowCenter?: number;
    voiLutFunction?: "linear" | "linear-exact" | "sigmoid";
    resize?: {
        width?: number;
        height?: number;
    },
    crop?: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    },
    profile?: "no" | "yes" | "srgb" | "adobergb" | "rommrgb" | "displayp3";
    region?: {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
    };
}