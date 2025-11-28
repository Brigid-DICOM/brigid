"use client";

import type { ThumbnailSource } from "@brigid/types";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useDicomThumbnail } from "@/hooks/use-dicom-thumbnail";
import { useThumbnailQuery } from "@/hooks/use-thumbnail-query";

interface TableStudyThumbnailCellProps {
    source: ThumbnailSource;
    studyInstanceUid: string;
    size?: number
}

export function TableStudyThumbnailCell({ source, studyInstanceUid, size = 64 }: TableStudyThumbnailCellProps) {
    const { data: thumbnail, isLoading: isLoadingThumbnail } = useThumbnailQuery({
        source,
        studyInstanceUid,
        viewport: `${size},${size}`,
    });
    
    const url = useDicomThumbnail(thumbnail as Blob | undefined);

    if (isLoadingThumbnail) {
        return <Skeleton className="rounded" style={{ width: size, height: size }} />;
    }

    if (!url || studyInstanceUid === "N/A") {
        return (
          <div
            className="bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500"
            style={{ width: size, height: size }}
          >
            No image
          </div>
        );
    }


    return (
        <Image
          src={url}
          alt="DICOM Thumbnail"
          width={size}
          height={size}
          className="object-cover rounded"
          unoptimized
        />
    );
}