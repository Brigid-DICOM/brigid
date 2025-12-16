export const SHARE_PERMISSIONS = {
    READ: 1 << 0,
    UPDATE: 1 << 1,
    FULL: (1 << 2) - 1,
} as const;

export const SHARE_PERMISSIONS_NAMES = {
    [SHARE_PERMISSIONS.READ]: "READ",
    [SHARE_PERMISSIONS.UPDATE]: "UPDATE",
    [SHARE_PERMISSIONS.FULL]: "FULL",
} as const;

export type SharePermissionsType =
    (typeof SHARE_PERMISSIONS)[keyof typeof SHARE_PERMISSIONS];

export const PBKDF2_ITERATIONS = 600000;
export const PBKDF2_KEYLEN = 64;
export const PBKDF2_DIGEST = "sha512";
