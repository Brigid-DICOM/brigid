"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Workspace {
    id: string;
    name: string;
    ownerId?: string;
    memberShip: {
        role: string;
        permissions: number;
        isDefault: boolean;
    }
}

interface WorkspaceState {
    workspace: Workspace | null;
    setWorkspace: (workspace: Workspace) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
    devtools(
        (set, get) => ({
            workspace: null,

            setWorkspace: (workspace: Workspace) => set({ workspace }),
        })
    )
)
