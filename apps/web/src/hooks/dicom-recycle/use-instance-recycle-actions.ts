import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useState } from "react";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
import { getQueryClient } from "@/react-query/get-query-client";
import {
    deleteDicomInstanceMutation,
    recycleDicomInstanceMutation,
    restoreDicomInstanceMutation,
} from "@/react-query/queries/dicomInstance";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";

interface UseInstanceRecycleActionsProps {
    workspaceId: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
}

export function useInstanceRecycleActions({
    workspaceId,
    studyInstanceUid,
    seriesInstanceUid,
}: UseInstanceRecycleActionsProps) {
    const { t } = useT("translation");
    const queryClient = getQueryClient();
    const { clearSelection } = useDicomInstanceSelectionStore();

    const [instanceIds, setInstanceIds] = useState<string[]>([]);

    const invalidate = () => {
        queryClient.invalidateQueries({
            queryKey: [
                "dicom-instance",
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
            ],
        });
    };

    const recycleInstance = useMutation({
        ...recycleDicomInstanceMutation({
            workspaceId,
            instanceIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading(
                t("dicom.messages.recycling", { level: "instance" }),
                {
                    id: context.meta?.toastId as string,
                },
            );
        },
        onSuccess: (_, __, ___, context) => {
            toast.success(
                t("dicom.messages.recycleSuccess", { level: "instance" }),
            );
            toast.dismiss(context.meta?.toastId as string);
            invalidate();
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error(
                t("dicom.messages.recycleError", { level: "instance" }),
            );
            toast.dismiss(context.meta?.toastId as string);
            clearSelection();
        },
    });

    const restoreInstance = useMutation({
        ...restoreDicomInstanceMutation({
            workspaceId,
            instanceIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading(
                t("dicom.messages.restoring", { level: "instance" }),
                {
                    id: context.meta?.toastId as string,
                },
            );
        },
        onSuccess: (_, __, ___, context) => {
            toast.success(
                t("dicom.messages.restoreSuccess", { level: "instance" }),
            );
            toast.dismiss(context.meta?.toastId as string);
            invalidate();
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error(
                t("dicom.messages.restoreError", { level: "instance" }),
            );
            toast.dismiss(context.meta?.toastId as string);
            clearSelection();
        },
    });

    const deleteInstance = useMutation({
        ...deleteDicomInstanceMutation({
            workspaceId,
            instanceIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading(t("dicom.messages.deleting", { level: "instance" }), {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success(
                t("dicom.messages.deleteSuccess", { level: "instance" }),
            );
            toast.dismiss(context.meta?.toastId as string);
            invalidate();
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error(t("dicom.messages.deleteError", { level: "instance" }));
            toast.dismiss(context.meta?.toastId as string);
            clearSelection();
        },
    });

    return {
        setInstanceIds,
        instanceIds,

        recycleInstance: recycleInstance.mutate,
        isRecycling: recycleInstance.isPending,

        restoreInstance: restoreInstance.mutate,
        isRestoring: restoreInstance.isPending,

        deleteInstance: deleteInstance.mutate,
        isDeleting: deleteInstance.isPending,
    };
}
