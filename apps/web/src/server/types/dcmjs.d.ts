declare module "dcmjs" {
    export namespace data {
        type DicomDenaturalizedDataset = Record<string, unknown>;

        interface DicomDictWriteOptions {
            [key: string]: unknown;
        }

        class DicomDict {
            constructor(meta?: DicomDenaturalizedDataset);
            dict?: DicomDenaturalizedDataset;
            write(options?: DicomDictWriteOptions): ArrayBuffer;
        }

        const DicomMetaDictionary: {
            denaturalizeDataset(
                dataset: Record<string, unknown>,
            ): DicomDenaturalizedDataset;
            naturalizeDataset(
                dataset: DicomDenaturalizedDataset,
            ): Record<string, unknown>;
        };

        class DicomMessage {
            static readFile(buffer: ArrayBuffer): {
                meta: DicomDenaturalizedDataset;
                dict: DicomDenaturalizedDataset;
            };
        }
    }
}
