import type {
    AllowedRemote,
    BuiltInRoutingTag,
    RoutingDestination,
    RoutingJob,
    RoutingRule,
    RoutingTag,
} from "./types";

async function handle<T>(res: Response): Promise<T> {
    const json = await res.json();
    if (!res.ok || json.ok === false) {
        const message =
            typeof json.error === "string"
                ? json.error
                : (json.error?.message ?? "Request failed");
        throw new Error(message);
    }
    return json.data as T;
}

const jsonHeaders = { "Content-Type": "application/json" };

export const routingApi = {
    listDestinations: (workspaceId: string) =>
        fetch(`/api/workspaces/${workspaceId}/routing/destinations`).then(
            (res) => handle<{ destinations: RoutingDestination[] }>(res),
        ),
    createDestination: (workspaceId: string, body: Record<string, unknown>) =>
        fetch(`/api/workspaces/${workspaceId}/routing/destinations`, {
            method: "POST",
            headers: jsonHeaders,
            body: JSON.stringify(body),
        }).then((res) => handle<RoutingDestination>(res)),
    updateDestination: (
        workspaceId: string,
        id: string,
        body: Record<string, unknown>,
    ) =>
        fetch(`/api/workspaces/${workspaceId}/routing/destinations/${id}`, {
            method: "PATCH",
            headers: jsonHeaders,
            body: JSON.stringify(body),
        }).then((res) => handle<RoutingDestination>(res)),
    deleteDestination: (workspaceId: string, id: string) =>
        fetch(`/api/workspaces/${workspaceId}/routing/destinations/${id}`, {
            method: "DELETE",
        }).then((res) => handle<null>(res)),
    importDestinationFromAllowedRemote: (
        workspaceId: string,
        allowedRemoteId: string,
    ) =>
        fetch(
            `/api/workspaces/${workspaceId}/routing/destinations/import-from-allowed-remote/${allowedRemoteId}`,
            { method: "POST" },
        ).then((res) => handle<RoutingDestination>(res)),

    listAllowedRemotes: (workspaceId: string) =>
        fetch(`/api/workspaces/${workspaceId}/dimse`)
            .then((res) => res.json())
            .then(
                (json) =>
                    (json?.data?.allowedRemotes ?? []) as AllowedRemote[],
            ),

    listRules: (workspaceId: string) =>
        fetch(`/api/workspaces/${workspaceId}/routing/rules`).then((res) =>
            handle<{ rules: RoutingRule[] }>(res),
        ),
    createRule: (workspaceId: string, body: Record<string, unknown>) =>
        fetch(`/api/workspaces/${workspaceId}/routing/rules`, {
            method: "POST",
            headers: jsonHeaders,
            body: JSON.stringify(body),
        }).then((res) => handle<RoutingRule>(res)),
    updateRule: (
        workspaceId: string,
        id: string,
        body: Record<string, unknown>,
    ) =>
        fetch(`/api/workspaces/${workspaceId}/routing/rules/${id}`, {
            method: "PATCH",
            headers: jsonHeaders,
            body: JSON.stringify(body),
        }).then((res) => handle<RoutingRule>(res)),
    deleteRule: (workspaceId: string, id: string) =>
        fetch(`/api/workspaces/${workspaceId}/routing/rules/${id}`, {
            method: "DELETE",
        }).then((res) => handle<null>(res)),

    listBuiltInTags: (workspaceId: string) =>
        fetch(`/api/workspaces/${workspaceId}/routing/tags/built-in`).then(
            (res) => handle<{ tags: BuiltInRoutingTag[] }>(res),
        ),
    listTags: (workspaceId: string) =>
        fetch(`/api/workspaces/${workspaceId}/routing/tags`).then((res) =>
            handle<{ tags: RoutingTag[] }>(res),
        ),
    createTag: (workspaceId: string, body: Record<string, unknown>) =>
        fetch(`/api/workspaces/${workspaceId}/routing/tags`, {
            method: "POST",
            headers: jsonHeaders,
            body: JSON.stringify(body),
        }).then((res) => handle<RoutingTag>(res)),
    deleteTag: (workspaceId: string, id: string) =>
        fetch(`/api/workspaces/${workspaceId}/routing/tags/${id}`, {
            method: "DELETE",
        }).then((res) => handle<null>(res)),

    listJobs: (
        workspaceId: string,
        query: {
            status?: string;
            limit?: number;
            offset?: number;
        },
    ) => {
        const params = new URLSearchParams();
        if (query.status) params.set("status", query.status);
        if (query.limit) params.set("limit", String(query.limit));
        if (query.offset) params.set("offset", String(query.offset));
        const qs = params.toString();
        return fetch(
            `/api/workspaces/${workspaceId}/routing/jobs${qs ? `?${qs}` : ""}`,
        ).then((res) =>
            handle<{
                items: RoutingJob[];
                total: number;
                limit: number;
                offset: number;
            }>(res),
        );
    },
    sendNowJob: (workspaceId: string, id: string) =>
        fetch(`/api/workspaces/${workspaceId}/routing/jobs/${id}/send-now`, {
            method: "POST",
        }).then((res) => handle<RoutingJob>(res)),
    retryJob: (workspaceId: string, id: string) =>
        fetch(`/api/workspaces/${workspaceId}/routing/jobs/${id}/retry`, {
            method: "POST",
        }).then((res) => handle<RoutingJob>(res)),
};
