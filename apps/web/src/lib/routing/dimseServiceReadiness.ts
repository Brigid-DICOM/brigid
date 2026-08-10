export type DimseServiceReadiness =
    | "ready"
    | "not-configured"
    | "disabled";

export interface DimseConfigSummary {
    enabled: boolean;
}

export function getDimseServiceReadiness(
    config: DimseConfigSummary | null | undefined,
): DimseServiceReadiness {
    if (!config) {
        return "not-configured";
    }
    if (!config.enabled) {
        return "disabled";
    }
    return "ready";
}

export function shouldWarnDimseDestinationRule(
    destinationType: "dimse" | "dicomweb",
    readiness: DimseServiceReadiness,
    destinationEnabled = true,
): boolean {
    return (
        destinationType === "dimse" &&
        destinationEnabled &&
        readiness === "not-configured"
    );
}

export function dimseReadinessWarningKey(
    readiness: DimseServiceReadiness,
): "dimseSettingsNotConfigured" | null {
    if (readiness === "not-configured") {
        return "dimseSettingsNotConfigured";
    }
    return null;
}
