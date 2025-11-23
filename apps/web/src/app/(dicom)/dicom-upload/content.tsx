"use client";

import { useCallback } from "react";
import { UploadArea } from "@/components/upload/upload-area";
import { UploadTaskListInLine } from "@/components/upload/upload-task-list-inline";
import { useUploadHandler } from "@/hooks/use-upload-handler";

interface DicomUploadContentProps {
    workspaceId: string;
}

export default function DicomUploadContent({ workspaceId }: DicomUploadContentProps) {
    const { addFiles } = useUploadHandler({ workspaceId });

    const handleFilesSelected = useCallback(
        async (files: File[]) => {
            await addFiles(files);
        },
        [addFiles]
    )

    return (
        <div className="container p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    DICOM Upload
                </h1>
            </div>

            <div className="space-y-6">
                <UploadArea onFilesSelected={handleFilesSelected} />

                <UploadTaskListInLine />
            </div>
        </div>
    )
}