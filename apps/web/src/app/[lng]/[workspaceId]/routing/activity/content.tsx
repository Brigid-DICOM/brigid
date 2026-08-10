"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingDataTable } from "@/components/common/loading-data-table";
import { PaginationControls } from "@/components/common/pagination-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type JobStatus =
    | "scheduled"
    | "sending"
    | "succeeded"
    | "failed"
    | "dead"
    | "queued";

type RoutingJob = {
    id: string;
    status: JobStatus;
    scheduledAt: string;
    sopInstanceUid: string;
    lastError?: string | null;
    warning?: string | null;
    rule?: { name: string };
    destination?: { name: string };
};

const STATUS_FILTERS: Array<JobStatus | "all"> = [
    "all",
    "scheduled",
    "sending",
    "failed",
    "dead",
    "succeeded",
];

export default function RoutingActivityContent({
    workspaceId,
}: {
    workspaceId: string;
}) {
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<JobStatus | "all">("all");
    const [page, setPage] = useState(0);
    const limit = 20;
    const base = `/api/workspaces/${workspaceId}/routing`;

    const { data, isLoading, error } = useQuery({
        queryKey: ["routing-jobs", workspaceId, status, page],
        queryFn: async () => {
            const params = new URLSearchParams({
                limit: String(limit),
                offset: String(page * limit),
            });
            if (status !== "all") {
                params.set("status", status);
            }
            const response = await fetch(`${base}/jobs?${params.toString()}`);
            return response.json() as Promise<{
                ok: boolean;
                data: { items: RoutingJob[]; total: number };
            }>;
        },
    });

    const sendNow = useMutation({
        mutationFn: (id: string) =>
            fetch(`${base}/jobs/${id}/send-now`, { method: "POST" }),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ["routing-jobs", workspaceId],
            }),
    });

    const retry = useMutation({
        mutationFn: (id: string) =>
            fetch(`${base}/jobs/${id}/retry`, { method: "POST" }),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ["routing-jobs", workspaceId],
            }),
    });

    if (error) {
        return (
            <EmptyState
                title="Error"
                description="Failed to fetch routing jobs"
            />
        );
    }

    const items = data?.data.items ?? [];
    const total = data?.data.total ?? 0;
    const hasNextPage = (page + 1) * limit < total;

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Routing Activity</h1>

            <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((filter) => (
                    <Button
                        key={filter}
                        size="sm"
                        variant={status === filter ? "default" : "outline"}
                        onClick={() => {
                            setStatus(filter);
                            setPage(0);
                        }}
                    >
                        {filter}
                    </Button>
                ))}
            </div>

            <div className="border rounded-md">
                {isLoading ? (
                    <LoadingDataTable columns={6} rows={10} />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Status</TableHead>
                                <TableHead>Scheduled At</TableHead>
                                <TableHead>SOP Instance UID</TableHead>
                                <TableHead>Rule</TableHead>
                                <TableHead>Destination</TableHead>
                                <TableHead>Error / Warning</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {job.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {format(
                                            new Date(job.scheduledAt),
                                            "yyyy-MM-dd HH:mm:ss",
                                        )}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {job.sopInstanceUid}
                                    </TableCell>
                                    <TableCell>
                                        {job.rule?.name ?? "—"}
                                    </TableCell>
                                    <TableCell>
                                        {job.destination?.name ?? "—"}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate text-sm">
                                        {job.lastError || job.warning || "—"}
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        {job.status === "scheduled" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    sendNow.mutate(job.id)
                                                }
                                            >
                                                Send Now
                                            </Button>
                                        )}
                                        {(job.status === "failed" ||
                                            job.status === "dead") && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    retry.mutate(job.id)
                                                }
                                            >
                                                Retry
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <PaginationControls
                canGoPrevious={page > 0}
                canGoNext={hasNextPage}
                onPrevious={() => setPage((p) => Math.max(0, p - 1))}
                onNext={() => setPage((p) => p + 1)}
            />
        </div>
    );
}
