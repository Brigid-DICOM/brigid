export type RoutingDestinationType = "dimse" | "dicomweb";
export type RoutingAuthType = "none" | "basic" | "bearer";

export interface RoutingDestination {
    id: string;
    workspaceId: string;
    name: string;
    type: RoutingDestinationType;
    enabled: boolean;
    aeTitle?: string | null;
    host?: string | null;
    port?: number | null;
    baseUrl?: string | null;
    authType?: RoutingAuthType | null;
    authUsername?: string | null;
    description?: string | null;
    hasAuthSecret: boolean;
    createdAt: string;
}

export type RoutingConditionOperator =
    | "equals"
    | "notEquals"
    | "contains"
    | "in";

export interface RoutingCondition {
    tag: string;
    operator: RoutingConditionOperator;
    value: string | string[];
}

export interface RoutingRule {
    id: string;
    workspaceId: string;
    name: string;
    enabled: boolean;
    priority: number;
    destinationId: string;
    delaySeconds: number;
    conditions: RoutingCondition[];
    createdAt: string;
    updatedAt: string;
}

export interface RoutingTag {
    id: string;
    workspaceId: string;
    tagKey: string;
    label?: string | null;
    createdAt: string;
}

export interface BuiltInRoutingTag {
    tagKey: string;
    label: string;
}

export type RoutingJobStatus =
    | "queued"
    | "scheduled"
    | "sending"
    | "succeeded"
    | "failed"
    | "dead";

export interface RoutingJob {
    id: string;
    workspaceId: string;
    ruleId: string;
    destinationId: string;
    sopInstanceUid: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    status: RoutingJobStatus;
    scheduledAt: string;
    attempt: number;
    lastError?: string | null;
    warning?: string | null;
    pendingRebuild: boolean;
    createdAt: string;
    updatedAt: string;
    completedAt?: string | null;
    rule?: { id: string; name: string } | null;
    destination?: { id: string; name: string } | null;
}

export interface AllowedRemote {
    id: string;
    aeTitle: string;
    host: string;
    port: number;
    description?: string | null;
}
