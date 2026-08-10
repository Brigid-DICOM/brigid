import { describe, expect, it } from "vitest";
import {
    dimseReadinessWarningKey,
    getDimseServiceReadiness,
    shouldWarnDimseDestinationRule,
} from "@/lib/routing/dimseServiceReadiness";

describe("dimseServiceReadiness", () => {
    describe("getDimseServiceReadiness", () => {
        it("returns not-configured when config is missing", () => {
            expect(getDimseServiceReadiness(null)).toBe("not-configured");
            expect(getDimseServiceReadiness(undefined)).toBe("not-configured");
        });

        it("returns disabled when config exists but is not enabled", () => {
            expect(getDimseServiceReadiness({ enabled: false })).toBe(
                "disabled",
            );
        });

        it("returns ready when config is enabled", () => {
            expect(getDimseServiceReadiness({ enabled: true })).toBe("ready");
        });
    });

    describe("shouldWarnDimseDestinationRule", () => {
        it("warns for dimse destination when service is not ready", () => {
            expect(
                shouldWarnDimseDestinationRule("dimse", "not-configured"),
            ).toBe(true);
            expect(shouldWarnDimseDestinationRule("dimse", "disabled")).toBe(
                true,
            );
        });

        it("does not warn for dicomweb destination", () => {
            expect(
                shouldWarnDimseDestinationRule("dicomweb", "not-configured"),
            ).toBe(false);
        });

        it("does not warn when dimse service is ready", () => {
            expect(shouldWarnDimseDestinationRule("dimse", "ready")).toBe(
                false,
            );
        });

        it("does not warn when dimse destination is disabled", () => {
            expect(
                shouldWarnDimseDestinationRule("dimse", "not-configured", false),
            ).toBe(false);
        });
    });

    describe("dimseReadinessWarningKey", () => {
        it("maps readiness to warning keys", () => {
            expect(dimseReadinessWarningKey("not-configured")).toBe(
                "dimseServiceNotConfigured",
            );
            expect(dimseReadinessWarningKey("disabled")).toBe(
                "dimseServiceDisabled",
            );
            expect(dimseReadinessWarningKey("ready")).toBeNull();
        });
    });
});
