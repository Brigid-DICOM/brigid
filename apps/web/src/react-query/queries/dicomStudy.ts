import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export interface DicomStudyQueryParams {
    workspaceId: string;
    offset?: number;
    limit?: number;
    deleteStatus?: number;
}

export const getDicomStudyQuery = ({
    workspaceId,
    offset = 0,
    limit = 10,
    deleteStatus = DICOM_DELETE_STATUS.ACTIVE,
    ...searchParams
}: DicomStudyQueryParams) => queryOptions({
    queryKey: ["dicom-study", workspaceId, offset, limit],
    queryFn: async () => {
        const response = await apiClient.api.workspaces[":workspaceId"].studies.$get({
            param: {
                workspaceId,
            },
            query: {
                offset: offset.toString(),
                limit: limit.toString(),
                deleteStatus: deleteStatus.toString(),
                ...Object.fromEntries(
                    Object.entries(searchParams).filter(([_, value]) =>
                        value !== undefined && value !== null && value !== ""
                    )
                )
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch DICOM study instances");
        }

        if (response.status === 204) {
            return [];
        }

        return await response.json();
    }
});

export const recycleDicomStudyMutation = ({
    workspaceId,
    studyIds,
}: {
    workspaceId: string;
    studyIds: string[];
}) => mutationOptions({
    mutationFn: async () => {
        const response = await apiClient.api.workspaces[":workspaceId"].dicom.studies.recycle.$post({
            param: {
                workspaceId,
            },
            json: {
                studyIds,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to recycle DICOM study");
        }

        return await response.json();
    }
});

