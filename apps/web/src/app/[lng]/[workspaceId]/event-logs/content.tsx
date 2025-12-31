"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingDataTable } from "@/components/common/loading-data-table";
import { PaginationControls } from "@/components/common/pagination-controls";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getEventLogsQuery } from "@/react-query/queries/eventLog";
import { EventLogMessageCell } from "./message-cell";
import { EventLogSearchBar } from "./search-bar";

export interface EventLogFilters {
    level?: string;
    name?: string;
    from?: Date;
    to?: Date;
}

export default function EventLogsContent({
    workspaceId,
}: {
    workspaceId: string;
}) {
    const [filters, setFilters] = useState<EventLogFilters>({});
    const [page, setPage] = useState(0);
    const limit = 20;

    const { data, isLoading, error } = useQuery(
        getEventLogsQuery({
            workspaceId,
            limit,
            offset: page * limit,
            level: filters.level,
            startDate: filters.from
                ? format(filters.from, "yyyy-MM-dd")
                : undefined,
            endDate: filters.to ? format(filters.to, "yyyy-MM-dd") : undefined,
            name: filters.name,
        }),
    );

    const hasNextPage = data?.data.hasNextPage ?? false;

    if (error) {
        return (
            <EmptyState
                title="Error"
                description="Failed to fetch event logs"
            />
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Event Logs</h1>
            <EventLogSearchBar filters={filters} setFilters={setFilters} />

            <div className="border rounded-md">
                {isLoading ? (
                    <LoadingDataTable columns={5} rows={10} />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Elapsed</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.data.eventLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {format(
                                            new Date(log.createdAt),
                                            "yyyy-MM-dd HH:mm:ss",
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                log.level === "error"
                                                    ? "destructive"
                                                    : log.level === "warning"
                                                      ? "outline"
                                                      : "secondary"
                                            }
                                        >
                                            {log.level}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {log.name}
                                    </TableCell>
                                    <TableCell>
                                        <EventLogMessageCell
                                            message={log.message}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {log.elapsedTime
                                            ? `${log.elapsedTime}ms`
                                            : "-"}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {data?.data.eventLogs.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center"
                                    >
                                        <EmptyState
                                            title="No data"
                                            description="No event logs found"
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
            {/* 分頁按鈕可參考專案中的 PaginationControls */}

            <div className="mt-4" />

            <PaginationControls
                canGoPrevious={page > 0}
                canGoNext={hasNextPage}
                onPrevious={() => setPage(page - 1)}
                onNext={() => setPage(page + 1)}
            />
        </div>
    );
}
