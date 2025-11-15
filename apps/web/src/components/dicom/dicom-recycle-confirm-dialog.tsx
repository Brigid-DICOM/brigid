"use client";

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
                    <AlertDialogTitle>確認回收</AlertDialogTitle>
                    <AlertDialogDescription>
                        {isSingle
                            ? `確定要將此項目 (${itemLabel}) 移至回收桶嗎？`
                            : `確定要將 ${selectedCount} 個項目 (${itemLabel}) 移至回收桶嗎？`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>
                        確認
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
