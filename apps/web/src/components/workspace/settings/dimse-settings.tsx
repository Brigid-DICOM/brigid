"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getQueryClient } from "@/react-query/get-query-client";
import {
    createDimseConfigMutation,
    type DimseAllowedIp,
    type DimseAllowedRemote,
    getDimseConfigQuery,
    updateDimseConfigMutation,
} from "@/react-query/queries/dimseConfig";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { DimseAllowedIpsSection } from "./dimse-allowed-ips-section";
import { DimseAllowedRemotesSection } from "./dimse-allowed-remotes-section";

interface DimseSettingsProps {
    workspace: {
        id: string;
        name: string;
        membership: {
            permissions: number;
            role: string;
        };
    };
    onClose: () => void;
}

export function DimseSettings({ workspace, onClose }: DimseSettingsProps) {
    const { t } = useT("translation");
    const queryClient = getQueryClient();

    const canManage = hasPermission(
        workspace.membership?.permissions ?? 0,
        WORKSPACE_PERMISSIONS.MANAGE,
    );

    const isReadOnly = !canManage;

    const { data: configData, isLoading } = useQuery(
        getDimseConfigQuery(workspace.id),
    );

    const [aeTitle, setAeTitle] = useState("");
    const [enabled, setEnabled] = useState(false);
    const [allowedIps, setAllowedIps] = useState<DimseAllowedIp[]>([]);
    const [allowedRemotes, setAllowedRemotes] = useState<DimseAllowedRemote[]>(
        [],
    );

    const [isSaving, setIsSaving] = useState(false);

    const createConfig = useMutation(createDimseConfigMutation());
    const updateConfig = useMutation(updateDimseConfigMutation());

    useEffect(() => {
        if (configData?.data) {
            setAeTitle(configData.data.aeTitle || "");
            setEnabled(configData.data.enabled || false);
            setAllowedIps(configData.data.allowedIps || []);
            setAllowedRemotes(configData.data.allowedRemotes || []);
        }
    }, [configData]);

    const invalidateConfig = useCallback(async () => {
        await queryClient.invalidateQueries({
            queryKey: ["dimseConfig", workspace.id],
        });
    }, [queryClient, workspace.id]);

    const handleSave = async () => {
        if (!aeTitle.trim()) {
            toast.error(t("dimseSettings.messages.aeTitleRequired"));
            return;
        }

        setIsSaving(true);
        try {
            if (configData?.data) {
                await updateConfig.mutateAsync({
                    workspaceId: workspace.id,
                    aeTitle,
                    enabled,
                });
            } else {
                await createConfig.mutateAsync({
                    workspaceId: workspace.id,
                    aeTitle,
                    enabled,
                });
            }
            await invalidateConfig();
            toast.success(t("dimseSettings.messages.saved"));
        } catch {
            toast.error(t("dimseSettings.messages.saveError"));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const configExists = !!configData?.data;

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 gap-6 overflow-y-auto p-6">
                {/* Basic Config */}
                <div className="grid gap-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium">
                            {t("dimseSettings.title")}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {t("dimseSettings.description")}
                        </p>
                    </div>

                    <Separator />

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="aeTitle">
                                {t("dimseSettings.aeTitle")}
                            </Label>
                            <Input
                                id="aeTitle"
                                value={aeTitle}
                                onChange={(e) =>
                                    setAeTitle(e.target.value.toUpperCase())
                                }
                                placeholder="AE_TITLE"
                                maxLength={16}
                                disabled={isReadOnly}
                                className="max-w-md uppercase"
                            />
                            <p className="text-xs text-muted-foreground">
                                {t("dimseSettings.aeTitleHint")}
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="enabled"
                                checked={enabled}
                                onCheckedChange={(checked) =>
                                    setEnabled(checked === true)
                                }
                                disabled={isReadOnly}
                            />
                            <Label htmlFor="enabled">
                                {t("dimseSettings.enabled")}
                            </Label>
                        </div>
                    </div>

                    {/* Allowed IPs */}
                    {configExists && (
                        <DimseAllowedIpsSection
                            workspaceId={workspace.id}
                            allowedIps={allowedIps}
                            isReadOnly={isReadOnly}
                            onUpdate={invalidateConfig}
                        />
                    )}

                    {/* Allowed Remotes */}
                    {configExists && (
                        <DimseAllowedRemotesSection
                            workspaceId={workspace.id}
                            allowedRemotes={allowedRemotes}
                            isReadOnly={isReadOnly}
                            onUpdate={invalidateConfig}
                        />
                    )}

                    {/* Config Not Created Hint */}
                    {!configExists && (
                        <div className="mt-6 p-4 border rounded-md bg-muted/50">
                            <p className="text-sm text-muted-foreground">
                                {t("dimseSettings.createHint")}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {!isReadOnly && (
                <div className="border-t p-4 bg-background mt-auto">
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>
                            {t("common.cancel")}
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving
                                ? t("common.saving")
                                : configExists
                                  ? t("common.saveChanges")
                                  : t("dimseSettings.createConfig")}
                        </Button>
                    </DialogFooter>
                </div>
            )}
        </div>
    );
}
