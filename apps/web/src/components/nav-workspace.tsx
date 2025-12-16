"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
    CheckIcon,
    ChevronsUpDownIcon,
    PlusIcon,
    SettingsIcon,
    UserPlusIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { useT } from "@/app/_i18n/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getQueryClient } from "@/react-query/get-query-client";
import {
    getWorkspaceByIdQuery,
    getWorkspacesQuery,
    setDefaultWorkspaceMutation,
} from "@/react-query/queries/workspace";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";
import { CreateWorkspaceDialog } from "./workspace/create-workspace-dialog";
import { InviteMemberDialog } from "./workspace/invite-member-dialog";
import { WorkspaceSettingsDialog } from "./workspace/workspace-settings-dialog";

export function NavWorkspace() {
    const { t } = useT("translation");
    const { isMobile } = useSidebar();
    const router = useRouter();
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const queryClient = getQueryClient();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showSettingsDialog, setShowSettingsDialog] = useState(false);
    const [showInviteMemberDialog, setShowInviteMemberDialog] = useState(false);

    const { data: workspacesData } = useQuery(getWorkspacesQuery());
    const setDefaultWorkspace = useMutation(setDefaultWorkspaceMutation());

    const workspaces = workspacesData?.workspaces || [];
    const activeWorkspace =
        workspaces.find((w) => w.id === workspaceId) || workspaces[0];
    const otherWorkspaces = workspaces.filter((w) => w.id !== workspaceId);

    const handleWorkspaceChange = (workspaceIdToChangeTo: string) => {
        router.push(`/${workspaceIdToChangeTo}`);

        setDefaultWorkspace
            .mutateAsync(workspaceIdToChangeTo)
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["workspace"] });
                queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            })
            .catch((error) => {
                console.error("Failed to set default workspace:", error);
            });
    };

    const handlePrefetch = (id: string) => {
        queryClient.prefetchQuery(getWorkspaceByIdQuery(id));
    };

    if (!activeWorkspace) return null;

    const canInvite = hasPermission(
        activeWorkspace.membership.permissions,
        WORKSPACE_PERMISSIONS.INVITE,
    );

    return (
        <>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                {/* Display first letter of workspace name */}
                                <span className="text-lg font-bold">
                                    {activeWorkspace.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </span>
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {activeWorkspace.name}
                                </span>
                                <span className="truncate text-xs">
                                    {activeWorkspace.membership.role}
                                </span>
                            </div>
                            <ChevronsUpDownIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        {/* Current Workspace Header */}
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-sm border">
                                {activeWorkspace.name.charAt(0).toUpperCase()}
                            </div>
                            {activeWorkspace.name}
                            <DropdownMenuShortcut>
                                <CheckIcon className="size-4" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>

                        {/* Current Workspace Actions */}
                        <DropdownMenuItem
                            className="gap-2 p-2 cursor-pointer"
                            onClick={() => setShowSettingsDialog(true)}
                        >
                            <SettingsIcon className="size-4 text-muted-foreground ml-1" />
                            <span>{t("navWorkspace.settings")}</span>
                        </DropdownMenuItem>
                        {canInvite && (
                            <DropdownMenuItem
                                className="gap-2 p-2 cursor-pointer"
                                onClick={() => setShowInviteMemberDialog(true)}
                            >
                                <UserPlusIcon className="size-4 text-muted-foreground ml-1" />
                                <span>{t("navWorkspace.inviteMembers")}</span>
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        {/* Other Workspaces List */}
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            {t("navWorkspace.workspaces")}
                        </DropdownMenuLabel>
                        {otherWorkspaces.length > 0 ? (
                            otherWorkspaces.map((workspace) => (
                                <DropdownMenuItem
                                    key={workspace.id}
                                    onClick={() =>
                                        handleWorkspaceChange(workspace.id)
                                    }
                                    onMouseEnter={() =>
                                        handlePrefetch(workspace.id)
                                    }
                                    className="gap-2 p-2"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-sm border">
                                        {workspace.name.charAt(0).toUpperCase()}
                                    </div>
                                    {workspace.name}
                                    {workspace.id === workspaceId && (
                                        <DropdownMenuShortcut>
                                            <CheckIcon className="size-4" />
                                        </DropdownMenuShortcut>
                                    )}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem className="gap-2 p-2">
                                <span className="text-muted-foreground">
                                    {t("navWorkspace.noOtherWorkspaces")}
                                </span>
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="gap-2 p-2"
                            onClick={() => setShowCreateDialog(true)}
                        >
                            <PlusIcon className="ml-1 size-4" />
                            <div className="font-medium">
                                {t("navWorkspace.addWorkspace")}
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>

            <CreateWorkspaceDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
            />

            <WorkspaceSettingsDialog
                open={showSettingsDialog}
                onOpenChange={setShowSettingsDialog}
                workspace={activeWorkspace}
            />

            <InviteMemberDialog
                open={showInviteMemberDialog}
                onOpenChange={setShowInviteMemberDialog}
                workspaceId={workspaceId}
            />
        </>
    );
}
