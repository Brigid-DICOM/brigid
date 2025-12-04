"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getWorkspaceByIdQuery } from "@/react-query/queries/workspace";
import { useWorkspaceStore } from "@/stores/workspace-store";

interface WorkspaceStoreInitializerProps {
    workspaceId: string;
}

export function WorkspaceStoreInitializer({
    workspaceId,
}: WorkspaceStoreInitializerProps) {
    const { setWorkspace } = useWorkspaceStore();
    const { data } = useQuery(getWorkspaceByIdQuery(workspaceId));

    useEffect(() => {
        if (data) {
            setWorkspace({
                id: workspaceId,
                name: data?.workspace?.name ?? "",
                memberShip: data?.workspace?.membership ?? {
                    role: "",
                    permissions: 0,
                    isDefault: false,
                },
            });
        }
    }, [workspaceId, data, setWorkspace]);

    return null;
}
