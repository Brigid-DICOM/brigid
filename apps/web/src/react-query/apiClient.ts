import { hc } from "hono/client";
import type { HonoAppRoute } from "@/app/api/[...route]/route";

const client = hc<HonoAppRoute>(`${process.env.NEXT_PUBLIC_APP_URL}/`, {
    init: {
        credentials: "include",
    },
});

export { client as apiClient };
