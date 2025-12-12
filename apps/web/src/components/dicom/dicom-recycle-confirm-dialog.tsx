"use client";

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
} from "@/components/ui/alert-dialog";

type DicomLevel = "study" | "series" | "instance";

interface DicomRecycleConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dicomLevel: DicomLevel;
    selectedCount: number;
    onConfirm: () => void;
}

const dicomLevelLabels: Record<
    DicomLevel,
    { singular: string; plural: string }
> = {
    study: { singular: "Study", plural: "Studies" },
    series: { singular: "Series", plural: "Series" },
    instance: { singular: "Instance", plural: "Instances" },
};

export function DicomRecycleConfirmDialog({
    open,
    onOpenChange,
    dicomLevel,
    selectedCount,
    onConfirm,
}: DicomRecycleConfirmDialogProps) {
    const { t } = useT("translation");
    const label = dicomLevelLabels[dicomLevel];
    const isSingle = selectedCount === 1;
    const itemLabel = isSingle ? label.singular : label.plural;

    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("dicom.recycleDialog.title")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {isSingle
                            ? t("dicom.recycleDialog.single", { level: itemLabel })
                            : t("dicom.recycleDialog.multiple", { count: selectedCount, level: itemLabel })
                        }
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t("dicom.recycleDialog.cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>
                        {t("dicom.recycleDialog.confirm")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
