import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { routingApi } from "@/app/[lng]/[workspaceId]/routing/api";
import type { RoutingJobStatus } from "@/app/[lng]/[workspaceId]/routing/types";

export const ROUTING_JOBS_QUERY_KEY = "routing-jobs";
export const ROUTING_JOBS_REFETCH_INTERVAL_MS = 5000;

export const getRoutingJobsQuery = ({
    workspaceId,
    status = "all",
    page = 0,
    limit = 20,
}: {
    workspaceId: string;
    status?: RoutingJobStatus | "all";
    page?: number;
    limit?: number;
}) =>
    queryOptions({
        queryKey: [ROUTING_JOBS_QUERY_KEY, workspaceId, status, page, limit],
        queryFn: () =>
            routingApi.listJobs(workspaceId, {
                ...(status !== "all" ? { status } : {}),
                limit,
                offset: page * limit,
            }),
        placeholderData: keepPreviousData,
        refetchInterval: ROUTING_JOBS_REFETCH_INTERVAL_MS,
        refetchIntervalInBackground: false,
    });
