"use client";

import { useMutation } from "@tanstack/react-query";
import {
    CornerDownLeftIcon,
    DownloadIcon,
    EyeIcon,
    Share2Icon,
    Trash2Icon,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import type React from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useT } from "@/app/_i18n/client";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { downloadMultipleStudies, downloadStudy } from "@/lib/clientDownload";
import { closeContextMenu } from "@/lib/utils";
import { getQueryClient } from "@/react-query/get-query-client";
import { recycleDicomStudyMutation } from "@/react-query/queries/dicomStudy";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useCreateTagDialogStore } from "@/stores/create-tag-dialog-store";
import { useDicomRecycleConfirmDialogStore } from "@/stores/dicom-recycle-confirm-dialog-store";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";
import { useShareManagementDialogStore } from "@/stores/share-management-dialog-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { TagContextMenuSub } from "./tag/tag-context-menu-sub";

interface DicomStudyContextMenuProps {
    children: React.ReactNode;
    workspaceId: string;
    studyInstanceUid: string;
}

export function DicomStudyContextMenu({
    children,
    workspaceId,
    studyInstanceUid,
}: DicomStudyContextMenuProps) {
    const router = useRouter();
    const { lng } = useParams<{ lng: string }>();
    const { t } = useT("translation");
    const queryClient = getQueryClient();
    const { openDialog: openDicomRecycleConfirmDialog } =
        useDicomRecycleConfirmDialogStore();
    const { openDialog: openCreateTagDialog } = useCreateTagDialogStore();
    const { openDialog: openShareManagementDialog } =
        useShareManagementDialogStore();
    const { open } = useBlueLightViewerStore();
    const workspace = useWorkspaceStore(useShallow((state) => state.workspace));

    const canRecycle =
        !!workspace &&
        hasPermission(
            workspace.membership?.permissions ?? 0,
            WORKSPACE_PERMISSIONS.DELETE,
        );
    const canRead =
        !!workspace &&
        hasPermission(
            workspace.membership?.permissions ?? 0,
            WORKSPACE_PERMISSIONS.READ,
        );
    const canUpdate =
        !!workspace &&
        hasPermission(
            workspace.membership?.permissions ?? 0,
            WORKSPACE_PERMISSIONS.UPDATE,
        );
    const canShare =
        !!workspace &&
        hasPermission(
            workspace.membership?.permissions ?? 0,
            WORKSPACE_PERMISSIONS.MANAGE,
        );

    const { getSelectedStudyIds, clearSelection } =
        useDicomStudySelectionStore();
    const selectedIds = getSelectedStudyIds();

    const { mutate: recycleSelectedStudies } = useMutation({
        ...recycleDicomStudyMutation({
            workspaceId,
            studyIds: selectedIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading(t("dicom.messages.recycling", { level: "studies" }), {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success(
                t("dicom.messages.recycleSuccess", { level: "studies" }),
            );
            toast.dismiss(context.meta?.toastId as string);
            queryClient.invalidateQueries({
                queryKey: ["dicom-study", workspaceId],
            });
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error(t("dicom.messages.recycleError", { level: "studies" }));
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    const handleEnterSeries = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        router.push(`/${lng}/${workspaceId}/dicom-studies/${studyInstanceUid}`);
    };

    const handleDownloadThis = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        try {
            await downloadStudy(workspaceId, studyInstanceUid);
        } catch (error) {
            console.error(
                t("dicom.messages.downloadError", { level: "studies" }),
                error,
            );

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error(
                t("dicom.messages.downloadError", { level: "studies" }),
            );
        }
    };

    const handleDownloadSelected = async (
        e: React.MouseEvent<HTMLDivElement>,
    ) => {
        e.preventDefault();
        closeContextMenu();

        const currentSelectedIds = getSelectedStudyIds();

        if (currentSelectedIds.length === 0) {
            toast.error(
                t("dicom.messages.selectToDownload", { level: "study" }),
            );
            return;
        }

        try {
            if (currentSelectedIds.length === 1) {
                await downloadStudy(workspaceId, currentSelectedIds[0]);
            } else {
                await downloadMultipleStudies(workspaceId, currentSelectedIds);
            }
        } catch (error) {
            console.error(
                t("dicom.messages.downloadSelectedError", { level: "studies" }),
                error,
            );

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error(
                t("dicom.messages.downloadSelectedError", { level: "studies" }),
            );
        }
    };

    const handleRecycleSelected = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canRecycle) {
            toast.error(
                t("dicom.messages.noPermissionRecycle", { level: "studies" }),
            );
            return;
        }

        e.preventDefault();
        closeContextMenu();
        openDicomRecycleConfirmDialog({
            dicomLevel: "study",
            selectedCount: selectedIds.length,
            onConfirm: handleConfirmRecycle,
        });
    };

    const handleConfirmRecycle = () => {
        if (!canRecycle) {
            toast.error(
                t("dicom.messages.noPermissionRecycle", { level: "studies" }),
            );
            return;
        }

        recycleSelectedStudies();
    };

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        open({
            studyInstanceUid,
        });
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

            <ContextMenuContent className="w-60">
                {selectedIds.length === 1 && (
                    <>
                        {canRead && (
                            <>
                                <ContextMenuItem
                                    onClick={handleEnterSeries}
                                    className="flex items-center space-x-2"
                                >
                                    <CornerDownLeftIcon className="size-4" />
                                    <span>
                                        {t("dicom.contextMenu.enterSeries")}
                                    </span>
                                </ContextMenuItem>
                                <ContextMenuItem
                                    onClick={handleOpenBlueLightViewer}
                                    className="flex items-center space-x-2"
                                >
                                    <EyeIcon className="size-4" />
                                    <span>
                                        {t("dicom.contextMenu.openInBlueLight")}
                                    </span>
                                </ContextMenuItem>
                                <ContextMenuItem
                                    onClick={handleDownloadThis}
                                    className="flex items-center space-x-2"
                                >
                                    <DownloadIcon className="size-4" />
                                    <span>
                                        {t("dicom.contextMenu.download")}
                                    </span>
                                </ContextMenuItem>
                            </>
                        )}

                        {canUpdate && (
                            <>
                                <ContextMenuSeparator />

                                <TagContextMenuSub
                                    workspaceId={workspaceId}
                                    targetId={studyInstanceUid}
                                    targetType="study"
                                    onOpenCreateTagDialog={() =>
                                        openCreateTagDialog({
                                            workspaceId,
                                            targetType: "study",
                                            targetId: studyInstanceUid,
                                        })
                                    }
                                />
                            </>
                        )}

                        {canShare && (
                            <>
                                <ContextMenuSeparator />

                                <ContextMenuItem
                                    className="flex items-center space-x-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        closeContextMenu();
                                        openShareManagementDialog({
                                            workspaceId,
                                            targetType: "study",
                                            targetIds: selectedIds,
                                        });
                                    }}
                                >
                                    <Share2Icon className="size-4" />
                                    <span>{t("dicom.contextMenu.share")}</span>
                                </ContextMenuItem>
                            </>
                        )}

                        {canRecycle && (
                            <>
                                <ContextMenuSeparator />
                                <ContextMenuItem
                                    onClick={handleRecycleSelected}
                                    className="flex items-center space-x-2"
                                >
                                    <Trash2Icon className="size-4" />
                                    <span>
                                        {t("dicom.contextMenu.recycle")}
                                    </span>
                                </ContextMenuItem>
                            </>
                        )}
                    </>
                )}

                {selectedIds.length > 1 && (
                    <>
                        <ContextMenuLabel>
                            {t("dicom.contextMenu.selectedItems", {
                                count: selectedIds.length,
                            })}
                        </ContextMenuLabel>

                        <ContextMenuItem
                            onClick={handleDownloadSelected}
                            className="flex items-center space-x-2"
                        >
                            <DownloadIcon className="size-4" />
                            <span>{t("dicom.contextMenu.download")}</span>
                        </ContextMenuItem>

                        {canShare && (
                            <>
                                <ContextMenuSeparator />

                                <ContextMenuItem
                                    className="flex items-center space-x-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        closeContextMenu();
                                        openShareManagementDialog({
                                            workspaceId,
                                            targetType: "study",
                                            targetIds: selectedIds,
                                        });
                                    }}
                                >
                                    <Share2Icon className="size-4" />
                                    <span>{t("dicom.contextMenu.share")}</span>
                                </ContextMenuItem>
                            </>
                        )}

                        {canRecycle && (
                            <>
                                <ContextMenuSeparator />
                                <ContextMenuItem
                                    onClick={handleRecycleSelected}
                                    className="flex items-center space-x-2"
                                >
                                    <Trash2Icon className="size-4" />
                                    <span>
                                        {t("dicom.contextMenu.recycle")}
                                    </span>
                                </ContextMenuItem>
                            </>
                        )}
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}
