/**
 * Soft-warning helpers for Routing Rules that target DIMSE destinations.
 * Warn only when workspace DIMSE 設定 is missing — not when DIMSE 服務 is disabled.
 */

export function hasDimseSettings(
    config: object | null | undefined,
): boolean {
    return config != null;
}

export function shouldWarnDimseDestinationRule(
    destinationType: "dimse" | "dicomweb",
    hasSettings: boolean,
    destinationEnabled = true,
): boolean {
    return (
        destinationType === "dimse" &&
        destinationEnabled &&
        !hasSettings
    );
}

export function dimseSettingsWarningKey(
    hasSettings: boolean,
): "dimseSettingsNotConfigured" | null {
    return hasSettings ? null : "dimseSettingsNotConfigured";
}
