import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useState } from "react";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
import { getQueryClient } from "@/react-query/get-query-client";
import {
    deleteDicomSeriesMutation,
    recycleDicomSeriesMutation,
    restoreDicomSeriesMutation,
} from "@/react-query/queries/dicomSeries";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";

interface UseSeriesRecycleActionsProps {
    workspaceId: string;
    studyInstanceUid: string;
}

export function useSeriesRecycleActions({
    workspaceId,
    studyInstanceUid,
}: UseSeriesRecycleActionsProps) {
    const { t } = useT("translation");
    const queryClient = getQueryClient();
    const { clearSelection } = useDicomSeriesSelectionStore();

    const [seriesIds, setSeriesIds] = useState<string[]>([]);

    const invalidate = () => {
        queryClient.invalidateQueries({
            queryKey: ["dicom-series", workspaceId, studyInstanceUid],
        });
    };

    const recycleMutation = useMutation({
        ...recycleDicomSeriesMutation({
            workspaceId,
            seriesIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading(t("dicom.messages.recycling", { level: "series" }), {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success(
                t("dicom.messages.recycleSuccess", { level: "series" }),
            );
            toast.dismiss(context.meta?.toastId as string);
            invalidate();
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error(t("dicom.messages.recycleError", { level: "series" }));
            toast.dismiss(context.meta?.toastId as string);
            clearSelection();
        },
    });

    const restoreMutation = useMutation({
        ...restoreDicomSeriesMutation({
            workspaceId,
            seriesIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading(t("dicom.messages.restoring", { level: "series" }), {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success(
                t("dicom.messages.restoreSuccess", { level: "series" }),
            );
            console.log("restoreSuccess", context.meta?.toastId);
            toast.dismiss(context.meta?.toastId as string);
            invalidate();
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error(t("dicom.messages.restoreError", { level: "series" }));
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    const deleteMutation = useMutation({
        ...deleteDicomSeriesMutation({
            workspaceId,
            seriesIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading(t("dicom.messages.deleting", { level: "series" }), {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success(
                t("dicom.messages.deleteSuccess", { level: "series" }),
            );
            toast.dismiss(context.meta?.toastId as string);
            invalidate();
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error(t("dicom.messages.deleteError", { level: "series" }));
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    return {
        setSeriesIds,
        seriesIds,

        recycleSeries: recycleMutation.mutate,
        isRecycling: recycleMutation.isPending,

        restoreSeries: restoreMutation.mutate,
        isRestoring: restoreMutation.isPending,

        deleteSeries: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
}
