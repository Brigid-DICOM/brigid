import type {
    RoutingCondition,
    RoutingConditionOperator,
} from "@brigid/database/src/entities/routingRule.entity";
import type { DicomTag } from "@brigid/types";
import { DICOM_TAG_KEYWORD_REGISTRY } from "@/server/const/dicomTagKeywordRegistry";

export const BUILT_IN_ROUTING_TAGS = [
    { tagKey: "Modality", label: "Modality" },
    { tagKey: "SOPClassUID", label: "SOP Class UID" },
    { tagKey: "StudyDescription", label: "Study Description" },
    { tagKey: "SeriesDescription", label: "Series Description" },
    { tagKey: "PatientID", label: "Patient ID" },
    { tagKey: "AccessionNumber", label: "Accession Number" },
    { tagKey: "CallingAETitle", label: "Calling AE Title" },
] as const;

export type RoutingRuleForMatch = {
    id: string;
    enabled: boolean;
    priority: number;
    conditions: RoutingCondition[];
};

export type RoutingEvaluateContext = {
    callingAeTitle?: string | null;
};

function resolveTagHex(tagKey: string): string | null {
    if (/^[0-9A-Fa-f]{8}$/.test(tagKey)) {
        return tagKey.toUpperCase();
    }

    const entry =
        DICOM_TAG_KEYWORD_REGISTRY[
            tagKey as keyof typeof DICOM_TAG_KEYWORD_REGISTRY
        ];
    return entry?.tag ?? null;
}

function getTagValue(
    dicomJson: DicomTag,
    tagKey: string,
    context?: RoutingEvaluateContext,
): string | undefined {
    if (tagKey === "CallingAETitle") {
        return context?.callingAeTitle ?? undefined;
    }

    const hex = resolveTagHex(tagKey);
    if (!hex) {
        return undefined;
    }

    const element = dicomJson[hex] ?? dicomJson[hex.toLowerCase()];
    const value = element?.Value?.[0];
    if (value === undefined || value === null) {
        return undefined;
    }
    return String(value);
}

function compare(
    operator: RoutingConditionOperator,
    actual: string | undefined,
    expected: string | string[],
): boolean {
    if (actual === undefined) {
        return operator === "notEquals";
    }

    switch (operator) {
        case "equals":
            return actual === expected;
        case "notEquals":
            return actual !== expected;
        case "contains":
            return typeof expected === "string" && actual.includes(expected);
        case "in": {
            const list = Array.isArray(expected)
                ? expected
                : String(expected)
                      .split(",")
                      .map((v) => v.trim());
            return list.includes(actual);
        }
        default:
            return false;
    }
}

export function evaluateRoutingConditions(
    dicomJson: DicomTag,
    conditions: RoutingCondition[],
    context?: RoutingEvaluateContext,
): boolean {
    if (conditions.length === 0) {
        return false;
    }

    return conditions.every((condition) => {
        const actual = getTagValue(dicomJson, condition.tag, context);
        return compare(condition.operator, actual, condition.value);
    });
}

export function matchRoutingRules(options: {
    dicomJson: DicomTag;
    rules: RoutingRuleForMatch[];
    context?: RoutingEvaluateContext;
}): RoutingRuleForMatch[] {
    return options.rules
        .filter((rule) => rule.enabled)
        .slice()
        .sort((a, b) => a.priority - b.priority)
        .filter((rule) =>
            evaluateRoutingConditions(
                options.dicomJson,
                rule.conditions,
                options.context,
            ),
        );
}
