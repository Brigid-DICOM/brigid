"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { PlusIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getQueryClient } from "@/react-query/get-query-client";
import {
    getWorkspaceMembersQuery,
    removeWorkspaceMembersMutation,
    updateWorkspaceMembersMutation,
} from "@/react-query/queries/workspace";
import { InviteMemberDialog } from "../invite-member-dialog";

interface WorkspaceMembersSettingsProps {
    workspace: {
        id: string;
        name: string;
    };
}

const ROLES = [
    { value: "owner", label: "Owner" },
    { value: "admin", label: "Admin" },
    { value: "maintainer", label: "Maintainer" },
    { value: "editor", label: "Editor" },
    { value: "viewer", label: "Viewer" },
];

export function WorkspaceMembersSettings({
    workspace,
}: WorkspaceMembersSettingsProps) {
    const [showInviteMemberDialog, setShowInviteMemberDialog] = useState(false);
    const queryClient = getQueryClient();

    const { data: membersData } = useQuery(
        getWorkspaceMembersQuery(workspace.id),
    );
    const updatedMember = useMutation(updateWorkspaceMembersMutation());
    const removedMember = useMutation(removeWorkspaceMembersMutation());

    const members = membersData?.members || [];

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await updatedMember.mutateAsync({
                workspaceId: workspace.id,
                users: [{ userId, role: newRole }],
            });

            await queryClient.invalidateQueries({
                queryKey: ["workspace", workspace.id, "members"],
            });
            toast.success("Member role updated successfully", {
                position: "bottom-center",
            });
        } catch (error) {
            console.error("Failed to update member role", error);
            toast.error("Failed to update member role", {
                position: "bottom-center",
            });
        }
    };

    const handleRemoveMember = async (userId: string) => {
        try {
            await removedMember.mutateAsync({
                workspaceId: workspace.id,
                userIds: [userId],
            });

            await queryClient.invalidateQueries({
                queryKey: ["workspace", workspace.id, "members"],
            });
            toast.success("Member removed successfully", {
                position: "bottom-center",
            });
        } catch (error) {
            console.error("Failed to remove member", error);
            toast.error("Failed to remove member", {
                position: "bottom-center",
            });
        }
    };

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="p-6 pb-4 flex items-center justify-between shrink-0">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium">Members</h3>
                        <p className="text-sm text-muted-foreground">
                            Manage who has access to this workspace.
                        </p>
                    </div>
                    <div className="flex h-full items-end">
                        <Button
                            onClick={() => setShowInviteMemberDialog(true)}
                            size="sm"
                        >
                            <PlusIcon className="size-4" />
                            Add Members
                        </Button>
                    </div>
                </div>

                <div className="px-6 pb-4 shrink-0">
                    <Separator />
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <div className="space-y-4">
                        {members.map((member) => (
                            <div
                                key={member.userId}
                                className="flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {member.image ? (
                                        <Image
                                            src={member.image}
                                            alt={member.name || "user avatar"}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                            {member.name?.[0]?.toUpperCase() ||
                                                member.email?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-medium truncate">
                                            {member.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground truncate">
                                            {member.email}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <Select
                                        value={member.role}
                                        onValueChange={(value) =>
                                            handleRoleChange(
                                                member.userId,
                                                value,
                                            )
                                        }
                                        disabled={member.role === "owner"}
                                    >
                                        <SelectTrigger className="w-[110px] h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent align="end">
                                            {ROLES.map((role) => (
                                                <SelectItem
                                                    key={role.value}
                                                    value={role.value}
                                                >
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {member.role !== "owner" && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2Icon className="size-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Remove member?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to
                                                        remove{" "}
                                                        <strong>
                                                            {member.name}
                                                        </strong>{" "}
                                                        from this workspace?
                                                        They will lose access to
                                                        all resources.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleRemoveMember(
                                                                member.userId,
                                                            )
                                                        }
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Remove
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                    {member.role === "owner" && (
                                        <div className="w-8" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <InviteMemberDialog
                open={showInviteMemberDialog}
                onOpenChange={setShowInviteMemberDialog}
                workspaceId={workspace.id}
            />
        </>
    );
}