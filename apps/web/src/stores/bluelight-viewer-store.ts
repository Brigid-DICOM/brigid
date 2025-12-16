import { create } from "zustand";

interface OpenOptions {
    shareToken?: string;
    password?: string;
    studyInstanceUid: string;
    seriesInstanceUid?: string;
    sopInstanceUid?: string;
}

interface BlueLightViewerState {
    shareToken: string | null;
    password: string | null;
    studyInstanceUid: string | null;
    seriesInstanceUid: string | null;
    sopInstanceUid: string | null;
    isOpen: boolean;

    open: (options: OpenOptions) => void;
    close: () => void;
}

export const useBlueLightViewerStore = create<BlueLightViewerState>((set) => ({
    shareToken: null,
    password: null,
    studyInstanceUid: null,
    seriesInstanceUid: null,
    sopInstanceUid: null,
    isOpen: false,

    open: (options: OpenOptions) => {
        set({
            shareToken: options.shareToken || null,
            password: options.password || null,
            studyInstanceUid: options.studyInstanceUid,
            seriesInstanceUid: options.seriesInstanceUid || null,
            sopInstanceUid: options.sopInstanceUid || null,
            isOpen: true,
        });

        updateUrlParams(options);
    },
    close: () => {
        set({
            shareToken: null,
            password: null,
            studyInstanceUid: null,
            seriesInstanceUid: null,
            sopInstanceUid: null,
            isOpen: false,
        });

        removeUrlParams();
    },
}));

function updateUrlParams(options: OpenOptions) {
    const params = new URLSearchParams(window.location.search);

    if (options.shareToken) {
        params.set("shareToken", options.shareToken);
    } else {
        params.delete("shareToken");
    }

    if (options.password) {
        params.set("password", encodeURIComponent(options.password));
    } else {
        params.delete("password");
    }

    params.set("openStudyInstanceUid", options.studyInstanceUid);
    if (options.seriesInstanceUid) {
        params.set("openSeriesInstanceUid", options.seriesInstanceUid);
    } else {
        params.delete("openSeriesInstanceUid");
    }
    if (options.sopInstanceUid) {
        params.set("openSopInstanceUid", options.sopInstanceUid);
    } else {
        params.delete("openSopInstanceUid");
    }

    window.history.replaceState(null, "", `?${params.toString()}`);
}

function removeUrlParams() {
    const params = new URLSearchParams(window.location.search);
    params.delete("openStudyInstanceUid");
    params.delete("openSeriesInstanceUid");
    params.delete("openSopInstanceUid");
    params.delete("shareToken");

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    window.history.replaceState(null, "", newUrl || window.location.pathname);
}
