import { DateQueryStrategy } from "./dateQueryStrategy";
import { NumberQueryStrategy } from "./numberQueryStrategy";
import type { QueryStrategy } from "./queryStrategy";
import { StringQueryStrategy } from "./stringQueryStrategy";
import { TimeQueryStrategy } from "./timeQueryStrategy";

const strategies = new Map<string, QueryStrategy>([
    ["string", new StringQueryStrategy()],
    ["date", new DateQueryStrategy()],
    ["time", new TimeQueryStrategy()],
    ["number", new NumberQueryStrategy()],
]);

export const getQueryStrategy = (type: string): QueryStrategy => {
    const strategy = strategies.get(type);
    if (!strategy) {
        throw new Error(`Unknown query strategy: ${type}`);
    }

    return strategy;
}