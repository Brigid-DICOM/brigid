import { Skeleton } from "../ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

interface LoadingDataTableProps {
    columns?: number;
    rows?: number;
}

export function LoadingDataTable({
    columns = 5,
    rows = 10,
}: LoadingDataTableProps) {
    const columnKeys = Array.from(
        { length: columns },
        (_, index) => `column-${index}`,
    );
    const rowKeys = Array.from({ length: rows }, (_, index) => `row-${index}`);

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columnKeys.map((key) => (
                            <TableHead key={key}>
                                <Skeleton className="h-4 w-24" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rowKeys.map((key) => (
                        <TableRow key={key}>
                            {columnKeys.map((columnKey) => (
                                <TableCell key={columnKey}>
                                    <Skeleton className="h-4 w-[80%]" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
