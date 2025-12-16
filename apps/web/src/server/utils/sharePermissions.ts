import type { SharePermissionsType } from "../const/share.const";

export function hasPermission(perm: number, flag: SharePermissionsType) {
    return (perm & flag) === flag;
}

export function addPermissions(perm: number, flag: SharePermissionsType) {
    return perm | flag;
}

export function removePermissions(perm: number, flag: SharePermissionsType) {
    return perm & ~flag;
}
