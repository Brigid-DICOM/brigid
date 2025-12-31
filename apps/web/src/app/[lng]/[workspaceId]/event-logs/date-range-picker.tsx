"use client";

import { format } from "date-fns";
import { enUS, zhTW } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useParams } from "next/navigation";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface EventLogDateRangePickerProps {
    from?: Date;
    to?: Date;
    onRangeChange: (from?: Date, to?: Date) => void;
    className?: string;
}

export function EventLogDateRangePicker({
    from,
    to,
    onRangeChange,
    className,
}: EventLogDateRangePickerProps) {
    const lng = useParams()?.lng;
    const locale = lng === "zh-TW" ? zhTW : enUS;
    const range: DateRange | undefined = React.useMemo(
        () => ({
            from,
            to,
        }),
        [from, to],
    );

    const handleSelect = (selectedRange: DateRange | undefined) => {
        onRangeChange(selectedRange?.from, selectedRange?.to);
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !from && "text-muted-foreground",
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {from ? (
                            to ? (
                                `${format(from, "LLL dd, y", { locale })} - ${format(to, "LLL dd, y", { locale })}`
                            ) : (
                                `${format(from, "LLL dd, y", { locale })}`
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        autoFocus
                        mode="range"
                        defaultMonth={from}
                        selected={range}
                        onSelect={handleSelect}
                        numberOfMonths={1}
                        locale={locale}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
