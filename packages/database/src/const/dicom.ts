export const DICOM_DELETE_STATUS = {
    "ACTIVE": 0,
    "RECYCLED": 1,
    "DELETED": 2,
} as const;

export const PATIENT_SEX = {
    "MALE": "M",
    "FEMALE": "F",
    "OTHER": "O",
} as const;

export const DICOM_INSTANCE_AVAILABILITY = {
    "ONLINE": "ONLINE",
    "NEARLINE": "NEARLINE",
    "OFFLINE": "OFFLINE",
    "UNAVAILABLE": "UNAVAILABLE",
} as const;