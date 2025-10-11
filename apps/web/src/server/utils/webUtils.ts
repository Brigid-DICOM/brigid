/**
 * @description
 * parse the header to object
 * @example
 * parseAcceptHeader('multipart/related; type="application/dicom";transfer-syntax=1.2.840.10008.1.2.4.50;');
 *
 * return
 * <pre>
 *  {
 *       "type": "application/dicom",
 *       "isMultipart": true,
 *       "params": {
 *           "transfer-syntax": "1.2.840.10008.1.2.4.50"
 *       }
 *   }
 * </pre>
 *
 * @param {string} acceptHeader
 */
export const parseAcceptHeader = (acceptHeader: string) => {
    if (!acceptHeader) return null;

    const priority = [
        "image/jpeg",
        "image/jp2",
        "image/png",
        // "image/jpx", // not support yet
        // "image/jls", // not support yet
        "application/dicom",
        "application/octet-stream"
    ];

    const acceptTypes = acceptHeader.split(",").map((item) => {
        // trim space and parse params
        const [type, ...params] = item.trim().split(";");
        const paramMap = Object.fromEntries(
            params.map((param) => {
                const [key, value] = param.split("=").map((s) => s.trim());
                return [key, value.replace(/(^"|"$)/g, "")]; // remote double quote
            })
        );
        return { type, params: paramMap };
    });

    // process with single type first
    for (const type of priority) {
        const singleType = acceptTypes.find((accept) => accept.type === type);
        if (singleType) {
            return { type, isMultipart: false, params: singleType.params };
        }
    }

    // process multipart/related
    for (const type of priority) {
        const multipart = acceptTypes.find(
            (accept) =>
                accept.type === "multipart/related" &&
                accept.params.type === type
        );
        if (multipart) {
            return {
                type: multipart.params.type,
                isMultipart: true,
                params: multipart.params
            };
        }
    }

    return null; // no match
};
