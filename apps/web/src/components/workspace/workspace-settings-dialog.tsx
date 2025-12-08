"use client";

import { Settings2Icon, UsersIcon } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { WorkspaceGeneralSettings } from "./settings/workspace-general-settings";
import { WorkspaceMembersSettings } from "./settings/workspace-members-settings";

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workspace: {
        id: string;
        name: string;
        membership: {
            permissions: number;
            role: string;
        };
    };
}

type SettingsTab = "general" | "members";

export function WorkspaceSettingsDialog({
    open,
    onOpenChange,
    workspace,
}: SettingsDialogProps) {
    const [activeTab, setActiveTab] = useState<SettingsTab>("general");
    const { isMobile } = useSidebar();

    const canManageMembers = hasPermission(workspace.membership.permissions, WORKSPACE_PERMISSIONS.INVITE);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="overflow-hidden p-0 h-[60vh] md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
                <DialogTitle className="sr-only">Settings</DialogTitle>
                <DialogDescription className="sr-only">
                    Manage your workspace settings
                </DialogDescription>

                <SidebarProvider className="items-start h-full min-h-[500px]">
                    <Sidebar
                        collapsible={isMobile ? "icon" : "none"}
                        className="hidden w-60 border-r md:flex h-full"
                    >
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                isActive={
                                                    activeTab === "general"
                                                }
                                                onClick={() =>
                                                    setActiveTab("general")
                                                }
                                            >
                                                <Settings2Icon className="mr-2 size-4" />
                                                <span>General</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>

                                        {canManageMembers && <SidebarMenuItem>
                                            <SidebarMenuButton
                                                isActive={
                                                    activeTab === "members"
                                                }
                                                onClick={() =>
                                                    setActiveTab("members")
                                                }
                                            >
                                                <UsersIcon className="mr-2 size-4" />
                                                <span>Members</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </Sidebar>

                    <main className="flex h-full flex-1 flex-col min-h-0">
                        {isMobile && <SidebarTrigger />}
                        {activeTab === "general" && (
                            <WorkspaceGeneralSettings
                                workspace={workspace}
                                onClose={() => onOpenChange(false)}
                            />
                        )}

                        {activeTab === "members" && canManageMembers && (
                            <WorkspaceMembersSettings workspace={workspace} />
                        )}
                    </main>
                </SidebarProvider>
            </DialogContent>
        </Dialog>
    );
}
