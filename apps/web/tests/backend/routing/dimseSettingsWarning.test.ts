import { describe, expect, it } from "vitest";
import {
    dimseSettingsWarningKey,
    hasDimseSettings,
    shouldWarnDimseDestinationRule,
} from "@/lib/routing/dimseSettingsWarning";

describe("dimseSettingsWarning", () => {
    describe("hasDimseSettings", () => {
        it("is false when config is missing", () => {
            expect(hasDimseSettings(null)).toBe(false);
            expect(hasDimseSettings(undefined)).toBe(false);
        });

        it("is true when config exists, including disabled service", () => {
            expect(hasDimseSettings({ enabled: false })).toBe(true);
            expect(hasDimseSettings({ enabled: true })).toBe(true);
        });
    });

    describe("shouldWarnDimseDestinationRule", () => {
        it("warns for dimse destination only when DIMSE settings are missing", () => {
            expect(shouldWarnDimseDestinationRule("dimse", false)).toBe(true);
        });

        it("does not warn when DIMSE settings exist but service is disabled", () => {
            expect(shouldWarnDimseDestinationRule("dimse", true)).toBe(false);
        });

        it("does not warn for dicomweb destination", () => {
            expect(shouldWarnDimseDestinationRule("dicomweb", false)).toBe(
                false,
            );
        });

        it("does not warn when dimse destination is disabled", () => {
            expect(shouldWarnDimseDestinationRule("dimse", false, false)).toBe(
                false,
            );
        });
    });

    describe("dimseSettingsWarningKey", () => {
        it("maps missing settings to warning key", () => {
            expect(dimseSettingsWarningKey(false)).toBe(
                "dimseSettingsNotConfigured",
            );
        });

        it("returns null when settings exist", () => {
            expect(dimseSettingsWarningKey(true)).toBeNull();
        });
    });
});
