import { SHARE_PERMISSIONS, SHARE_PERMISSIONS_NAMES } from "@/server/const/share.const";
import { hasPermission } from "@/server/utils/sharePermissions";

export function toggleSharePermission(currentPermissions: number, permission: number) {
    let newPermissions = currentPermissions;
    if (permission === SHARE_PERMISSIONS.READ) {
        if (hasPermission(currentPermissions, SHARE_PERMISSIONS.READ)) {
            newPermissions = 0;
        } else {
            newPermissions = currentPermissions | SHARE_PERMISSIONS.READ;
        }
    } else {
        if (hasPermission(currentPermissions, permission)) {
            newPermissions = newPermissions & ~permission;
        } else {
            newPermissions = currentPermissions | permission | SHARE_PERMISSIONS.READ;
        }
    }

    return newPermissions;
}

export function getSharePermissionNames(permissions: number) {
    const names = [];
    
    if (hasPermission(permissions, SHARE_PERMISSIONS.READ)) {
        names.push(SHARE_PERMISSIONS_NAMES[SHARE_PERMISSIONS.READ]);
    }
    if (hasPermission(permissions, SHARE_PERMISSIONS.UPDATE)) {
        names.push(SHARE_PERMISSIONS_NAMES[SHARE_PERMISSIONS.UPDATE]);
    }

    if (names.length === 0) {
        return "No permissions";
    }

    return names.join("·");
}