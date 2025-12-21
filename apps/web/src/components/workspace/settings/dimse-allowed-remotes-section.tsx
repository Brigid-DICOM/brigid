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
    addAllowedRemoteMutation,
    type DimseAllowedRemote,
    removeAllowedRemoteMutation,
} from "@/react-query/queries/dimseConfig";

interface DimseAllowedRemotesSectionProps {
    workspaceId: string;
    allowedRemotes: DimseAllowedRemote[];
    isReadOnly: boolean;
    onUpdate: () => Promise<void>;
}

export function DimseAllowedRemotesSection({
    workspaceId,
    allowedRemotes,
    isReadOnly,
    onUpdate,
}: DimseAllowedRemotesSectionProps) {
    const { t } = useT("translation");

    const [newRemote, setNewRemote] = useState({
        aeTitle: "",
        host: "",
        port: "",
        description: "",
    });

    const addRemote = useMutation(addAllowedRemoteMutation());
    const removeRemote = useMutation(removeAllowedRemoteMutation());

    const handleAddRemote = async () => {
        if (
            !newRemote.aeTitle.trim() ||
            !newRemote.host.trim() ||
            !newRemote.port.trim()
        )
            return;

        try {
            await addRemote.mutateAsync({
                workspaceId,
                aeTitle: newRemote.aeTitle,
                host: newRemote.host,
                port: Number.parseInt(newRemote.port, 10),
                description: newRemote.description || undefined,
            });
            setNewRemote({ aeTitle: "", host: "", port: "", description: "" });
            await onUpdate();
            toast.success(t("dimseSettings.messages.remoteAdded"));
        } catch {
            toast.error(t("dimseSettings.messages.remoteAddError"));
        }
    };

    const handleRemoveRemote = async (remoteId: string) => {
        try {
            await removeRemote.mutateAsync({
                workspaceId,
                remoteId,
            });
            await onUpdate();
            toast.success(t("dimseSettings.messages.remoteRemoved"));
        } catch {
            toast.error(t("dimseSettings.messages.remoteRemoveError"));
        }
    };

    return (
        <div className="grid gap-4 mt-6">
            <div className="space-y-1">
                <h3 className="text-lg font-medium">
                    {t("dimseSettings.allowedRemotes.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {t("dimseSettings.allowedRemotes.description")}
                </p>
            </div>

            <Separator />

            {!isReadOnly && (
                <div className="flex gap-2 items-end flex-wrap">
                    <div className="grid gap-2">
                        <Label htmlFor="newRemoteAeTitle">
                            {t("dimseSettings.allowedRemotes.aeTitle")}
                        </Label>
                        <Input
                            id="newRemoteAeTitle"
                            value={newRemote.aeTitle}
                            onChange={(e) =>
                                setNewRemote({
                                    ...newRemote,
                                    aeTitle: e.target.value.toUpperCase(),
                                })
                            }
                            placeholder="REMOTE_AE"
                            maxLength={16}
                            className="w-32 uppercase"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="newRemoteHost">
                            {t("dimseSettings.allowedRemotes.host")}
                        </Label>
                        <Input
                            id="newRemoteHost"
                            value={newRemote.host}
                            onChange={(e) =>
                                setNewRemote({
                                    ...newRemote,
                                    host: e.target.value,
                                })
                            }
                            placeholder="192.168.1.100"
                            className="w-36"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="newRemotePort">
                            {t("dimseSettings.allowedRemotes.port")}
                        </Label>
                        <Input
                            id="newRemotePort"
                            type="number"
                            value={newRemote.port}
                            onChange={(e) =>
                                setNewRemote({
                                    ...newRemote,
                                    port: e.target.value,
                                })
                            }
                            placeholder="11112"
                            min={1}
                            max={65535}
                            className="w-24"
                        />
                    </div>
                    <div className="grid gap-2 flex-1">
                        <Label htmlFor="newRemoteDesc">
                            {t("dimseSettings.allowedRemotes.descriptionField")}
                        </Label>
                        <Input
                            id="newRemoteDesc"
                            value={newRemote.description}
                            onChange={(e) =>
                                setNewRemote({
                                    ...newRemote,
                                    description: e.target.value,
                                })
                            }
                            placeholder={t("common.optional")}
                        />
                    </div>
                    <Button
                        size="icon"
                        onClick={handleAddRemote}
                        disabled={
                            addRemote.isPending ||
                            !newRemote.aeTitle.trim() ||
                            !newRemote.host.trim() ||
                            !newRemote.port.trim()
                        }
                    >
                        {addRemote.isPending ? (
                            <Loader2Icon className="size-4 animate-spin" />
                        ) : (
                            <PlusIcon className="size-4" />
                        )}
                    </Button>
                </div>
            )}

            {allowedRemotes.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                {t("dimseSettings.allowedRemotes.aeTitle")}
                            </TableHead>
                            <TableHead>
                                {t("dimseSettings.allowedRemotes.host")}
                            </TableHead>
                            <TableHead>
                                {t("dimseSettings.allowedRemotes.port")}
                            </TableHead>
                            <TableHead>
                                {t(
                                    "dimseSettings.allowedRemotes.descriptionField",
                                )}
                            </TableHead>
                            {!isReadOnly && <TableHead className="w-[50px]" />}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allowedRemotes.map((remote) => (
                            <TableRow key={remote.id}>
                                <TableCell className="font-mono">
                                    {remote.aeTitle}
                                </TableCell>
                                <TableCell className="font-mono">
                                    {remote.host}
                                </TableCell>
                                <TableCell>{remote.port}</TableCell>
                                <TableCell>
                                    {remote.description || "-"}
                                </TableCell>
                                {!isReadOnly && (
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleRemoveRemote(remote.id)
                                            }
                                            disabled={removeRemote.isPending}
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
                    {t("dimseSettings.allowedRemotes.empty")}
                </p>
            )}
        </div>
    );
}
