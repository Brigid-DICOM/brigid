"use client";

import { FileIcon, FolderIcon, ImageIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "../ui/input";

interface ShareLinkTarget {
    id: string;
    targetType: "study" | "series" | "instance";
    targetId: string;
}

interface ShareLinkDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    name?: string;
    targets: ShareLinkTarget[];
    token: string;
}

const TARGET_TYPE_CONFIG = {
    study: {
        label: "Study",
        idLabel: "Study Instance UID",
        icon: FolderIcon,
        iconColor: "text-amber-500",
    },
    series: {
        label: "Series",
        idLabel: "Series Instance UID",
        icon: FileIcon,
        iconColor: "text-blue-500",
    },
    instance: {
        label: "Instance",
        idLabel: "SOP Instance UID",
        icon: ImageIcon,
        iconColor: "text-green-500",
    },
} as const;

export function ShareLinkDetailsDialog({
    open,
    onOpenChange,
    name,
    targets,
    token,
}: ShareLinkDetailsDialogProps) {
    return createPortal(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{name || "Share Link Details"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                        Shared Targets ({targets.length})
                    </div>

                    <div>
                        <span className="text-xs text-muted-foreground">
                            Share Link URL
                        </span>
                        <Input
                            value={`${window.location.origin}/share/${token}`}
                            readOnly
                            className="cursor-pointer hover:bg-muted"
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/share/${token}`);
                                toast.success("Share link copied", {
                                    position: "bottom-center",
                                });
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        {targets.map((target) => {
                            const config = TARGET_TYPE_CONFIG[target.targetType];
                            const Icon = config.icon;

                            return (
                                <Card key={target.id}>
                                    <CardContent>
                                        <div className="flex items-start gap-3">
                                            {/* Icon */}
                                            <div className="flex-shrink-0 mt-1">
                                                <Icon className={`h-5 w-5 ${config.iconColor}`} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 space-y-2">
                                                {/* Target Type */}
                                                <div>
                                                    <span className="text-xs text-muted-foreground">
                                                        Type
                                                    </span>
                                                    <div className="text-sm font-medium capitalize">
                                                        {config.label}
                                                    </div>
                                                </div>

                                                {/* Target ID */}
                                                <div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {config.idLabel}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="text-sm text-left font-mono break-all cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(target.targetId);
                                                            toast.success("Target ID copied", {
                                                                position: "bottom-center",
                                                            });
                                                        }}
                                                        title="Click to copy"
                                                    >
                                                        {target.targetId}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>,
        document.body
    )   
}