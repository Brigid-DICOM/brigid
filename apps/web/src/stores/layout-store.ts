import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type LayoutMode = "grid" | "list";

interface LayoutState {
    layoutMode: LayoutMode;

    setLayoutMode: (layoutMode: LayoutMode) => void;
    toggleLayoutMode: () => void;
}

export const useLayoutStore = create<LayoutState>()(
    devtools(
        persist(
            (set, get) => ({
                layoutMode: "grid",

                setLayoutMode: (layoutMode: LayoutMode) => {
                    set({ layoutMode });
                },
                
                toggleLayoutMode: () => {
                    const { layoutMode } = get();
                    set({ layoutMode: layoutMode === "grid" ? "list" : "grid" });
                },
            }),
            {
                name: "dicom-layout-store",
            }
        ),
        {
            name: "dicom-layout-store",
        }
    )
)