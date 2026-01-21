import { hc } from "hono/client";
import type { HonoAppRoute } from "@/app/api/[...route]/route";

export const getBaseUrl = () => {
    if (typeof window !== "undefined" && (window as any).ENV?.NEXT_PUBLIC_APP_URL) {
        return (window as any).ENV.NEXT_PUBLIC_APP_URL;
    }

    return process.env.NEXT_PUBLIC_APP_URL || "";
};

const client = hc<HonoAppRoute>(`${getBaseUrl()}/`, {
    init: {
        credentials: "include",
    },
});

export { client as apiClient };
