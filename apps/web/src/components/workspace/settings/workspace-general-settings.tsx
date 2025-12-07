"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
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
            toast.success("Workspace updated successfully", {
                position: "bottom-center",
            });
        } catch (error) {
            console.error("Failed to update workspace", error);
            toast.error("Failed to update workspace", {
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
            toast.success("Workspace deleted");
        } catch (error) {
            console.error("Failed to delete workspace", error);
            toast.error("Failed to delete workspace", {
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

            toast.success("You have left the workspace", {
                position: "bottom-center",
            });
            onClose();

            router.push("/");
        } catch (error) {
            console.error("Failed to leave workspace", error);
            toast.error("Failed to leave workspace", {
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
                            Workspace Settings
                        </h3>
                    </div>

                    <Separator />
                    <div className="grid gap-2">
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium leading-none">
                                Workspace Name
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                This is the name of your workspace. You can
                                change it here.
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
                        <h3 className="text-lg font-medium">Danger Zone</h3>
                        <Separator />
                    </div>

                    {workspace.membership.role !== "owner" && (
                        <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant={"destructive"} size="sm">
                                        Leave Workspace
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you sure you want to leave this workspace?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            You will lose access to all workspace resources and data.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleLeaveWorkspace}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            {isLeavingWorkspace ? "Leaving..." : "Leave"}
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
                                        Delete Workspace
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Permanently delete this workspace and
                                        all its data.
                                    </p>
                                </div>
                            </div>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        variant={"destructive"} size="sm"
                                    >
                                        Delete Workspace
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This
                                            will permanently delete the
                                            workspace{" "}
                                            <strong>{workspace.name}</strong>{" "}
                                            and remove all associated data.
                                        </AlertDialogDescription>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDeleteWorkspace}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                {deleteWorkspace.isPending
                                                    ? "Deleting..."
                                                    : "Delete"}
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
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateWorkspace}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </div>
        </div>
    );
}
