import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
import { getQueryClient } from "@/react-query/get-query-client";
import { deleteDicomStudyMutation, recycleDicomStudyMutation, restoreDicomStudyMutation } from "@/react-query/queries/dicomStudy";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";

interface UseStudyRecycleActionsProps {
    workspaceId: string;
}

export function useStudyRecycleActions({ workspaceId }: UseStudyRecycleActionsProps) {
    const { t } = useT("translation");
    const queryClient = getQueryClient();
    const { deselectStudy, clearSelection } = useDicomStudySelectionStore();

    const [studyIds, setStudyIds] = useState<string[]>([]);

    const level = useMemo(() => {
        return studyIds.length > 1 ? "studies" : "study";
    }, [studyIds]);

    const invalidate = () => {
        queryClient.invalidateQueries({
            queryKey: ["dicom-study", workspaceId],
        });
    }

    const recycleMutation = useMutation({
        ...recycleDicomStudyMutation({
            workspaceId,
            studyIds
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading(t("dicom.messages.recycling", { level }), {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success(t("dicom.messages.recycleSuccess", { level }));
            toast.dismiss(context.meta?.toastId as string);
            invalidate();
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error(t("dicom.messages.recycleError", { level }));
            toast.dismiss(context.meta?.toastId as string);
            clearSelection();
        },
    });

    const restoreMutation = useMutation({
        ...restoreDicomStudyMutation({
            workspaceId,
            studyIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading(t("dicom.messages.restoring", { level }), {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success(t("dicom.messages.restoreSuccess", { level }));
            toast.dismiss(context.meta?.toastId as string);
            invalidate();
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error(t("dicom.messages.restoreError", { level }));
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    const deleteMutation = useMutation({
        ...deleteDicomStudyMutation({
            workspaceId,
            studyIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading(t("dicom.messages.deleting", { level }), {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success(t("dicom.messages.deleteSuccess", { level }));
            toast.dismiss(context.meta?.toastId as string);
            invalidate();

            if (studyIds.length > 1) {
                clearSelection();
            } else {
                deselectStudy(studyIds[0]);
            }
        },
        onError: (_, __, ___, context) => {
            toast.error(t("dicom.messages.deleteError", { level }));
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    return {
        setStudyIds,
        studyIds,

        recycleStudies: recycleMutation.mutate,
        isRecycling: recycleMutation.isPending,

        restoreStudies: restoreMutation.mutate,
        isRestoring: restoreMutation.isPending,

        deleteStudies: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
}