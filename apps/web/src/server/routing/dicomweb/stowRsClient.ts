import type { RoutingAuthType } from "@brigid/database/src/entities/routingDestination.entity";
import multipartMessage from "@/server/utils/multipartMessage";
import { decryptRoutingSecret } from "../credentialCrypto";

export type StowRsClientResult =
    | { outcome: "succeeded"; warning?: string }
    | { outcome: "failed"; error: string };

export type StowRsClientOptions = {
    baseUrl: string;
    authType: RoutingAuthType;
    authUsername?: string | null;
    authSecretEncrypted?: string | null;
    dicomBytes: ArrayBuffer;
    fetchImpl?: typeof fetch;
};

function buildAuthHeader(options: {
    authType: RoutingAuthType;
    authUsername?: string | null;
    authSecretEncrypted?: string | null;
}): Record<string, string> {
    if (options.authType === "none" || !options.authType) {
        return {};
    }

    if (!options.authSecretEncrypted) {
        throw new Error("Routing destination auth secret is missing");
    }

    const secret = decryptRoutingSecret(options.authSecretEncrypted);

    if (options.authType === "bearer") {
        return { Authorization: `Bearer ${secret}` };
    }

    const username = options.authUsername ?? "";
    const token = Buffer.from(`${username}:${secret}`, "utf8").toString(
        "base64",
    );
    return { Authorization: `Basic ${token}` };
}

export function buildStowRsUrl(baseUrl: string): string {
    return `${baseUrl.replace(/\/+$/, "")}/studies`;
}

export async function sendStowRs(
    options: StowRsClientOptions,
): Promise<StowRsClientResult> {
    const fetchImpl = options.fetchImpl ?? fetch;
    const { data, boundary } = multipartMessage.multipartEncode([
        options.dicomBytes,
    ]);
    const headers: Record<string, string> = {
        "Content-Type": `multipart/related; type="application/dicom"; boundary=${boundary}`,
        Accept: "application/dicom+json",
        ...buildAuthHeader(options),
    };

    let response: Response;
    try {
        response = await fetchImpl(buildStowRsUrl(options.baseUrl), {
            method: "POST",
            headers,
            body: Buffer.from(data),
        });
    } catch (error) {
        return {
            outcome: "failed",
            error: error instanceof Error ? error.message : String(error),
        };
    }

    if (response.status === 200 || response.status === 202) {
        return { outcome: "succeeded" };
    }

    if (response.status === 409) {
        return {
            outcome: "succeeded",
            warning: "Remote instance already exists (HTTP 409)",
        };
    }

    if (response.status === 401 || response.status === 403) {
        return {
            outcome: "failed",
            error: `Authentication/authorization failed (HTTP ${response.status})`,
        };
    }

    return {
        outcome: "failed",
        error: `STOW-RS failed with HTTP ${response.status}`,
    };
}
