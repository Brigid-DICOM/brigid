import type { DataSource } from "typeorm";
import { beforeAll, describe, expect, it } from "vitest";
import { StringQueryStrategy } from "@/server/services/qido-rs/stringQueryStrategy";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("StringQueryStrategy", () => {
    let strategy: StringQueryStrategy;

    beforeAll(() => {
        strategy = new StringQueryStrategy();
    });

    describe("single value queries", () => {
        it("should build exact match query", () => {
            const result = strategy.buildQuery("study", "studyId", "12345");

            expect(result.sql).toBe("study.studyId = :value");
            expect(result.parameters).toEqual({ value: "12345" });
        });

        it("should handle special characters", () => {
            const result = strategy.buildQuery(
                "study",
                "patientName",
                "O'Brien",
            );

            expect(result.sql).toBe("study.patientName = :value");
            expect(result.parameters).toEqual({ value: "O'Brien" });
        });
    });

    describe("wildcard queries", () => {
        it("should convert * to %", () => {
            const result = strategy.buildQuery("study", "patientName", "John*");

            expect(result.sql).toMatch(
                /study\.patientName (LIKE|ILIKE) :value/,
            );
            expect(result.parameters).toEqual({ value: "John%" });
        });

        it("should convert ? to _", () => {
            const result = strategy.buildQuery(
                "study",
                "patientName",
                "John? Doe",
            );

            expect(result.sql).toMatch(
                /study\.patientName (LIKE|ILIKE) :value/,
            );
            expect(result.parameters).toEqual({ value: "John_ Doe" });
        });

        it("should handle mixed wildcard", () => {
            const result = strategy.buildQuery(
                "study",
                "patientName",
                "John* Doe?",
            );

            expect(result.sql).toMatch(
                /study\.patientName (LIKE|ILIKE) :value/,
            );
            expect(result.parameters).toEqual({ value: "John% Doe_" });
        });
    });

    describe("multi value queries", () => {
        it("should build IN query", () => {
            const result = strategy.buildQuery(
                "study",
                "patientName",
                "John,Doe",
            );

            expect(result.sql).toBe("study.patientName IN (:...values)");
            expect(result.parameters).toEqual({ values: ["John", "Doe"] });
        });

        it("should handle escaped commas", () => {
            const result = strategy.buildQuery(
                "study",
                "patientName",
                "John\\,Doe",
            );
            expect(result.sql).toBe("study.patientName IN (:...values)");
            expect(result.parameters).toEqual({ values: ["John,Doe"] });
        });

        it("should handle multi-value wildcard queries", () => {
            const result = strategy.buildQuery(
                "study",
                "patientName",
                "John*,Doe?",
            );
            expect(result.sql).toMatch(
                /study\.patientName (LIKE|ILIKE) :value/,
            );
            expect(result.parameters).toEqual({
                value0: "John%",
                value1: "Doe_",
            });
        });

        it("should handle mixed exact and wildcard queries", () => {
            const result = strategy.buildQuery(
                "study",
                "patientName",
                "John,Doe*",
            );
            expect(result.sql).toMatch(
                /study\.patientName (LIKE|ILIKE) :value/,
            );
            expect(result.parameters).toEqual({
                value0: "John",
                value1: "Doe%",
            });
        });
    });

    describe("edge cases", () => {
        it("should handle multiple commas", () => {
            const result = strategy.buildQuery(
                "study",
                "patientName",
                "John,,Smith",
            );

            expect(result.sql).toBe("study.patientName IN (:...values)");
            expect(result.parameters).toEqual({
                values: ["John", "", "Smith"],
            });
        });

        it("should handle single comma", () => {
            const result = strategy.buildQuery("study", "studyId", "001,");

            expect(result.sql).toBe("study.studyId IN (:...values)");
        });

        it("should handle wildcard-only query", () => {
            const result = strategy.buildQuery("study", "patientName", "*");
            expect(result.parameters).toEqual({ value: "%" });
        });
    });
});
