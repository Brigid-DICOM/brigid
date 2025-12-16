"use client";

import { useMemo } from "react";

export function useDicomThumbnail(thumbnail: Blob | undefined) {
    const thumbnailUrl = useMemo(() => {
        if (!thumbnail) return null;

        return URL.createObjectURL(thumbnail);
    }, [thumbnail]);

    return thumbnailUrl;
}
