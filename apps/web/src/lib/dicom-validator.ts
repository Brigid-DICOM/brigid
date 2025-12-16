/**
 *
 * DICOM files have "DICM" magick number of byte offset 128
 */
export async function isDicomFile(file: File): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;

            if (!arrayBuffer || arrayBuffer.byteLength < 132) {
                resolve(false);
                return;
            }

            const bytes = new Uint8Array(arrayBuffer);
            const dicmString = String.fromCharCode(
                bytes[128],
                bytes[129],
                bytes[130],
                bytes[131],
            );

            resolve(dicmString === "DICM");
        };

        reader.onerror = () => resolve(false);

        reader.readAsArrayBuffer(file.slice(0, 132));
    });
}

export interface DicomValidationResult {
    file: File;
    isValid: boolean;
    validationError?: string;
}

export async function validateDicomFiles(
    files: File[],
): Promise<DicomValidationResult[]> {
    const validations = await Promise.all(
        files.map(async (file) => {
            const isValid = await isDicomFile(file);
            return {
                file,
                isValid,
                validationError: isValid ? undefined : "Invalid DICOM file",
            } as DicomValidationResult;
        }),
    );

    return validations;
}
