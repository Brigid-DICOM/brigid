import { beforeAll, describe, expect, it } from "vitest";
import { TimeQueryStrategy } from "@/server/services/qido-rs/timeQueryStrategy";

describe("TimeQueryStrategy", () => {
    let strategy: TimeQueryStrategy;

    beforeAll(() => {
        strategy = new TimeQueryStrategy();
    });

    describe("time formatting", () => {
        it("should pad HHMMSS", () => {
            const result = strategy.buildQuery("study", "studyTime", "123");

            expect(result.sql).toBe("study.studyTime = :time");
            expect(result.parameters).toEqual({ time: "123000" });
        });

        it("should handle preserve milliseconds", () => {
            const result = strategy.buildQuery(
                "study",
                "studyTime",
                "143015.123456",
            );

            expect(result.parameters).toEqual({ time: "143015.123456" });
        });

        it("should handle hours only", () => {
            const result = strategy.buildQuery("study", "studyTime", "14");

            expect(result.parameters).toEqual({ time: "140000" });
        });
    });

    describe("time ranges", () => {
        it("should handle start time (HHMMSS.FFFFFF-)", () => {
            const result = strategy.buildQuery("study", "studyTime", "000000-");

            expect(result.sql).toBe("study.studyTime >= :startTime");
            expect(result.parameters).toEqual({ startTime: "000000" });
        });
        it("should handle end time (-HHMMSS.FFFFFF)", () => {
            const result = strategy.buildQuery("study", "studyTime", "-170000");

            expect(result.sql).toBe("study.studyTime <= :endTime");
            expect(result.parameters).toEqual({ endTime: "170000" });
        });

        it("should handle time range (HHMMSS-HHMMSS)", () => {
            const result = strategy.buildQuery(
                "study",
                "studyTime",
                "000000-170000",
            );

            expect(result.sql).toBe(
                "study.studyTime >= :startTime AND study.studyTime <= :endTime",
            );
            expect(result.parameters).toEqual({
                startTime: "000000",
                endTime: "170000",
            });
        });

        it("should handle time range with milliseconds (HHMMSS.FFFFFF-HHMMSS.FFFFFF)", () => {
            const result = strategy.buildQuery(
                "study",
                "studyTime",
                "000000.000000-170000.999999",
            );
            expect(result.sql).toBe(
                "study.studyTime >= :startTime AND study.studyTime <= :endTime",
            );
            expect(result.parameters).toEqual({
                startTime: "000000.000000",
                endTime: "170000.999999",
            });
        });
    });

    describe("edge cases", () => {
        it("should handle midnight", () => {
            const result = strategy.buildQuery("study", "studyTime", "000000");
            expect(result.sql).toBe("study.studyTime = :time");
            expect(result.parameters).toEqual({ time: "000000" });
        });

        it("should handle just before midnight", () => {
            const result = strategy.buildQuery("study", "studyTime", "235959");
            expect(result.sql).toBe("study.studyTime = :time");
            expect(result.parameters).toEqual({ time: "235959" });
        });

        it("should handle midnight-crossing range", () => {
            const result = strategy.buildQuery(
                "study",
                "studyTime",
                "230000-000001",
            );
            expect(result.sql).toBe(
                "study.studyTime >= :startTime AND study.studyTime <= :endTime",
            );
            expect(result.parameters).toEqual({
                startTime: "230000",
                endTime: "000001",
            });
        });
    });
});
