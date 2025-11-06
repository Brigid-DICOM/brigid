import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DicomInstanceSelectionState {
    selectedInstanceIds: Set<string>;

    lastSelectedId: string | null;

    toggleInstanceSelection: (instanceUid: string, ctrlKey?: boolean) => void;
    selectInstance: (instanceUid: string) => void;
    deselectInstance: (instanceUid: string) => void;
    clearSelection: () => void;
    selectAll: (instanceUids: string[]) => void;
    isInstanceSelected: (instanceUid: string) => boolean;
    getSelectedCount: () => number;
    getSelectedInstanceIds: () => string[];
}

export const useDicomInstanceSelectionStore = create<DicomInstanceSelectionState>()(
    devtools(
        (set, get) => ({
            selectedInstanceIds: new Set(),
            lastSelectedId: null,

            toggleInstanceSelection: (
                instanceUid: string,
                ctrlKey?: boolean,
            ) => {
                const { selectedInstanceIds } = get();
                const newSelectedIds = new Set(selectedInstanceIds);
                
                if (!ctrlKey && selectedInstanceIds.size > 0) {
                    // 如果沒按 Ctrl 鍵，則清空其他選取
                    newSelectedIds.clear();
                }
                
                if (
                    selectedInstanceIds.has(instanceUid) &&
                    newSelectedIds.size > 0
                ) {
                    newSelectedIds.delete(instanceUid);
                } else {
                    newSelectedIds.add(instanceUid);
                }

                set({
                    selectedInstanceIds: newSelectedIds,
                    lastSelectedId: newSelectedIds.has(instanceUid)
                        ? instanceUid
                        : null,
                });
            },

            selectInstance: (instanceUid: string) => {
                const { selectedInstanceIds } = get();
                const newSelectedIds = new Set(selectedInstanceIds);

                newSelectedIds.add(instanceUid);

                set({
                    selectedInstanceIds: newSelectedIds,
                    lastSelectedId: instanceUid,
                });
            },

            deselectInstance: (instanceUid: string) => {
                const { selectedInstanceIds } = get();
                const newSelectedIds = new Set(selectedInstanceIds);

                newSelectedIds.delete(instanceUid);

                set({
                    selectedInstanceIds: newSelectedIds,
                    lastSelectedId:
                        newSelectedIds.size > 0 ? instanceUid : null,
                });
            },
            
            clearSelection: () => {
                set({
                    selectedInstanceIds: new Set(),
                    lastSelectedId: null,
                });
            },

            selectAll: (instanceUids: string[]) => {
                set({
                    selectedInstanceIds: new Set(instanceUids),
                    lastSelectedId:
                        instanceUids[instanceUids.length - 1] || null,
                });
            },

            isInstanceSelected: (instanceUid: string) => {
                return get().selectedInstanceIds.has(instanceUid);
            },

            getSelectedCount: () => {
                return get().selectedInstanceIds.size;
            },
            
            getSelectedInstanceIds: () => {
                return Array.from(get().selectedInstanceIds);
            },
        }),
        {
            name: "dicom-instance-selection-store",
        },
    ),
);