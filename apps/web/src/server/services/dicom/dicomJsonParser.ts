import type { DicomTag } from "@brigid/types";

export const parseFromFilename = async (filename: string) => {
    const { DicomUtf8Converter } = await import(
        "raccoon-dcm4che-bridge/src/DicomUtf8Converter"
    );
    const { JDcm2Json } = await import("raccoon-dcm4che-bridge/src/dcm2json");

    let dicomJson: Record<string, any>;

    try {
        dicomJson = await JDcm2Json.get(filename);
        return dicomJson as DicomTag;
    } catch (e) {
        if (
            e instanceof Error &&
            e.message.includes("EXITCODE_CANNOT_CONVERT_TO_UNICODE")
        ) {
            console.warn(
                `The file: ${filename} may missing/incorrect (0008,0005) charset, converter dicom to UTF8`,
            );

            try {
                const dicomUtf8Converter = new DicomUtf8Converter(filename);
                await dicomUtf8Converter.convert();

                dicomJson = await JDcm2Json.get(filename);
                return dicomJson as DicomTag;
            } catch (e) {
                console.error(e);
                throw e;
            }
        }

        console.error(e);
        throw e;
    }
};
