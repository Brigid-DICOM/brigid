import { CalendarIcon } from "lucide-react";
import { nanoid } from "nanoid";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

const EXPIRATION_OPTIONS = [
    {
        label: "Never",
        value: null,
    },
    {
        label: "1 Hour",
        value: 60 * 60,
    },
    {
        label: "1 Day",
        value: 24 * 60 * 60,
    },
    {
        label: "7 Days",
        value: 7 * 24 * 60 * 60,
    },
    {
        label: "15 Days",
        value: 15 * 24 * 60 * 60,
    },
    {
        label: "30 Days",
        value: 30 * 24 * 60 * 60,
    },
    {
        label: "60 Days",
        value: 60 * 24 * 60 * 60,
    },
    {
        label: "90 Days",
        value: 90 * 24 * 60 * 60,
    },
];

interface ShareExpirationDropdownProps {
    expiresInSec: number | null;
    onSelect: (expiresInSec: number | null) => void;
    id?: string;
}

export function ShareExpirationDropdown({
    expiresInSec,
    onSelect,
    id,
}: ShareExpirationDropdownProps) {
    const expirationId = id || nanoid();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-full" id={expirationId}>
            <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="size-4" />
                    <span>
                        {expiresInSec
                            ? `${
                                  EXPIRATION_OPTIONS.find(
                                      (option) =>
                                          option.value ===
                                          expiresInSec
                                  )?.label
                              }`
                            : "Never"}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                {EXPIRATION_OPTIONS.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => onSelect(option.value)}
                    >
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
