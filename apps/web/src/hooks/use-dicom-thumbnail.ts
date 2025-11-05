import { useEffect, useMemo } from "react";

export function useDicomThumbnail(
    thumbnail: Blob | undefined
) {
    const thumbnailUrl = useMemo(() => {
        if (!thumbnail) return null;

        return URL.createObjectURL(thumbnail);
    }, [thumbnail]);

    useEffect(() => {
        return () => {
            if (thumbnailUrl) {
                URL.revokeObjectURL(thumbnailUrl);
            }
        };
    }, [thumbnailUrl]);

    return thumbnailUrl;
}