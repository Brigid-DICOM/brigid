import crypto from "node:crypto";

export function createHash(data: string, outputLength: number = 16) {
    return crypto.createHash("shake256", { outputLength }).update(data).digest("hex");
}