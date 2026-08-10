"use client";

import { Loader2Icon, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { routingApi } from "../api";
import type {
    AllowedRemote,
    RoutingAuthType,
    RoutingDestination,
    RoutingDestinationType,
} from "../types";

const emptyForm = {
    name: "",
    type: "dimse" as RoutingDestinationType,
    aeTitle: "",
    host: "",
    port: "",
    baseUrl: "",
    authType: "none" as RoutingAuthType,
    authUsername: "",
    authSecret: "",
};

export function DestinationsTab({ workspaceId }: { workspaceId: string }) {
    const [destinations, setDestinations] = useState<RoutingDestination[]>([]);
    const [allowedRemotes, setAllowedRemotes] = useState<AllowedRemote[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const load = async () => {
        setIsLoading(true);
        try {
            const [{ destinations: list }, remotes] = await Promise.all([
                routingApi.listDestinations(workspaceId),
                routingApi.listAllowedRemotes(workspaceId),
            ]);
            setDestinations(list);
            setAllowedRemotes(remotes);
        } catch {
            toast.error("Failed to load routing destinations");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workspaceId]);

    const handleCreate = async () => {
        if (!form.name.trim()) return;

        const body: Record<string, unknown> = {
            name: form.name,
            type: form.type,
        };
        if (form.type === "dimse") {
            body.aeTitle = form.aeTitle.toUpperCase();
            body.host = form.host;
            body.port = Number.parseInt(form.port, 10);
        } else {
            body.baseUrl = form.baseUrl;
            body.authType = form.authType;
            if (form.authType !== "none") {
                body.authUsername = form.authUsername || undefined;
                body.authSecret = form.authSecret || undefined;
            }
        }

        setIsSaving(true);
        try {
            await routingApi.createDestination(workspaceId, body);
            setForm(emptyForm);
            await load();
            toast.success("Destination created");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to create destination",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await routingApi.deleteDestination(workspaceId, id);
            await load();
            toast.success("Destination deleted");
        } catch {
            toast.error("Failed to delete destination");
        }
    };

    const handleImport = async (allowedRemoteId: string) => {
        try {
            await routingApi.importDestinationFromAllowedRemote(
                workspaceId,
                allowedRemoteId,
            );
            await load();
            toast.success("Destination imported");
        } catch {
            toast.error("Failed to import destination");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            <div className="grid gap-3 rounded-md border p-4">
                <h3 className="text-sm font-medium">New Destination</h3>
                <div className="flex flex-wrap gap-3 items-end">
                    <div className="grid gap-1.5">
                        <Label>Name</Label>
                        <Input
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="w-48"
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label>Type</Label>
                        <Select
                            value={form.type}
                            onValueChange={(value) =>
                                setForm({
                                    ...form,
                                    type: value as RoutingDestinationType,
                                })
                            }
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dimse">DIMSE</SelectItem>
                                <SelectItem value="dicomweb">
                                    DICOMweb
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {form.type === "dimse" ? (
                        <>
                            <div className="grid gap-1.5">
                                <Label>AE Title</Label>
                                <Input
                                    value={form.aeTitle}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            aeTitle:
                                                e.target.value.toUpperCase(),
                                        })
                                    }
                                    className="w-32 uppercase"
                                    maxLength={16}
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label>Host</Label>
                                <Input
                                    value={form.host}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            host: e.target.value,
                                        })
                                    }
                                    className="w-36"
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label>Port</Label>
                                <Input
                                    type="number"
                                    value={form.port}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            port: e.target.value,
                                        })
                                    }
                                    className="w-24"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid gap-1.5 flex-1 min-w-[220px]">
                                <Label>Base URL</Label>
                                <Input
                                    value={form.baseUrl}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            baseUrl: e.target.value,
                                        })
                                    }
                                    placeholder="https://pacs.example.com/dicomweb"
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label>Auth</Label>
                                <Select
                                    value={form.authType}
                                    onValueChange={(value) =>
                                        setForm({
                                            ...form,
                                            authType: value as RoutingAuthType,
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-28">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            None
                                        </SelectItem>
                                        <SelectItem value="basic">
                                            Basic
                                        </SelectItem>
                                        <SelectItem value="bearer">
                                            Bearer
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {form.authType !== "none" && (
                                <>
                                    {form.authType === "basic" && (
                                        <div className="grid gap-1.5">
                                            <Label>Username</Label>
                                            <Input
                                                value={form.authUsername}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        authUsername:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-32"
                                            />
                                        </div>
                                    )}
                                    <div className="grid gap-1.5">
                                        <Label>
                                            {form.authType === "bearer"
                                                ? "Token"
                                                : "Password"}
                                        </Label>
                                        <Input
                                            type="password"
                                            value={form.authSecret}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    authSecret:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-36"
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    <Button
                        onClick={handleCreate}
                        disabled={isSaving || !form.name.trim()}
                    >
                        {isSaving ? (
                            <Loader2Icon className="size-4 animate-spin" />
                        ) : (
                            <PlusIcon className="size-4" />
                        )}
                        Add
                    </Button>
                </div>

                {allowedRemotes.length > 0 && (
                    <div className="flex items-center gap-2 pt-2">
                        <Label>Import from Allowed Remote</Label>
                        <Select onValueChange={handleImport}>
                            <SelectTrigger className="w-56">
                                <SelectValue placeholder="Select allowed remote" />
                            </SelectTrigger>
                            <SelectContent>
                                {allowedRemotes.map((remote) => (
                                    <SelectItem
                                        key={remote.id}
                                        value={remote.id}
                                    >
                                        {remote.aeTitle} ({remote.host}:
                                        {remote.port})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Enabled</TableHead>
                        <TableHead className="w-[50px]" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {destinations.map((destination) => (
                        <TableRow key={destination.id}>
                            <TableCell className="font-medium">
                                {destination.name}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">
                                    {destination.type}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                                {destination.type === "dimse"
                                    ? `${destination.aeTitle}@${destination.host}:${destination.port}`
                                    : destination.baseUrl}
                            </TableCell>
                            <TableCell>
                                {destination.enabled ? "Yes" : "No"}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        handleDelete(destination.id)
                                    }
                                >
                                    <TrashIcon className="size-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {destinations.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-center text-muted-foreground"
                            >
                                No destinations yet
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
