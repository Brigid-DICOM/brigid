"use client";

import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useT } from "@/app/_i18n/client";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { EventLogFilters } from "./content";
import { EventLogDateRangePicker } from "./date-range-picker";

interface EventLogSearchBarProps {
    filters: EventLogFilters;
    setFilters: (filters: EventLogFilters) => void;
}

const NAME_GROUPS = [
    {
        label: "Store",
        options: ["storeInstance"],
    },
    {
        label: "Query",
        options: [
            "searchStudies",
            "searchStudySeries",
            "searchStudySeriesInstances",
            "searchSeries",
            "searchInstances",
        ],
    },
    {
        label: "Retrieve",
        options: [
            "retrieveInstance",
            "retrieveSeries",
            "retrieveStudy",
            "retrieveStudyThumbnail",
            "retrieveSeriesThumbnail",
            "retrieveInstanceThumbnail",
            "retrieveRenderedSeries",
            "retrieveRenderedInstance",
            "retrieveRenderedFrames",
            "retrieveStudyMetadata",
            "retrieveSeriesMetadata",
            "retrieveInstanceMetadata",
            "retrieveFramePixelData",
        ],
    },
];

export function EventLogSearchBar({
    filters,
    setFilters,
}: EventLogSearchBarProps) {
    const { t } = useT("translation");
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-wrap gap-4 mb-6 items-end">
            <div className="space-y-2">
                <span className="text-sm font-medium block">Level</span>
                <Select
                    value={filters.level || "all"}
                    onValueChange={(v) =>
                        setFilters({
                            ...filters,
                            level: v === "all" ? undefined : v,
                        })
                    }
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder={t("eventLogs.level.all")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            {t("eventLogs.level.all")}
                        </SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Name 搜尋 */}
            <div className="space-y-2">
                <span className="text-sm font-medium block">Name</span>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            role="combobox"
                            aria-expanded={open}
                            className="w-[250px] justify-between"
                        >
                            {filters.name ? filters.name : "Select name..."}
                            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0">
                        <Command>
                            <CommandInput placeholder="Search name..." />
                            <CommandList>
                                <CommandEmpty>No name found.</CommandEmpty>
                                {NAME_GROUPS.map((group) => (
                                    <CommandGroup
                                        key={group.label}
                                        heading={group.label}
                                    >
                                        {group.options.map((option) => (
                                            <CommandItem
                                                key={option}
                                                value={option}
                                                onSelect={(currentValue) => {
                                                    setFilters({
                                                        ...filters,
                                                        name:
                                                            currentValue ===
                                                            filters.name
                                                                ? undefined
                                                                : currentValue,
                                                    });
                                                    setOpen(false);
                                                }}
                                            >
                                                <CheckIcon
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        filters.name === option
                                                            ? "opacity-100"
                                                            : "opacity-0",
                                                    )}
                                                />
                                                {option}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
                <span className="text-sm font-medium block">Date Range</span>
                <EventLogDateRangePicker
                    from={filters.from}
                    to={filters.to}
                    onRangeChange={(from, to) => {
                        setFilters({
                            ...filters,
                            from,
                            to,
                        });
                    }}
                />
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({})}
                className="h-10"
            >
                <XIcon className="mr-2 h-4 w-4" /> Reset
            </Button>
        </div>
    );
}
