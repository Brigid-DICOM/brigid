import type {
    DicomInstanceData,
    DicomSeriesData,
    DicomStudyData,
} from "@brigid/types";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export interface PublicShareLinkData {
    id: string;
    token: string;
    targetType: "study" | "series" | "instance";
    description: string | null;
    accessCount: number;
    lastAccessedAt: Date | null;
    expiresAt: Date | null;
    targets: Array<{
        targetType: "study" | "series" | "instance";
        targetId: string;
        resource: DicomStudyData | DicomSeriesData | DicomInstanceData | null;
    }>;
}

interface BaseShareQueryParams {
    token: string;
    password?: string;
    cookie?: string;
}

interface PaginatedShareQueryParams extends BaseShareQueryParams {
    offset?: number;
    limit?: number;
}

interface ShareStudySeriesQueryParams extends PaginatedShareQueryParams {
    studyInstanceUid: string;
}

interface ShareStudySeriesInstanceQueryParams
    extends ShareStudySeriesQueryParams {
    seriesInstanceUid: string;
}

export const verifyPasswordMutation = ({
    token,
    password,
}: {
    token: string;
    password: string;
}) => {
    return mutationOptions({
        mutationFn: async () => {
            const response = await apiClient.api.share[":token"]["verify-password"].$post({
                param: {
                    token,
                },
                json: {
                    password,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to verify password");
            }

            return await response.json();
        }
    });
};

function commonRetryHandler(failureCount: number, error: Error) {
    if (
        error instanceof Error && 
        (error.message === "Password is required" || 
            error.message === "Invalid password")
    ) {
        return false;
    }
    return failureCount < 3;
}

export const getPublicShareLinkQuery = ({
    token,
    password,
}: BaseShareQueryParams) => {
    return queryOptions({
        queryKey: ["public-share-link", token, password],
        queryFn: async () => {
            const response = await apiClient.api.share[":token"].$get({
                param: {
                    token,
                },
                query: {
                    password,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.error || "Failed to fetch public share link",
                );
            }

            return await response.json();
        },
        retry: (failureCount, error) => {
            return commonRetryHandler(failureCount, error);
        },
        staleTime: 30 * 60 * 1000,
        enabled: !!token,
    });
};

export const getShareStudiesQuery = ({
    token,
    password,
    offset = 0,
    limit = 10,
}: PaginatedShareQueryParams) => {
    return queryOptions({
        queryKey: ["share-studies", token, password, offset, limit],
        queryFn: async () => {
            const response = await apiClient.api.share[":token"].studies.$get({
                param: {
                    token,
                },
                query: {
                    password,
                    offset: offset.toString(),
                    limit: limit.toString(),
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fetch public share studies");
            }

            return (await response.json()) as DicomStudyData[];
        },
        retry: (failureCount, error) => {
            return commonRetryHandler(failureCount, error);
        },
        staleTime: 30 * 60 * 1000,
        enabled: !!token,
    });
};

export const getShareSeriesQuery = ({
    token,
    password,
    offset = 0,
    limit = 10,
}: PaginatedShareQueryParams) => {
    return queryOptions({
        queryKey: ["share-series", token, password, offset, limit],
        queryFn: async () => {
            const response = await apiClient.api.share[":token"].series.$get({
                param: { token },
                query: {
                    password,
                    offset: offset.toString(),
                    limit: limit.toString(),
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fetch public share series");
            }

            return (await response.json()) as unknown as DicomSeriesData[];
        },
        retry: (failureCount, error) => {
            return commonRetryHandler(failureCount, error);
        },
        staleTime: 30 * 60 * 1000,
        enabled: !!token,
    });
};

export const getShareStudySeriesQuery = ({
    token,
    password,
    studyInstanceUid,
    offset = 0,
    limit = 10,
    cookie,
}: ShareStudySeriesQueryParams) => {
    return queryOptions({
        queryKey: [
            "share-study-series",
            token,
            password,
            studyInstanceUid,
            offset,
            limit,
        ],
        queryFn: async () => {
            const headers: HeadersInit = {};
            if (typeof window === "undefined" && typeof cookie === "string") {
                headers.cookie = cookie;
            }

            const response = await apiClient.api.share[":token"].studies[
                ":studyInstanceUid"
            ].series.$get({
                param: { token, studyInstanceUid },
                query: {
                    password,
                    offset: offset.toString(),
                    limit: limit.toString(),
                },
            }, {
                headers
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fetch public share study series");
            }

            return (await response.json()) as unknown as DicomSeriesData[];
        },
        retry: (failureCount, error) => {
            return commonRetryHandler(failureCount, error);
        },
        staleTime: 30 * 60 * 1000,
        enabled: !!token && !!studyInstanceUid,
    });
};

export const getShareStudySeriesInstancesQuery = ({
    token,
    password,
    studyInstanceUid,
    seriesInstanceUid,
    offset = 0,
    limit = 10,
    cookie,
}: ShareStudySeriesInstanceQueryParams) => {
    return queryOptions({
        queryKey: [
            "share-study-series-instances",
            token,
            password,
            studyInstanceUid,
            seriesInstanceUid,
            offset,
            limit,
        ],
        queryFn: async () => {
            const headers: HeadersInit = {};
            if (typeof window === "undefined" && typeof cookie === "string") {
                headers.cookie = cookie;
            }

            const response = await apiClient.api.share[":token"].studies[
                ":studyInstanceUid"
            ].series[":seriesInstanceUid"].instances.$get({
                param: { token, studyInstanceUid, seriesInstanceUid },
                query: {
                    password,
                    offset: offset.toString(),
                    limit: limit.toString(),
                },
            }, {
                headers
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fetch public share study series instances");
            }

            return (await response.json()) as DicomInstanceData[];
        },
        retry: (failureCount, error) => {
            return commonRetryHandler(failureCount, error);
        },
        staleTime: 30 * 60 * 1000,
        enabled: !!token && !!studyInstanceUid && !!seriesInstanceUid,
    });
};

export const getShareInstancesQuery = ({
    token,
    password,
    offset = 0,
    limit = 10,
}: PaginatedShareQueryParams) => {
    return queryOptions({
        queryKey: ["share-instances", token, password, offset, limit],
        queryFn: async () => {
            const response = await apiClient.api.share[":token"].instances.$get(
                {
                    param: { token },
                    query: {
                        password,
                        offset: offset.toString(),
                        limit: limit.toString(),
                    },
                },
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fetch public share instances");
            }

            return (await response.json()) as DicomInstanceData[];
        },
        retry: (failureCount, error) => {
            return commonRetryHandler(failureCount, error);
        },
        staleTime: 30 * 60 * 1000,
        enabled: !!token,
    });
};

// #region thumbnail
export const getShareStudyThumbnailQuery = ({
    token,
    password,
    studyInstanceUid,
    viewport = "224,224",
}: {
    token: string;
    password?: string;
    studyInstanceUid: string;
    viewport?: string;
}) => {
    return queryOptions({
        queryKey: [
            "share-study-thumbnail",
            token,
            password,
            studyInstanceUid,
            viewport,
        ],
        queryFn: async () => {
            const response = await apiClient.api.share[":token"].studies[
                ":studyInstanceUid"
            ].thumbnail.$get({
                header: {
                    accept: "image/jpeg",
                },
                param: {
                    token,
                    studyInstanceUid,
                },
                query: {
                    password,
                    viewport,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch public share study thumbnail");
            }

            return await response.blob();
        },
        staleTime: 30 * 60 * 1000,
        enabled: !!token && !!studyInstanceUid,
    });
};

export const getShareSeriesThumbnailQuery = ({
    token,
    password,
    studyInstanceUid,
    seriesInstanceUid,
    viewport = "64,64",
}: {
    token: string;
    password?: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    viewport?: string;
}) => {
    return queryOptions({
        queryKey: [
            "share-series-thumbnail",
            token,
            password,
            studyInstanceUid,
            seriesInstanceUid,
            viewport,
        ],
        queryFn: async () => {
            const response = await apiClient.api.share[":token"].studies[
                ":studyInstanceUid"
            ].series[":seriesInstanceUid"].thumbnail.$get({
                header: {
                    accept: "image/jpeg",
                },
                param: {
                    token,
                    studyInstanceUid,
                    seriesInstanceUid,
                },
                query: {
                    password,
                    viewport,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch public share series thumbnail");
            }

            return await response.blob();
        },
        enabled: !!token && !!studyInstanceUid && !!seriesInstanceUid,
        staleTime: 30 * 60 * 1000,
    });
};

export const getShareInstanceThumbnailQuery = ({
    token,
    password,
    studyInstanceUid,
    seriesInstanceUid,
    sopInstanceUid,
    viewport = "64,64",
}: {
    token: string;
    password?: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    sopInstanceUid: string;
    viewport?: string;
}) => {
    return queryOptions({
        queryKey: [
            "share-instance-thumbnail",
            token,
            password,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            viewport,
        ],
        queryFn: async () => {
            const response = await apiClient.api.share[":token"].studies[
                ":studyInstanceUid"
            ].series[":seriesInstanceUid"].instances[
                ":sopInstanceUid"
            ].thumbnail.$get({
                header: {
                    accept: "image/jpeg",
                },
                param: {
                    token,
                    studyInstanceUid,
                    seriesInstanceUid,
                    sopInstanceUid,
                },
                query: {
                    password,
                    viewport,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch public share instance thumbnail");
            }

            return await response.blob();
        },
        enabled:
            !!token &&
            !!studyInstanceUid &&
            !!seriesInstanceUid &&
            !!sopInstanceUid,
        staleTime: 30 * 60 * 1000,
    });
};
// #endregion thumbnail
