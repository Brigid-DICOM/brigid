"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DicomStudySelectionState {
    selectedStudyIds: Set<string>;

    lastSelectedId: string | null;

    toggleStudySelection: (studyInstanceUid: string, ctrlKey?: boolean) => void;
    selectStudy: (studyInstanceUid: string) => void;
    deselectStudy: (studyInstanceUid: string) => void;
    clearSelection: () => void;
    selectAll: (studyInstanceUids: string[]) => void;
    isStudySelected: (studyInstanceUid: string) => boolean;
    getSelectedCount: () => number;
    getSelectedStudyIds: () => string[];
}

export const useDicomStudySelectionStore = create<DicomStudySelectionState>()(
    devtools(
        (set, get) => ({
            selectedStudyIds: new Set(),
            lastSelectedId: null,

            toggleStudySelection: (
                studyInstanceUid: string,
                ctrlKey?: boolean,
            ) => {
                const { selectedStudyIds } = get();
                const newSelectedIds = new Set(selectedStudyIds);

                if (!ctrlKey && selectedStudyIds.size > 0) {
                    // 如果沒按 Ctrl 鍵，則清空其他選取
                    newSelectedIds.clear();
                }

                if (
                    selectedStudyIds.has(studyInstanceUid) &&
                    newSelectedIds.size > 0
                ) {
                    newSelectedIds.delete(studyInstanceUid);
                } else {
                    newSelectedIds.add(studyInstanceUid);
                }

                set({
                    selectedStudyIds: newSelectedIds,
                    lastSelectedId: newSelectedIds.has(studyInstanceUid)
                        ? studyInstanceUid
                        : null,
                });
            },

            selectStudy: (studyInstanceUid: string) => {
                const { selectedStudyIds } = get();
                const newSelectedIds = new Set(selectedStudyIds);

                newSelectedIds.add(studyInstanceUid);

                set({
                    selectedStudyIds: newSelectedIds,
                    lastSelectedId: studyInstanceUid,
                });
            },

            deselectStudy: (studyInstanceUid: string) => {
                const { selectedStudyIds } = get();
                const newSelectedIds = new Set(selectedStudyIds);
                newSelectedIds.delete(studyInstanceUid);

                set({
                    selectedStudyIds: newSelectedIds,
                    lastSelectedId:
                        newSelectedIds.size > 0 ? studyInstanceUid : null,
                });
            },

            clearSelection: () => {
                set({
                    selectedStudyIds: new Set(),
                    lastSelectedId: null,
                });
            },

            selectAll: (studyInstanceUids: string[]) => {
                set({
                    selectedStudyIds: new Set(studyInstanceUids),
                    lastSelectedId:
                        studyInstanceUids[studyInstanceUids.length - 1] || null,
                });
            },

            isStudySelected: (studyInstanceUid: string) => {
                return get().selectedStudyIds.has(studyInstanceUid);
            },

            getSelectedCount: () => {
                return get().selectedStudyIds.size;
            },

            getSelectedStudyIds: () => {
                return Array.from(get().selectedStudyIds);
            },
        }),
        {
            name: "dicom-study-selection-store",
        },
    ),
);
