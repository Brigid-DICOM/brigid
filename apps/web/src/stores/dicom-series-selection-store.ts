import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DicomSeriesSelectionState {
    selectedSeriesIds: Set<string>;

    lastSelectedId: string | null;

    toggleSeriesSelection: (
        seriesInstanceUid: string,
        ctrlKey?: boolean,
    ) => void;
    selectSeries: (seriesInstanceUid: string) => void;
    deselectSeries: (seriesInstanceUid: string) => void;
    clearSelection: () => void;
    selectAll: (seriesInstanceUids: string[]) => void;
    isSeriesSelected: (seriesInstanceUid: string) => boolean;
    getSelectedCount: () => number;
    getSelectedSeriesIds: () => string[];
}

export const useDicomSeriesSelectionStore = create<DicomSeriesSelectionState>()(
    devtools(
        (set, get) => ({
            selectedSeriesIds: new Set(),
            lastSelectedId: null,

            toggleSeriesSelection: (
                seriesInstanceUid: string,
                ctrlKey?: boolean,
            ) => {
                const { selectedSeriesIds } = get();
                const newSelectedIds = new Set(selectedSeriesIds);

                if (!ctrlKey && selectedSeriesIds.size > 0) {
                    // 如果沒按 Ctrl 鍵，則清空其他選取
                    newSelectedIds.clear();
                }

                if (
                    selectedSeriesIds.has(seriesInstanceUid) &&
                    newSelectedIds.size > 0
                ) {
                    newSelectedIds.delete(seriesInstanceUid);
                } else {
                    newSelectedIds.add(seriesInstanceUid);
                }

                set({
                    selectedSeriesIds: newSelectedIds,
                    lastSelectedId: newSelectedIds.has(seriesInstanceUid)
                        ? seriesInstanceUid
                        : null,
                });
            },

            selectSeries: (seriesInstanceUid: string) => {
                const { selectedSeriesIds } = get();
                const newSelectedIds = new Set(selectedSeriesIds);

                newSelectedIds.add(seriesInstanceUid);

                set({
                    selectedSeriesIds: newSelectedIds,
                    lastSelectedId: seriesInstanceUid,
                });
            },

            deselectSeries: (seriesInstanceUid: string) => {
                const { selectedSeriesIds } = get();
                const newSelectedIds = new Set(selectedSeriesIds);
                newSelectedIds.delete(seriesInstanceUid);

                set({
                    selectedSeriesIds: newSelectedIds,
                    lastSelectedId:
                        newSelectedIds.size > 0 ? seriesInstanceUid : null,
                });
            },

            clearSelection: () => {
                set({
                    selectedSeriesIds: new Set(),
                    lastSelectedId: null,
                });
            },

            selectAll: (seriesInstanceUids: string[]) => {
                set({
                    selectedSeriesIds: new Set(seriesInstanceUids),
                    lastSelectedId:
                        seriesInstanceUids[seriesInstanceUids.length - 1] ||
                        null,
                });
            },

            isSeriesSelected: (seriesInstanceUid: string) => {
                return get().selectedSeriesIds.has(seriesInstanceUid);
            },

            getSelectedCount: () => {
                return get().selectedSeriesIds.size;
            },

            getSelectedSeriesIds: () => {
                return Array.from(get().selectedSeriesIds);
            },
        }),
        {
            name: "dicom-series-selection-store",
        },
    ),
);
