import type { WorkspacePermissionsType } from "../const/workspace.const";

export function hasPermission(perm: number, flag: WorkspacePermissionsType) {
    return (perm & flag) === flag;
}

export function addPermissions(perm: number, flag: WorkspacePermissionsType) {
    return perm | flag;
}

export function removePermissions(
    perm: number,
    flag: WorkspacePermissionsType,
) {
    return perm & ~flag;
}
