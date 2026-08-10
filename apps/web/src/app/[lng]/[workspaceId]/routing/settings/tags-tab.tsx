"use client";

import { Loader2Icon, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import { routingApi } from "../api";
import type { BuiltInRoutingTag, RoutingTag } from "../types";

export function TagsTab({ workspaceId }: { workspaceId: string }) {
    const [builtInTags, setBuiltInTags] = useState<BuiltInRoutingTag[]>([]);
    const [tags, setTags] = useState<RoutingTag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [tagKey, setTagKey] = useState("");
    const [label, setLabel] = useState("");

    const load = async () => {
        setIsLoading(true);
        try {
            const [builtIn, custom] = await Promise.all([
                routingApi.listBuiltInTags(workspaceId),
                routingApi.listTags(workspaceId),
            ]);
            setBuiltInTags(builtIn.tags);
            setTags(custom.tags);
        } catch {
            toast.error("Failed to load routing tags");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workspaceId]);

    const handleCreate = async () => {
        if (!tagKey.trim()) return;

        setIsSaving(true);
        try {
            await routingApi.createTag(workspaceId, {
                tagKey: tagKey.trim(),
                label: label.trim() || undefined,
            });
            setTagKey("");
            setLabel("");
            await load();
            toast.success("Tag created");
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to create tag",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await routingApi.deleteTag(workspaceId, id);
            await load();
            toast.success("Tag deleted");
        } catch {
            toast.error("Failed to delete tag");
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
            <div className="grid gap-2">
                <h3 className="text-sm font-medium">Built-in Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {builtInTags.map((tag) => (
                        <Badge key={tag.tagKey} variant="secondary">
                            {tag.label}
                        </Badge>
                    ))}
                </div>
            </div>

            <Separator />

            <div className="grid gap-3">
                <h3 className="text-sm font-medium">Custom Tags</h3>
                <div className="flex flex-wrap gap-3 items-end">
                    <div className="grid gap-1.5">
                        <Label>DICOM Tag Keyword</Label>
                        <Input
                            value={tagKey}
                            onChange={(e) => setTagKey(e.target.value)}
                            placeholder="e.g. InstitutionName"
                            className="w-56"
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label>Label</Label>
                        <Input
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="Optional"
                            className="w-48"
                        />
                    </div>
                    <Button
                        onClick={handleCreate}
                        disabled={isSaving || !tagKey.trim()}
                    >
                        {isSaving ? (
                            <Loader2Icon className="size-4 animate-spin" />
                        ) : (
                            <PlusIcon className="size-4" />
                        )}
                        Add
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tag Key</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead className="w-[50px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tags.map((tag) => (
                            <TableRow key={tag.id}>
                                <TableCell className="font-mono">
                                    {tag.tagKey}
                                </TableCell>
                                <TableCell>{tag.label || "-"}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(tag.id)}
                                    >
                                        <TrashIcon className="size-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {tags.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="text-center text-muted-foreground"
                                >
                                    No custom tags yet
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
