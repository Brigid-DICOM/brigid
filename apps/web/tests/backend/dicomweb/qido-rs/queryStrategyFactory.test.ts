import { describe, expect, it } from "vitest";
import { DateQueryStrategy } from "@/server/services/qido-rs/dateQueryStrategy";
import { getQueryStrategy } from "@/server/services/qido-rs/queryStrategyFactory";
import { StringQueryStrategy } from "@/server/services/qido-rs/stringQueryStrategy";
import { TimeQueryStrategy } from "@/server/services/qido-rs/timeQueryStrategy";

describe("QueryStrategyFactory", () => {
    it("should return StringQueryStrategy", () => {
        const strategy = getQueryStrategy("string");
        expect(strategy).toBeInstanceOf(StringQueryStrategy);
    });
    it("should return DateQueryStrategy", () => {
        const strategy = getQueryStrategy("date");
        expect(strategy).toBeInstanceOf(DateQueryStrategy);
    });
    it("should return TimeQueryStrategy", () => {
        const strategy = getQueryStrategy("time");
        expect(strategy).toBeInstanceOf(TimeQueryStrategy);
    });
    it("should throw error for unknown type", () => {
        expect(() => getQueryStrategy("unknown")).toThrow("Unknown query strategy: unknown");
    });
    it("should return same instance (Singleton)", () => {
        const strategy1 = getQueryStrategy("string");
        const strategy2 = getQueryStrategy("string");
        expect(strategy1).toBe(strategy2);
    });
});