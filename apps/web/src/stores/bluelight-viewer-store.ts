import { create } from "zustand";

interface BlueLightViewerState {
    studyInstanceUid: string| null;
    seriesInstanceUid: string | null;
    isOpen: boolean;

    open: (studyInstanceUid: string, seriesInstanceUid?: string) => void;
    close: () => void;
}

export const useBlueLightViewerStore = create<BlueLightViewerState>((set) => ({
    studyInstanceUid: null,
    seriesInstanceUid: null,
    isOpen: false,

    open: (studyInstanceUid: string, seriesInstanceUid?: string) => {
        set({
            studyInstanceUid,
            seriesInstanceUid: seriesInstanceUid || null,
            isOpen: true,
        });

        updateUrlParams(studyInstanceUid, seriesInstanceUid);
    },
    close: () => {
        set({
        studyInstanceUid: null,
            seriesInstanceUid: null,
            isOpen: false,
        });

        removeUrlParams();
    },
}));

function updateUrlParams(studyInstanceUid: string, seriesInstanceUid?: string) {
    const params = new URLSearchParams(window.location.search);

    params.set("openStudyInstanceUid", studyInstanceUid);
    if (seriesInstanceUid) {
        params.set("openSeriesInstanceUid", seriesInstanceUid);
    } else {
        params.delete("openSeriesInstanceUid");
    }

    window.history.replaceState(null, '', `?${params.toString()}`);
}

function removeUrlParams() {
    const params = new URLSearchParams(window.location.search);
    params.delete("openStudyInstanceUid");
    params.delete("openSeriesInstanceUid");

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    window.history.replaceState(null, '', newUrl || window.location.pathname);
}