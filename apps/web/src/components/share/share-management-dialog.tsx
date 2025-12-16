"use client";

import type { ShareTargetType } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import { Share2Icon } from "lucide-react";
import { useState } from "react";
import { useT } from "@/app/_i18n/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTargetShareLinkCountQuery } from "@/react-query/queries/share";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { CreateShareTab } from "./create-share-tab";
import { ManageShareTab } from "./manage-share-tab";

interface ShareManagementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
    targetType: ShareTargetType;
    targetIds: string[];
}

export function ShareManagementDialog({
    open,
    onOpenChange,
    workspaceId,
    targetType,
    targetIds,
}: ShareManagementDialogProps) {
    const { t } = useT("translation");
    const [activeTab, setActiveTab] = useState("create");

    const { data: shareLinkCount, isLoading: isLoadingShareLinkCount } =
        useQuery(
            getTargetShareLinkCountQuery({
                targetType,
                targetIds,
                workspaceId,
            }),
        );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2Icon className="w-5 h-5" />
                        {t("shareManagementDialog.title")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("shareManagementDialog.description", { targetType })}
                    </DialogDescription>
                </DialogHeader>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="mt-4"
                >
                    <TabsList>
                        <TabsTrigger value="create">
                            {t("shareManagementDialog.create")}
                        </TabsTrigger>
                        <TabsTrigger value="manage">
                            {t("shareManagementDialog.manage")}
                            {isLoadingShareLinkCount ? (
                                <Skeleton className="w-10 h-4" />
                            ) : (
                                <Badge>{shareLinkCount?.data?.count}</Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="create">
                        <CreateShareTab
                            workspaceId={workspaceId}
                            targetType={targetType}
                            targetIds={targetIds}
                        />
                    </TabsContent>

                    <TabsContent value="manage">
                        <ManageShareTab
                            workspaceId={workspaceId}
                            targetType={targetType}
                            targetIds={targetIds}
                        />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
