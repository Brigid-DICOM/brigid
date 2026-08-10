import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import env from "@brigid/env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey(): Buffer {
    const secret = env.ROUTING_CREDENTIAL_SECRET ?? env.JWT_SECRET;
    return scryptSync(secret, "brigid-routing-credential", 32);
}

export function encryptRoutingSecret(plainText: string): string {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, getKey(), iv);
    const encrypted = Buffer.concat([
        cipher.update(plainText, "utf8"),
        cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return `${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decryptRoutingSecret(payload: string): string {
    const [ivB64, tagB64, dataB64] = payload.split(":");
    if (!ivB64 || !tagB64 || !dataB64) {
        throw new Error("Invalid encrypted routing secret format");
    }
    const decipher = createDecipheriv(
        ALGORITHM,
        getKey(),
        Buffer.from(ivB64, "base64"),
    );
    decipher.setAuthTag(Buffer.from(tagB64, "base64"));
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(dataB64, "base64")),
        decipher.final(),
    ]);
    return decrypted.toString("utf8");
}
