export const NAMESPACE_FOR_UUID = "6667dfe3-edaf-45fb-b0f1-e1326cfae1c1";

function generateUidFromGuid(iGuid: string) {
    const guidBytes = `0x${iGuid.replace(/-/g, "")}`; //add prefix 0 and remove `-`
    const bigInteger = BigInt(guidBytes); //As big integer are not still in all browser supported I use BigInteger **) packaged to parse the integer with base 16 from uuid string
    return `2.25.${bigInteger.toString()}`; //Output the previus parsed integer as string by adding `2.25.` as prefix
}

export const DICOM_MEDIA_STORAGE_ID = "BRIGID";

export const DICOM_MEDIA_STORAGE_UID = generateUidFromGuid(NAMESPACE_FOR_UUID);
