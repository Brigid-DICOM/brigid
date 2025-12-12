"use client";

import type { TFunction } from "i18next";
import { CalendarIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useT } from "@/app/_i18n/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

const getExpiration = (t: TFunction) => {
    return [
        {
            label: t("common.expiration.never"),
            value: null,
        },
        {
            label: `1 ${t("common.expiration.hour")}`,
            value: 60 * 60,
        },
        {
            label: `1 ${t("common.expiration.day")}`,
            value: 24 * 60 * 60,
        },
        {
            label: `7 ${t("common.expiration.days")}`,
            value: 7 * 24 * 60 * 60,
        },
        {
            label: `15 ${t("common.expiration.days")}`,
            value: 15 * 24 * 60 * 60,
        },
        {
            label: `30 ${t("common.expiration.days")}`,
            value: 30 * 24 * 60 * 60,
        },
        {
            label: `60 ${t("common.expiration.days")}`,
            value: 60 * 24 * 60 * 60,
        },
        {
            label: `90 ${t("common.expiration.days")}`,
            value: 90 * 24 * 60 * 60,
        },
    ]
};

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
    const { t } = useT("translation");
    const expirationId = id || nanoid();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-full" id={expirationId}>
            <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="size-4" />
                    <span>
                        {expiresInSec
                            ? `${
                                  getExpiration(t).find(
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
                {getExpiration(t).map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => onSelect(option.value ?? null)}
                    >
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
