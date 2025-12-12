/** biome-ignore-all lint/correctness/useHookAtTopLevel: 為確保 SSR 產出的 html 使用正確的 language，此 hook 必須要有 server side 的判斷，因此不能放在 top level */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: 同上 */
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "./i18next";

const runsOnServerSide = typeof window === "undefined";

export function useT(ns: string, options?: { keyPrefix?: string }) {
    const lng = useParams()?.lng;
    if (typeof lng !== "string")
        throw new Error("useT is only available inside /app/[lng]");
    if (runsOnServerSide && i18next.resolvedLanguage !== lng) {
        i18next.changeLanguage(lng);
    } else {
        const [activeLng, setActiveLng] = useState(i18next.resolvedLanguage);
        useEffect(() => {
            if (activeLng === i18next.resolvedLanguage) return;
            setActiveLng(i18next.resolvedLanguage);
        }, [activeLng, i18next.resolvedLanguage]);
        useEffect(() => {
            if (!lng || i18next.resolvedLanguage === lng) return;
            i18next.changeLanguage(lng);
        }, [lng, i18next]);
    }
    return useTranslation(ns, options);
}
