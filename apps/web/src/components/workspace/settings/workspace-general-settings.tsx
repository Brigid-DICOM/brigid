"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
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
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getQueryClient } from "@/react-query/get-query-client";
import {
    deleteWorkspaceMutation,
    leaveWorkspaceMutation,
    updateWorkspaceMutation,
} from "@/react-query/queries/workspace";

interface WorkspaceGeneralSettingsProps {
    workspace: {
        id: string;
        name: string;
        membership: {
            role: string;
        };
    };
    onClose: () => void;
}

export function WorkspaceGeneralSettings({
    workspace,
    onClose,
}: WorkspaceGeneralSettingsProps) {
    const { t } = useT("translation");
    const [name, setName] = useState(workspace.name);
    const queryClient = getQueryClient();
    const router = useRouter();

    const updateWorkspace = useMutation(updateWorkspaceMutation());
    const deleteWorkspace = useMutation(deleteWorkspaceMutation());
    const { mutateAsync: leaveWorkspace, isPending: isLeavingWorkspace } = useMutation(leaveWorkspaceMutation());

    useEffect(() => {
        setName(workspace.name);
    }, [workspace.name]);

    const handleUpdateWorkspace = async () => {
        if (!name.trim() || name === workspace.name) return;

        try {
            await updateWorkspace.mutateAsync({
                workspaceId: workspace.id,
                name,
            });
            await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            await queryClient.invalidateQueries({
                queryKey: ["workspace", workspace.id],
            });
            toast.success(t("workspaceSettings.messages.workspaceUpdated"), {
                position: "bottom-center",
            });
        } catch (error) {
            console.error("Failed to update workspace", error);
            toast.error(t("workspaceSettings.messages.workspaceUpdatedError"), {
                position: "bottom-center",
            });
        } finally {
            onClose();
        }
    };

    const handleDeleteWorkspace = async () => {
        try {
            await deleteWorkspace.mutateAsync(workspace.id);
            await queryClient.invalidateQueries({ queryKey: ["workspaces"] });

            onClose();
            router.push("/");
            toast.success(t("workspaceSettings.messages.workspaceDeleted"), {
                position: "bottom-center",
            });
        } catch (error) {
            console.error("Failed to delete workspace", error);
            toast.error(t("workspaceSettings.messages.workspaceDeletedError"), {
                position: "bottom-center",
            });
        } finally {
            onClose();
        }
    };

    const handleLeaveWorkspace = async () => {
        try {
            await leaveWorkspace(workspace.id);
            await queryClient.invalidateQueries({ queryKey: ["workspaces"] });

            toast.success(t("workspaceSettings.messages.workspaceLeft"), {
                position: "bottom-center",
            });
            onClose();

            router.push("/");
        } catch (error) {
            console.error("Failed to leave workspace", error);
            toast.error(t("workspaceSettings.messages.workspaceLeftError"), {
                position: "bottom-center",
            });
        } finally {
            onClose();
        }
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 gap-6 overflow-y-auto p-6">
                {/* Workspace Settings */}
                <div className="grid gap-4">
                    <div className="space-y-1 flex items-center gap-2">
                        <h3 className="text-lg font-medium">
                            {t("workspaceSettings.generalTab.workspace.title")}
                        </h3>
                    </div>

                    <Separator />
                    <div className="grid gap-2">
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium leading-none">
                                {t("workspaceSettings.generalTab.workspace.workspaceName.title")}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {t("workspaceSettings.generalTab.workspace.workspaceName.desc")}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="max-w-md"
                            />
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="grid gap-4 mt-6">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium">{t("workspaceSettings.generalTab.workspace.dangerZone.title")}</h3>
                        <Separator />
                    </div>

                    {workspace.membership.role !== "owner" && (
                        <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant={"destructive"} size="sm">
                                        {t("workspaceSettings.generalTab.workspace.dangerZone.leaveWorkspace")}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            {t("workspaceSettings.generalTab.workspace.dangerZone.leaveWorkspaceAlertTitle")}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {t("workspaceSettings.generalTab.workspace.dangerZone.leaveWorkspaceAlertDesc")}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            {t("common.cancel")}
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleLeaveWorkspace}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            {isLeavingWorkspace ? t("common.leaving") : t("common.leave")}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}

                    {workspace.membership.role === "owner" && <div className="grid gap-2">
                        <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1 mb-2">
                                    <p className="text-sm font-medium text-destructive">
                                        {t("workspaceSettings.generalTab.workspace.dangerZone.deleteWorkspace")}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t("workspaceSettings.generalTab.workspace.dangerZone.deleteWorkspaceDesc")}
                                    </p>
                                </div>
                            </div>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        variant={"destructive"} size="sm"
                                    >
                                        {t("workspaceSettings.generalTab.workspace.dangerZone.deleteWorkspace")}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            {t("workspaceSettings.generalTab.workspace.dangerZone.deleteWorkspaceAlertTitle")}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            <Trans
                                                i18nKey="workspaceSettings.generalTab.workspace.dangerZone.deleteWorkspaceAlertDesc"
                                                components={{
                                                    1: <strong />
                                                }}
                                                values={{
                                                    workspaceName: workspace.name
                                                }}
                                                shouldUnescape={true}
                                            />
                                        </AlertDialogDescription>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                {t("common.cancel")}
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDeleteWorkspace}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                {deleteWorkspace.isPending
                                                    ? t("common.deleting")
                                                    : t("common.delete")}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogHeader>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>}
                </div>
            </div>

            <div className="border-t p-4 bg-background mt-auto">
                <DialogFooter>
                    <Button variant={"outline"} onClick={onClose}>
                        {t("common.cancel")}
                    </Button>
                    <Button onClick={handleUpdateWorkspace} disabled={updateWorkspace.isPending}>
                        {updateWorkspace.isPending ? t("common.saving") : t("common.saveChanges")}
                    </Button>
                </DialogFooter>
            </div>
        </div>
    );
}
