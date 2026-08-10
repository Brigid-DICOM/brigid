"use client";

import { AlertTriangleIcon, Loader2Icon, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
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
import {
    dimseReadinessWarningKey,
    getDimseServiceReadiness,
    shouldWarnDimseDestinationRule,
    type DimseConfigSummary,
} from "@/lib/routing/dimseServiceReadiness";
import type {
    RoutingCondition,
    RoutingConditionOperator,
    RoutingDestination,
    RoutingRule,
} from "../types";

const emptyCondition: RoutingCondition = {
    tag: "Modality",
    operator: "equals",
    value: "",
};

export function RulesTab({ workspaceId }: { workspaceId: string }) {
    const { t } = useT("translation");
    const [rules, setRules] = useState<RoutingRule[]>([]);
    const [destinations, setDestinations] = useState<RoutingDestination[]>([]);
    const [dimseConfig, setDimseConfig] = useState<DimseConfigSummary | null>(
        null,
    );
    const [dimseConfigLoadFailed, setDimseConfigLoadFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [name, setName] = useState("");
    const [destinationId, setDestinationId] = useState("");
    const [priority, setPriority] = useState("0");
    const [delaySeconds, setDelaySeconds] = useState("0");
    const [conditions, setConditions] = useState<RoutingCondition[]>([
        { ...emptyCondition },
    ]);

    const selectedDestination = destinations.find(
        (destination) => destination.id === destinationId,
    );
    const dimseReadiness = getDimseServiceReadiness(dimseConfig);
    const showDimseInlineWarning =
        !dimseConfigLoadFailed &&
        selectedDestination !== undefined &&
        shouldWarnDimseDestinationRule(
            selectedDestination.type,
            dimseReadiness,
            selectedDestination.enabled,
        );
    const dimseInlineWarningKey = dimseReadinessWarningKey(dimseReadiness);

    const notifyDimseRuleWarning = (
        destination: RoutingDestination | undefined,
        config: DimseConfigSummary | null,
        loadFailed: boolean,
    ) => {
        if (
            !destination ||
            !shouldWarnDimseDestinationRule(
                destination.type,
                getDimseServiceReadiness(config),
                destination.enabled,
            )
        ) {
            return;
        }

        if (loadFailed) {
            toast.error(t("routingSettings.rules.dimseServiceStatusUnknown"));
            return;
        }

        const warningKey = dimseReadinessWarningKey(
            getDimseServiceReadiness(config),
        );
        if (warningKey) {
            toast.warning(t(`routingSettings.rules.${warningKey}`));
        }
    };

    const load = async (): Promise<{
        dimseConfig: DimseConfigSummary | null;
        dimseLoadFailed: boolean;
    }> => {
        setIsLoading(true);
        setDimseConfigLoadFailed(false);
        let dimseLoadFailed = false;
        let dimseConfigResult: DimseConfigSummary | null = null;
        try {
            const [
                { rules: ruleList },
                { destinations: destList },
                fetchedDimseConfig,
            ] = await Promise.all([
                routingApi.listRules(workspaceId),
                routingApi.listDestinations(workspaceId),
                routingApi.getDimseConfig(workspaceId).catch(() => {
                    dimseLoadFailed = true;
                    return null;
                }),
            ]);
            dimseConfigResult = fetchedDimseConfig;
            setRules(ruleList);
            setDestinations(destList);
            setDimseConfig(dimseConfigResult);
            setDimseConfigLoadFailed(dimseLoadFailed);
            if (!destinationId && destList[0]) {
                setDestinationId(destList[0].id);
            }
        } catch {
            toast.error("Failed to load routing rules");
        } finally {
            setIsLoading(false);
        }
        return { dimseConfig: dimseConfigResult, dimseLoadFailed };
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workspaceId]);

    const updateCondition = (
        index: number,
        patch: Partial<RoutingCondition>,
    ) => {
        setConditions((prev) =>
            prev.map((condition, i) =>
                i === index ? { ...condition, ...patch } : condition,
            ),
        );
    };

    const handleCreate = async () => {
        if (!name.trim() || !destinationId) return;

        const destination = destinations.find(
            (item) => item.id === destinationId,
        );

        setIsSaving(true);
        try {
            await routingApi.createRule(workspaceId, {
                name,
                destinationId,
                priority: Number.parseInt(priority, 10) || 0,
                delaySeconds: Number.parseInt(delaySeconds, 10) || 0,
                conditions: conditions.filter((c) => c.tag && c.value),
            });
            setName("");
            setPriority("0");
            setDelaySeconds("0");
            setConditions([{ ...emptyCondition }]);
            const { dimseConfig: freshDimseConfig, dimseLoadFailed } =
                await load();
            toast.success("Rule created");
            notifyDimseRuleWarning(
                destination,
                freshDimseConfig,
                dimseLoadFailed,
            );
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to create rule",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await routingApi.deleteRule(workspaceId, id);
            await load();
            toast.success("Rule deleted");
        } catch {
            toast.error("Failed to delete rule");
        }
    };

    const handleToggleEnabled = async (rule: RoutingRule) => {
        const destination = destinations.find(
            (item) => item.id === rule.destinationId,
        );
        const enabling = !rule.enabled;

        try {
            await routingApi.updateRule(workspaceId, rule.id, {
                enabled: enabling,
            });
            const { dimseConfig: freshDimseConfig, dimseLoadFailed } =
                await load();
            if (enabling) {
                notifyDimseRuleWarning(
                    destination,
                    freshDimseConfig,
                    dimseLoadFailed,
                );
            }
        } catch {
            toast.error("Failed to update rule");
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
                <h3 className="text-sm font-medium">New Rule</h3>
                <div className="flex flex-wrap gap-3 items-end">
                    <div className="grid gap-1.5">
                        <Label>Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-48"
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label>Destination</Label>
                        <Select
                            value={destinationId}
                            onValueChange={setDestinationId}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select destination" />
                            </SelectTrigger>
                            <SelectContent>
                                {destinations.map((destination) => (
                                    <SelectItem
                                        key={destination.id}
                                        value={destination.id}
                                    >
                                        {destination.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-1.5">
                        <Label>Priority</Label>
                        <Input
                            type="number"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-20"
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label>Delay (s)</Label>
                        <Input
                            type="number"
                            value={delaySeconds}
                            onChange={(e) => setDelaySeconds(e.target.value)}
                            className="w-20"
                        />
                    </div>
                </div>

                {showDimseInlineWarning && dimseInlineWarningKey && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                        <div className="flex gap-2">
                            <AlertTriangleIcon
                                className="mt-0.5 size-4 shrink-0 text-amber-600"
                            />
                            <p className="text-sm text-amber-800">
                                {t(
                                    `routingSettings.rules.${dimseInlineWarningKey}`,
                                )}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid gap-2">
                    <Label>Conditions (AND)</Label>
                    {conditions.map((condition, index) => (
                        <div
                            key={`condition-${index}`}
                            className="flex gap-2 items-center"
                        >
                            <Input
                                value={condition.tag}
                                onChange={(e) =>
                                    updateCondition(index, {
                                        tag: e.target.value,
                                    })
                                }
                                placeholder="Tag keyword"
                                className="w-40"
                            />
                            <Select
                                value={condition.operator}
                                onValueChange={(value) =>
                                    updateCondition(index, {
                                        operator:
                                            value as RoutingConditionOperator,
                                    })
                                }
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="equals">
                                        equals
                                    </SelectItem>
                                    <SelectItem value="notEquals">
                                        not equals
                                    </SelectItem>
                                    <SelectItem value="contains">
                                        contains
                                    </SelectItem>
                                    <SelectItem value="in">in</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                value={
                                    Array.isArray(condition.value)
                                        ? condition.value.join(",")
                                        : condition.value
                                }
                                onChange={(e) =>
                                    updateCondition(index, {
                                        value:
                                            condition.operator === "in"
                                                ? e.target.value
                                                      .split(",")
                                                      .map((v) => v.trim())
                                                : e.target.value,
                                    })
                                }
                                placeholder="Value"
                                className="w-40"
                            />
                            {conditions.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        setConditions((prev) =>
                                            prev.filter((_, i) => i !== index),
                                        )
                                    }
                                >
                                    <TrashIcon className="size-4 text-destructive" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() =>
                            setConditions((prev) => [
                                ...prev,
                                { ...emptyCondition },
                            ])
                        }
                    >
                        <PlusIcon className="size-4" /> Add condition
                    </Button>
                </div>

                <Button
                    className="w-fit"
                    onClick={handleCreate}
                    disabled={isSaving || !name.trim() || !destinationId}
                >
                    {isSaving ? (
                        <Loader2Icon className="size-4 animate-spin" />
                    ) : (
                        <PlusIcon className="size-4" />
                    )}
                    Create Rule
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Delay</TableHead>
                        <TableHead>Conditions</TableHead>
                        <TableHead>Enabled</TableHead>
                        <TableHead className="w-[50px]" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rules.map((rule) => (
                        <TableRow key={rule.id}>
                            <TableCell className="font-medium">
                                {rule.name}
                            </TableCell>
                            <TableCell>{rule.priority}</TableCell>
                            <TableCell>
                                {destinations.find(
                                    (d) => d.id === rule.destinationId,
                                )?.name ?? rule.destinationId}
                            </TableCell>
                            <TableCell>{rule.delaySeconds}s</TableCell>
                            <TableCell className="text-xs">
                                {rule.conditions
                                    .map(
                                        (c) =>
                                            `${c.tag} ${c.operator} ${Array.isArray(c.value) ? c.value.join(",") : c.value}`,
                                    )
                                    .join(" AND ")}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        rule.enabled ? "default" : "outline"
                                    }
                                    className="cursor-pointer"
                                    onClick={() => handleToggleEnabled(rule)}
                                >
                                    {rule.enabled ? "Enabled" : "Disabled"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(rule.id)}
                                >
                                    <TrashIcon className="size-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {rules.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="text-center text-muted-foreground"
                            >
                                No rules yet
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
