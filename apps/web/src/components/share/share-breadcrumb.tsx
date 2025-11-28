"use client";

import { ChevronRightIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";


interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface ShareBreadcrumbProps {
    items: BreadcrumbItem[];
    children?: React.ReactNode;
    className?: string;
}

export function ShareBreadcrumb({ items, children, className }: ShareBreadcrumbProps) {
    return (
        <nav
            className={cn(
                "flex items-center gap-1 text-sm",
                className
            )}
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                
                return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: index is used as key
                    <div key={index} className="flex items-center gap-1">
                        {index > 0 && (
                            <ChevronRightIcon className="size-4 text-muted-foreground" />
                        )}
                        {index === 0 && (
                            <HomeIcon className="size-4 text-muted-foreground" />
                        )}
                        {item.href && !isLast ? (
                            <Link href={item.href} className="text-primary hover:underline font-medium truncate max-w-[200px]">
                                {item.label}
                            </Link>
                        ): (
                            <span
                                className={cn(
                                    "truncate max-w-[200px]",
                                    isLast ? "text-foreground font-medium" : "text-muted-foreground"
                                )}
                                title={item.label}
                            >
                                {item.label}
                            </span>
                        )}
                    </div>
                )
            })}

            {children}
        </nav>
    )
}