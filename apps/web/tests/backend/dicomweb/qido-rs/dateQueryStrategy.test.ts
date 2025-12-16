import type { DataSource } from "typeorm";
import { beforeAll, describe, expect, it } from "vitest";
import { DateQueryStrategy } from "@/server/services/qido-rs/dateQueryStrategy";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("DateQueryStrategy", () => {
    let strategy: DateQueryStrategy;

    beforeAll(() => {
        strategy = new DateQueryStrategy();
    });

    describe("exact date", () => {
        it("should build equals query", () => {
            const result = strategy.buildQuery(
                "study",
                "studyDate",
                "20250101",
            );

            expect(result.sql).toBe("study.studyDate = :date");
            expect(result.parameters).toEqual({ date: "20250101" });
        });
    });

    describe("date ranges", () => {
        it("should handle start date (YYYYMMDD-)", () => {
            const result = strategy.buildQuery(
                "study",
                "studyDate",
                "20250101-",
            );

            expect(result.sql).toBe("study.studyDate >= :startDate");
            expect(result.parameters).toEqual({ startDate: "20250101" });
        });

        it("should handle end date (-YYYYMMDD)", () => {
            const result = strategy.buildQuery(
                "study",
                "studyDate",
                "-20250101",
            );
            expect(result.sql).toBe("study.studyDate <= :endDate");
            expect(result.parameters).toEqual({ endDate: "20250101" });
        });

        it("should handle full range (YYYYMMDD-YYYYMMDD)", () => {
            const result = strategy.buildQuery(
                "study",
                "studyDate",
                "20250101-20250102",
            );
            expect(result.sql).toBe(
                "study.studyDate >= :startDate AND study.studyDate <= :endDate",
            );
            expect(result.parameters).toEqual({
                startDate: "20250101",
                endDate: "20250102",
            });
        });
    });

    describe("edge cases", () => {
        it("should handle January 1st", () => {
            const result = strategy.buildQuery(
                "study",
                "studyDate",
                "20250101",
            );
            expect(result.sql).toBe("study.studyDate = :date");
            expect(result.parameters).toEqual({ date: "20250101" });
        });

        it("should handle December 31st", () => {
            const result = strategy.buildQuery(
                "study",
                "studyDate",
                "20251231",
            );
            expect(result.sql).toBe("study.studyDate = :date");
            expect(result.parameters).toEqual({ date: "20251231" });
        });

        it("should handle leap year", () => {
            const result = strategy.buildQuery(
                "study",
                "studyDate",
                "20240229",
            );

            expect(result.sql).toBe("study.studyDate = :date");
        });

        it("should handle year-crossing range", () => {
            const result = strategy.buildQuery(
                "study",
                "studyDate",
                "20241231-20250101",
            );
            expect(result.sql).toBe(
                "study.studyDate >= :startDate AND study.studyDate <= :endDate",
            );
            expect(result.parameters).toEqual({
                startDate: "20241231",
                endDate: "20250101",
            });
        });
    });
});
