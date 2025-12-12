"use client";

import { useMutation } from "@tanstack/react-query";
import type { TFunction } from "i18next";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUserSearch } from "@/hooks/use-user-search";
import { getQueryClient } from "@/react-query/get-query-client";
import { addWorkspaceMembersMutation } from "@/react-query/queries/workspace";
import { Label } from "../ui/label";

interface InviteMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
}

interface SelectedUser {
    userId: string;
    user: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
    role: string;
}

const getRoles = (t: TFunction) => {
    return [
        {
            value: "admin",
            label: t("inviteMember.roles.admin"),
            description: t("inviteMember.roles.adminDesc"),
        },
        {
            value: "maintainer",
            label: t("inviteMember.roles.maintainer"),
            description: t("inviteMember.roles.maintainerDesc"),
        },
        {
            value: "editor",
            label: t("inviteMember.roles.editor"),
            description: t("inviteMember.roles.editorDesc"),
        },
        {
            value: "viewer",
            label: t("inviteMember.roles.viewer"),
            description: t("inviteMember.roles.viewerDesc"),
        },
    ];
}

export function InviteMemberDialog({
    open,
    onOpenChange,
    workspaceId,
}: InviteMemberDialogProps) {
    const { t } = useT("translation");
    const queryClient = getQueryClient();
    const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);

    const { searchInput, setSearchInput, users, isSearching, clearSearch } =
        useUserSearch({
            debouncedMs: 300,
            limit: 10,
        });

    const addMembers = useMutation(addWorkspaceMembersMutation());
    const handleInvite = async () => {
        if (selectedUsers.length === 0) return;

        try {
            await addMembers.mutateAsync({
                workspaceId,
                users: selectedUsers.map((user) => ({
                    userId: user.userId,
                    role: user.role,
                })),
            });

            toast.success(t("inviteMember.success"), {
                position: "bottom-center",
            });
            setSelectedUsers([]);
            setSearchInput("");
            onOpenChange(false);
            clearSearch();
            queryClient.invalidateQueries({
                queryKey: ["workspace", workspaceId, "members"],
            });
        } catch (error) {
            console.error(t("inviteMember.error"), error);
            toast.error(t("inviteMember.error"), {
                position: "bottom-center",
            });
        }
    };

    const handleSelectUser = (user: SelectedUser["user"]) => {
        if (selectedUsers.some((u) => u.userId === user.id)) {
            setSearchInput("");
            return;
        }

        setSelectedUsers((prev) => [
            ...prev,
            {
                userId: user.id,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                },
                role: "viewer",
            },
        ]);

        clearSearch();
    };

    const handleRemoveUser = (userId: string) => {
        setSelectedUsers((prev) => prev.filter((u) => u.userId !== userId));
    };

    const handleRoleChange = (userId: string, role: string) => {
        setSelectedUsers((prev) =>
            prev.map((u) => (u.userId === userId ? { ...u, role } : u)),
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("inviteMember.title")}</DialogTitle>
                    <DialogDescription>
                        {t("inviteMember.description")}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="add-users">{t("inviteMember.addUsers")}</Label>
                        <div className="relative">
                            <Command className="bg-background border rounded-md overflow-visible">
                                <CommandInput
                                    id="add-users"
                                    placeholder={t("inviteMember.searchPlaceholder")}
                                    value={searchInput}
                                    onValueChange={setSearchInput}
                                />

                                {isSearching && (
                                    <div className="absolute right-2 top-2.5">
                                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                                    </div>
                                )}

                                {searchInput && (
                                    <div className="absolute top-full left-0 right-0 z-10 mt-1 border rounded-md bg-background shadow-lg max-h-[200px] overflow-y-auto">
                                        <CommandList>
                                            {users.length === 0 ? (
                                                <CommandEmpty>
                                                    {t("inviteMember.noUsersFound")}
                                                </CommandEmpty>
                                            ) : (
                                                <CommandGroup>
                                                    {users.map((user) => (
                                                        <CommandItem
                                                            key={user.id}
                                                            value={`${user.name} ${user.email}`}
                                                            onSelect={() =>
                                                                handleSelectUser(
                                                                    {
                                                                        id: user.id,
                                                                        email:
                                                                            user.email ||
                                                                            "",
                                                                        name:
                                                                            user.name ||
                                                                            "",
                                                                        image:
                                                                            user.image ||
                                                                            "",
                                                                    },
                                                                )
                                                            }
                                                            className="flex items-center gap-2 cursor-pointer"
                                                        >
                                                            {user.image ? (
                                                                <Image
                                                                    src={
                                                                        user.image
                                                                    }
                                                                    alt={
                                                                        user.name ||
                                                                        t("inviteMember.userAvatar")
                                                                    }
                                                                    className="w-6 h-6 rounded-full"
                                                                    width={24}
                                                                    height={24}
                                                                />
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                                                    {user.name?.[0]?.toUpperCase() ||
                                                                        user.email?.[0]?.toUpperCase()}
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium truncate">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground truncate">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            )}
                                        </CommandList>
                                    </div>
                                )}
                            </Command>
                        </div>
                    </div>

                    {/* Selected Users List */}
                    {selectedUsers.length > 0 && (
                        <div className="space-y-2">
                            <Label>{t("inviteMember.selectedMembers")}</Label>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                {selectedUsers.map((user) => (
                                    <div
                                        key={user.userId}
                                        className="flex items-center justify-between gap-3 p-2 border rounded-lg bg-muted/30"
                                    >
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            {user.user.image ? (
                                                <Image
                                                    src={user.user.image}
                                                    alt={
                                                        user.user.name ||
                                                        t("inviteMember.userAvatar")
                                                    }
                                                    className="w-8 h-8 rounded-full shrink-0"
                                                    width={32}
                                                    height={32}
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                                                    {user.user.name?.[0]?.toUpperCase() ||
                                                        user.user.email?.[0]?.toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-medium truncate">
                                                    {user.user.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground truncate">
                                                    {user.user.email}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <Select
                                                value={user.role}
                                                onValueChange={(value) =>
                                                    handleRoleChange(
                                                        user.userId,
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-8 w-[130px] border-none">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent align="end">
                                                    {getRoles(t).map((item) => (
                                                        <SelectItem
                                                            key={item.value}
                                                            value={item.value}
                                                            className="py-2"
                                                        >
                                                            <div className="flex flex-col text-left">
                                                                <span className="font-medium">
                                                                    {item.label}
                                                                </span>
                                                                <span className="text-[10px] text-muted-foreground line-clamp-1 max-w-[200px]">
                                                                    {
                                                                        item.description
                                                                    }
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() =>
                                                    handleRemoveUser(
                                                        user.userId,
                                                    )
                                                }
                                            >
                                                <XIcon className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {t("inviteMember.cancel")}
                    </Button>
                    <Button
                        onClick={handleInvite}
                        disabled={
                            selectedUsers.length === 0 || addMembers.isPending
                        }
                    >
                        {addMembers.isPending ? t("inviteMember.inviting") : t("inviteMember.invite")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
