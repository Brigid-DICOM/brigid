import { describe, expect, it, vi } from "vitest";
import { encryptRoutingSecret } from "@/server/routing/credentialCrypto";
import {
    buildStowRsUrl,
    sendStowRs,
} from "@/server/routing/dicomweb/stowRsClient";

describe("STOW-RS outbound client", () => {
    it("builds studies URL from baseUrl", () => {
        expect(buildStowRsUrl("https://pacs.example.com/dicomweb/")).toBe(
            "https://pacs.example.com/dicomweb/studies",
        );
    });

    it("treats 200 and 202 as succeeded", async () => {
        for (const status of [200, 202]) {
            const fetchImpl = vi.fn(async () => new Response(null, { status }));
            const result = await sendStowRs({
                baseUrl: "https://pacs.example.com/dicomweb",
                authType: "none",
                dicomBytes: new ArrayBuffer(8),
                fetchImpl: fetchImpl as unknown as typeof fetch,
            });
            expect(result.outcome).toBe("succeeded");
        }
    });

    it("treats 409 as succeeded with warning", async () => {
        const fetchImpl = vi.fn(async () => new Response(null, { status: 409 }));
        const result = await sendStowRs({
            baseUrl: "https://pacs.example.com/dicomweb",
            authType: "none",
            dicomBytes: new ArrayBuffer(8),
            fetchImpl: fetchImpl as unknown as typeof fetch,
        });
        expect(result).toEqual({
            outcome: "succeeded",
            warning: "Remote instance already exists (HTTP 409)",
        });
    });

    it("fails on 401/403 and other errors", async () => {
        const fetch401 = vi.fn(async () => new Response(null, { status: 401 }));
        const result401 = await sendStowRs({
            baseUrl: "https://pacs.example.com/dicomweb",
            authType: "none",
            dicomBytes: new ArrayBuffer(8),
            fetchImpl: fetch401 as unknown as typeof fetch,
        });
        expect(result401.outcome).toBe("failed");

        const fetch500 = vi.fn(async () => new Response(null, { status: 500 }));
        const result500 = await sendStowRs({
            baseUrl: "https://pacs.example.com/dicomweb",
            authType: "none",
            dicomBytes: new ArrayBuffer(8),
            fetchImpl: fetch500 as unknown as typeof fetch,
        });
        expect(result500.outcome).toBe("failed");
    });

    it("sends bearer auth header from decrypted secret", async () => {
        const encrypted = encryptRoutingSecret("token-abc");
        const fetchImpl = vi.fn(async (_url, init) => {
            const headers = new Headers(init?.headers as HeadersInit);
            expect(headers.get("Authorization")).toBe("Bearer token-abc");
            return new Response(null, { status: 200 });
        });

        await sendStowRs({
            baseUrl: "https://pacs.example.com/dicomweb",
            authType: "bearer",
            authSecretEncrypted: encrypted,
            dicomBytes: new ArrayBuffer(8),
            fetchImpl: fetchImpl as unknown as typeof fetch,
        });
        expect(fetchImpl).toHaveBeenCalled();
    });
});
