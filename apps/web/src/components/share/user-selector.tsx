"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useT } from "@/app/_i18n/client";
import { 
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useUserSearch } from "@/hooks/use-user-search";
import { toggleSharePermission } from "@/lib/share/sharePermissionUtils";
import { SHARE_PERMISSIONS } from "@/server/const/share.const";
import { SharePermissionDropdown } from "./share-permission-dropdown";

interface UserOption {
    id: string;
    name: string;
    email: string;
    image?: string;
}

interface SelectedUser {
    userId: string;
    permissions: number;
    user: UserOption;
}

interface UserSelectorProps {
    selected: SelectedUser[];
    onSelect: (user: SelectedUser) => void;
    onRemove: (userId: string) => void;
}

export function UserSelector({
    selected,
    onSelect,
    onRemove,
}: UserSelectorProps) {
    const { t } = useT("translation");
    const {
        searchInput,
        setSearchInput,
        users,
        isSearching,
        isLoading,
        clearSearch
    } = useUserSearch({
        debouncedMs: 300,
        limit: 10
    })

    const handleSelectUser = (user: UserOption) => {
        onSelect({
            userId: user.id,
            permissions: SHARE_PERMISSIONS.READ,
            user,
        });
        clearSearch();
    };

    const handlePermissionChange = (userId: string, permissions: number) => {
        const selectedUser = selected.find((s) => s.userId === userId);
        if (selectedUser) {
            const newPermissions = toggleSharePermission(selectedUser.permissions, permissions);
            if (newPermissions !== selectedUser.permissions) {
                onSelect({
                    ...selectedUser,
                    permissions: newPermissions,
                });
            }
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium" htmlFor="add-users">{t("shareLink.userSelector.addUsers")}</label>
                <div className="relative mt-2">
                    <Command className="bg-background border">
                        <CommandInput
                            id="add-users"
                            placeholder={t("shareLink.userSelector.searchPlaceholder")}
                            value={searchInput}
                            onValueChange={setSearchInput}
                        />
                      
                        {isSearching && (
                            <div className="absolute right-2 top-2.5">
                                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                            </div>
                        )}
                        
                        {searchInput && (
                            <CommandList className="absolute top-full left-0 right-0 z-10 mt-1 border rounded-md bg-background shadow-lg max-h-[200px]">
                                {users.length === 0 ? (
                                    <CommandEmpty>{t("shareLink.userSelector.noUsersFound")}</CommandEmpty>
                                ): (
                                    <CommandGroup>
                                        {users.map((user) => (
                                            <CommandItem
                                                key={user.id}
                                                value={`${user.name} <${user.email}>`}
                                                onSelect={() => handleSelectUser({
                                                    id: user.id,
                                                    name: user.name || "",
                                                    email: user.email || "",
                                                    image: user.image || ""
                                                })}
                                                className="flex items-center gap-2"
                                            >
                                                {user.image && (
                                                    <Image 
                                                        src={user.image}
                                                        alt={user.name || "user avatar"}
                                                        className="w-6 h-6 rounded-full"
                                                        width={24}
                                                        height={24}
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium truncate">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}
                            </CommandList>
                        )}
                    </Command>
                </div>
            </div>

            {selected.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium">{t("shareLink.userSelector.recipients")}</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selected.map((user) => (
                            <div
                                key={user.userId}
                                className="flex items-center gap-2 p-2 border rounded-md"
                            >
                                {user.user.image && (
                                    <Image
                                        src={user.user.image}
                                        alt={user.user.name}
                                        className="w-8 h-8 rounded-full"
                                        width={32}
                                        height={32}
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">
                                        {user.user.name}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">
                                        {user.user.email}
                                    </div>
                                </div>
                                <div className="flex-shrink-0 w-32">
                                    <SharePermissionDropdown
                                        user={{
                                            id: user.userId,
                                            name: user.user.name,
                                            permissions: user.permissions,
                                        }}
                                        mode="user"
                                        onTogglePermission={(userId, permission) =>
                                            handlePermissionChange(userId, permission)
                                        }
                                        id={`user-permissions-${user.userId}`}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onRemove(user.userId)}
                                    disabled={isLoading}
                                    className="flex-shrink-0 p-1 hover:bg-red-100 rounded"
                                >
                                    <X className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}