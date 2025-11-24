import { ChevronDownIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem, 
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { getSharePermissionNames } from "@/lib/share/sharePermissionUtils";
import {
    SHARE_PERMISSIONS
} from "@/server/const/share.const";
import {
    hasPermission
} from "@/server/utils/sharePermissions";

type SharePermissionDropdownProps = 
| {
    mode: "public",
    publicPermissions: number;
    onTogglePermission: (permission: number) => void;
    id: string;
} | {
    mode: "user",
    user: {
        id: string;
        name: string;
        permissions: number;
    },
    onTogglePermission: (userId: string, permission: number) => void;
    id: string;
}

export function SharePermissionDropdown(props: SharePermissionDropdownProps) {
    const id = props.id || nanoid();
    const permissions = props.mode === "public" ? props.publicPermissions : props.user.permissions;

    const handleTogglePermission = (permission: number) => {
        if (props.mode === "public") {
            props.onTogglePermission(permission);
        } else {
            props.onTogglePermission(props.user.id, permission);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild id={id}>
                <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="p-0 has-[>svg]:px-0 justify-start"
                >
                    {getSharePermissionNames(permissions)}
                    <ChevronDownIcon className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2" align="start">
                <DropdownMenuCheckboxItem
                    className="flex flex-col items-start justify-center hover:bg-accent"
                    checked={hasPermission(
                        permissions,
                        SHARE_PERMISSIONS.READ
                    )}
                    onCheckedChange={() => handleTogglePermission(SHARE_PERMISSIONS.READ)}
                    onSelect={(e) => e.preventDefault()}
                >
                    <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap">Read</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Allow to view/download the DICOM.
                    </p>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    className="flex flex-col items-start justify-center hover:bg-accent"
                    checked={hasPermission(
                        permissions,
                        SHARE_PERMISSIONS.UPDATE
                    )}
                    onCheckedChange={() => handleTogglePermission(SHARE_PERMISSIONS.UPDATE)}
                    onSelect={(e) => e.preventDefault()}
                >
                    <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap">Update</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Allow to edit the metadata of the DICOM.
                    </p>
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
