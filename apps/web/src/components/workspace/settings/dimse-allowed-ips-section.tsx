"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    addAllowedIpMutation,
    type DimseAllowedIp,
    removeAllowedIpMutation,
} from "@/react-query/queries/dimseConfig";

interface AllowedIpsSectionProps {
    workspaceId: string;
    allowedIps: DimseAllowedIp[];
    isReadOnly: boolean;
    onUpdate: () => Promise<void>;
}

export function DimseAllowedIpsSection({
    workspaceId,
    allowedIps,
    isReadOnly,
    onUpdate,
}: AllowedIpsSectionProps) {
    const { t } = useT("translation");

    const [newIp, setNewIp] = useState({
        ipMask: "",
        description: "",
    });

    const addIp = useMutation(addAllowedIpMutation());
    const removeIp = useMutation(removeAllowedIpMutation());

    const handleAddIp = async () => {
        if (!newIp.ipMask.trim()) return;

        try {
            await addIp.mutateAsync({
                workspaceId,
                ipMask: newIp.ipMask,
                description: newIp.description || undefined,
            });
            setNewIp({ ipMask: "", description: "" });
            await onUpdate();
            toast.success(t("dimseSettings.messages.ipAdded"));
        } catch {
            toast.error(t("dimseSettings.messages.ipAddError"));
        }
    };

    const handleRemoveIp = async (ipId: string) => {
        try {
            await removeIp.mutateAsync({
                workspaceId,
                allowedIpId: ipId,
            });
            await onUpdate();
            toast.success(t("dimseSettings.messages.ipRemoved"));
        } catch {
            toast.error(t("dimseSettings.messages.ipRemoveError"));
        }
    };

    return (
        <div className="grid gap-4 mt-6">
            <div className="space-y-1">
                <h3 className="text-lg font-medium">
                    {t("dimseSettings.allowedIps.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {t("dimseSettings.allowedIps.description")}
                </p>
            </div>

            <Separator />

            {!isReadOnly && (
                <div className="flex gap-2 items-end">
                    <div className="grid gap-2 flex-1">
                        <Label htmlFor="newIpMask">
                            {t("dimseSettings.allowedIps.ipMask")}
                        </Label>
                        <Input
                            id="newIpMask"
                            value={newIp.ipMask}
                            onChange={(e) =>
                                setNewIp({ ...newIp, ipMask: e.target.value })
                            }
                            placeholder="192.168.1.0/24"
                        />
                    </div>
                    <div className="grid gap-2 flex-1">
                        <Label htmlFor="newIpDesc">
                            {t("dimseSettings.allowedIps.descriptionField")}
                        </Label>
                        <Input
                            id="newIpDesc"
                            value={newIp.description}
                            onChange={(e) =>
                                setNewIp({
                                    ...newIp,
                                    description: e.target.value,
                                })
                            }
                            placeholder={t("common.optional")}
                        />
                    </div>
                    <Button
                        size="icon"
                        onClick={handleAddIp}
                        disabled={addIp.isPending || !newIp.ipMask.trim()}
                    >
                        {addIp.isPending ? (
                            <Loader2Icon className="size-4 animate-spin" />
                        ) : (
                            <PlusIcon className="size-4" />
                        )}
                    </Button>
                </div>
            )}

            {allowedIps.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                {t("dimseSettings.allowedIps.ipMask")}
                            </TableHead>
                            <TableHead>
                                {t("dimseSettings.allowedIps.descriptionField")}
                            </TableHead>
                            {!isReadOnly && <TableHead className="w-[50px]" />}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allowedIps.map((ip) => (
                            <TableRow key={ip.id}>
                                <TableCell className="font-mono">
                                    {ip.ipMask}
                                </TableCell>
                                <TableCell>{ip.description || "-"}</TableCell>
                                {!isReadOnly && (
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleRemoveIp(ip.id)
                                            }
                                            disabled={removeIp.isPending}
                                        >
                                            <TrashIcon className="size-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                    {t("dimseSettings.allowedIps.empty")}
                </p>
            )}
        </div>
    );
}
