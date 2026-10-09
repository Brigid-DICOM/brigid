import { describe, expect, it } from "vitest";
import type { RoutingCondition } from "@brigid/database/src/entities/routingRule.entity";
import {
    evaluateRoutingConditions,
    matchRoutingRules,
} from "@/server/routing/ruleEngine";
import type { DicomTag } from "@brigid/types";

const ctDicomJson: DicomTag = {
    "00080060": { vr: "CS", Value: ["CT"] },
    "00080016": { vr: "UI", Value: ["1.2.840.10008.5.1.4.1.1.2"] },
    "00081030": { vr: "LO", Value: ["Chest CT"] },
    "0008103E": { vr: "LO", Value: ["Axial"] },
    "00100020": { vr: "LO", Value: ["P001"] },
    "00080050": { vr: "SH", Value: ["ACC-100"] },
    "0020000D": { vr: "UI", Value: ["1.2.3.study"] },
    "0020000E": { vr: "UI", Value: ["1.2.3.series"] },
    "00080018": { vr: "UI", Value: ["1.2.3.instance"] },
};

describe("RoutingRuleEngine", () => {
    describe("evaluateRoutingConditions", () => {
        it("matches equals on Modality keyword", () => {
            const conditions: RoutingCondition[] = [
                { tag: "Modality", operator: "equals", value: "CT" },
            ];
            expect(evaluateRoutingConditions(ctDicomJson, conditions)).toBe(
                true,
            );
        });

        it("matches notEquals", () => {
            const conditions: RoutingCondition[] = [
                { tag: "Modality", operator: "notEquals", value: "MR" },
            ];
            expect(evaluateRoutingConditions(ctDicomJson, conditions)).toBe(
                true,
            );
        });

        it("matches contains on StudyDescription", () => {
            const conditions: RoutingCondition[] = [
                { tag: "StudyDescription", operator: "contains", value: "Chest" },
            ];
            expect(evaluateRoutingConditions(ctDicomJson, conditions)).toBe(
                true,
            );
        });

        it("matches in operator", () => {
            const conditions: RoutingCondition[] = [
                { tag: "Modality", operator: "in", value: ["MR", "CT", "US"] },
            ];
            expect(evaluateRoutingConditions(ctDicomJson, conditions)).toBe(
                true,
            );
        });

        it("requires all conditions (AND)", () => {
            const conditions: RoutingCondition[] = [
                { tag: "Modality", operator: "equals", value: "CT" },
                { tag: "PatientID", operator: "equals", value: "OTHER" },
            ];
            expect(evaluateRoutingConditions(ctDicomJson, conditions)).toBe(
                false,
            );
        });

        it("matches CallingAETitle from ingest metadata", () => {
            const conditions: RoutingCondition[] = [
                {
                    tag: "CallingAETitle",
                    operator: "equals",
                    value: "MODALITY1",
                },
            ];
            expect(
                evaluateRoutingConditions(ctDicomJson, conditions, {
                    callingAeTitle: "MODALITY1",
                }),
            ).toBe(true);
            expect(
                evaluateRoutingConditions(ctDicomJson, conditions, {
                    callingAeTitle: "OTHER",
                }),
            ).toBe(false);
        });

        it("resolves hex tag keys", () => {
            const conditions: RoutingCondition[] = [
                { tag: "00080060", operator: "equals", value: "CT" },
            ];
            expect(evaluateRoutingConditions(ctDicomJson, conditions)).toBe(
                true,
            );
        });
    });

    describe("matchRoutingRules", () => {
        it("returns all matching enabled rules ordered by priority ascending", () => {
            const matched = matchRoutingRules({
                dicomJson: ctDicomJson,
                rules: [
                    {
                        id: "high-priority-mr",
                        enabled: true,
                        priority: 0,
                        conditions: [
                            {
                                tag: "Modality",
                                operator: "equals",
                                value: "MR",
                            },
                        ],
                    },
                    {
                        id: "ct-late",
                        enabled: true,
                        priority: 20,
                        conditions: [
                            {
                                tag: "Modality",
                                operator: "equals",
                                value: "CT",
                            },
                        ],
                    },
                    {
                        id: "ct-early",
                        enabled: true,
                        priority: 10,
                        conditions: [
                            {
                                tag: "Modality",
                                operator: "equals",
                                value: "CT",
                            },
                        ],
                    },
                    {
                        id: "disabled-ct",
                        enabled: false,
                        priority: 5,
                        conditions: [
                            {
                                tag: "Modality",
                                operator: "equals",
                                value: "CT",
                            },
                        ],
                    },
                ],
            });

            expect(matched.map((r) => r.id)).toEqual(["ct-early", "ct-late"]);
        });
    });
});
