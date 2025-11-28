import type{ ThumbnailSource } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import { getDicomStudyThumbnailQuery } from "@/react-query/queries/dicomThumbnail";
import { getShareStudyThumbnailQuery } from "@/react-query/queries/publicShare";

interface UseThumbnailQueryProps {
    source: ThumbnailSource;
    studyInstanceUid: string;
    viewport?: string;
}

export function useThumbnailQuery({ source, studyInstanceUid, viewport = "64,64" }: UseThumbnailQueryProps) {
    const enabled = studyInstanceUid && studyInstanceUid !== "N/A";

    let query: any;
    
    switch (source.type) {
        case "workspace":
            query = getDicomStudyThumbnailQuery(
                source.workspaceId,
                studyInstanceUid,
                viewport,
            );
            break;
        case "share":
            query = getShareStudyThumbnailQuery({
                token: source.token,
                password: source.password,
                studyInstanceUid,
                viewport,
            });
            break;
        default:
            throw new Error("Invalid thumbnail source");
    }

    return useQuery({
        ...query,
        enabled,
    });
}