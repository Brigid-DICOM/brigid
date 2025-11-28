import type { ThumbnailSource } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import { getDicomInstanceThumbnailQuery } from "@/react-query/queries/dicomInstance";
import { getDicomSeriesThumbnailQuery } from "@/react-query/queries/dicomSeries";
import { getDicomStudyThumbnailQuery } from "@/react-query/queries/dicomThumbnail";
import {
    getShareInstanceThumbnailQuery,
    getShareSeriesThumbnailQuery,
    getShareStudyThumbnailQuery,
} from "@/react-query/queries/publicShare";

interface UseThumbnailQueryProps {
    source: ThumbnailSource;
    studyInstanceUid: string;
    seriesInstanceUid?: string;
    sopInstanceUid?: string;
    viewport?: string;
}

export function useThumbnailQuery({
    source,
    studyInstanceUid,
    seriesInstanceUid,
    sopInstanceUid,
    viewport = "64,64",
}: UseThumbnailQueryProps) {
    const enabled = studyInstanceUid && studyInstanceUid !== "N/A";

    let query: any;

    switch (source.type) {
        case "workspace":
            if (seriesInstanceUid && sopInstanceUid) {
                query = getDicomInstanceThumbnailQuery(
                    source.workspaceId,
                    studyInstanceUid,
                    seriesInstanceUid,
                    sopInstanceUid,
                    viewport,
                );
            } else if (seriesInstanceUid) {
                query = getDicomSeriesThumbnailQuery(
                    source.workspaceId,
                    studyInstanceUid,
                    seriesInstanceUid,
                    viewport,
                );
            } else {
                query = getDicomStudyThumbnailQuery(
                    source.workspaceId,
                    studyInstanceUid,
                    viewport,
                );
            }
            break;
        case "share":
            if (seriesInstanceUid && sopInstanceUid) {
                query = getShareInstanceThumbnailQuery({
                    token: source.token,
                    password: source.password,
                    studyInstanceUid,
                    seriesInstanceUid,
                    sopInstanceUid,
                    viewport,
                });
            } else if (seriesInstanceUid) {
                query = getShareSeriesThumbnailQuery({
                    token: source.token,
                    password: source.password,
                    studyInstanceUid,
                    seriesInstanceUid,
                    viewport,
                });
            } else {
                query = getShareStudyThumbnailQuery({
                    token: source.token,
                    password: source.password,
                    studyInstanceUid,
                    viewport,
                });
            }
            break;
        default:
            throw new Error("Invalid thumbnail source");
    }

    return useQuery({
        ...query,
        enabled,
    });
}
