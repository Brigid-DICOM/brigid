"use client";

import { UploadIcon } from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";
import { useT } from "@/app/_i18n/client";
import { validateDicomFiles } from "@/lib/dicom-validator";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface UploadAreaProps {
    onFilesSelected: (files: File[]) => void;
}

export function UploadArea({ onFilesSelected }: UploadAreaProps) {
    const { t } = useT("translation");
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const items = Array.from(e.dataTransfer.items);
            const files: File[] = [];
            let hasDirectory = false;

            for (const item of items) {
                const entry = item.webkitGetAsEntry?.();
                if (entry?.isDirectory) {
                    hasDirectory = true;
                    break;
                }
            }

            if (hasDirectory) {
                for (const item of items) {
                    const entry = item.webkitGetAsEntry?.();
                    if (entry) {
                        await traverseFileTree(entry, files);
                    }
                }
            } else {
                const droppedFiles = Array.from(e.dataTransfer.files);
                files.push(...droppedFiles);
            }

            const validatedFiles = await validateDicomFiles(files);
            onFilesSelected(validatedFiles.map((result) => result.file));
        },
        [onFilesSelected],
    );

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const validatedFiles = await validateDicomFiles(selectedFiles);
        onFilesSelected(validatedFiles.map((result) => result.file));

        e.target.value = "";
    };

    const handleFolderSelect = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const selectedFolder = Array.from(e.target.files || []);
        const validatedFiles = await validateDicomFiles(selectedFolder);
        onFilesSelected(validatedFiles.map((result) => result.file));

        e.target.value = "";
    };

    return (
        <button
            type="button"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
                "w-full",
                isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50",
            )}
        >
            <UploadIcon className="mx-auto size-12 text-muted-foreground mb-4" />

            <h3 className="text-lg font-semibold mb-2">
                {t("upload.dragAndDrop")}
            </h3>

            <p className="text-sm text-muted-foreground mb-6">
                {t("upload.supportedFormats")}
            </p>

            <div className="flex gap-2 justify-center">
                <Button variant={"outline"} asChild>
                    <label htmlFor="file-input">
                        {t("upload.selectFiles")}
                        <input
                            type="file"
                            id="file-input"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </label>
                </Button>

                <Button asChild variant={"outline"}>
                    <label htmlFor="folder-input">
                        {t("upload.selectFolder")}
                        <input
                            type="file"
                            id="folder-input"
                            // @ts-expect-error - webkitdirectory is not a valid attribute for input type="file"
                            webkitdirectory="true"
                            onChange={handleFolderSelect}
                            className="hidden"
                        />
                    </label>
                </Button>
            </div>
        </button>
    );
}

async function traverseFileTree(
    entry: FileSystemEntry,
    files: File[],
): Promise<void> {
    if (entry.isFile) {
        const fileEntry = entry as FileSystemFileEntry;
        const file = await new Promise<File>((resolve, reject) => {
            fileEntry.file(resolve, reject);
        });
        files.push(file);
    } else if (entry.isDirectory) {
        const dirEntry = entry as FileSystemDirectoryEntry;
        const reader = dirEntry.createReader();

        const entries = await new Promise<FileSystemEntry[]>(
            (resolve, reject) => {
                reader.readEntries(resolve, reject);
            },
        );

        for (const childEntry of entries) {
            await traverseFileTree(childEntry, files);
        }
    }
}
