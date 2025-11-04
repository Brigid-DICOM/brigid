import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export const getDicomStudyThumbnailQuery = (
    workspaceId: string, 
    studyInstanceUid: string,
    viewport: string = "64,64"
) => queryOptions({
    queryKey: ["dicom-thumbnail", workspaceId, studyInstanceUid, viewport],
    queryFn: async () => {
        const response = await apiClient.api.workspaces[":workspaceId"].studies[":studyInstanceUid"].thumbnail.$get({
            header: {
                accept: "image/jpeg"
            },
            param: {
                workspaceId,
                studyInstanceUid
            },
            query: {
                viewport
            }
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch DICOM thumbnail");
        }

        return response.blob();
    }
})