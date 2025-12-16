import { type QueryDicomResult, QueryStrategy } from "./queryStrategy";

export class TimeQueryStrategy extends QueryStrategy {
    buildQuery(table: string, field: string, value: string): QueryDicomResult {
        const dashIndex = value.indexOf("-");

        if (dashIndex === 0) {
            // -HHMMSS.FFFFFF
            return {
                sql: `${table}.${field} <= :endTime`,
                parameters: { endTime: this.formatTime(value.substring(1)) },
            };
        }

        if (dashIndex === value.length - 1) {
            // HHMMSS.FFFFFF-
            return {
                sql: `${table}.${field} >= :startTime`,
                parameters: {
                    startTime: this.formatTime(value.substring(0, dashIndex)),
                },
            };
        }

        if (dashIndex > 0) {
            // HHMMSS.FFFFFF-HHMMSS.FFFFFF
            return {
                sql: `${table}.${field} >= :startTime AND ${table}.${field} <= :endTime`,
                parameters: {
                    startTime: this.formatTime(value.substring(0, dashIndex)),
                    endTime: this.formatTime(value.substring(dashIndex + 1)),
                },
            };
        }

        // HHMMSS.FFFFFF
        return {
            sql: `${table}.${field} = :time`,
            parameters: { time: this.formatTime(value) },
        };
    }

    private formatTime(time: string): string {
        if (time.includes(".")) {
            const [timePart, millionthSecondsPart] = time.split(".");
            return `${this.padTime(timePart)}.${millionthSecondsPart}`;
        }
        return this.padTime(time);
    }

    private padTime(time: string): string {
        // 如果是 HH:MM 格式 (長度5)，前補0；否則後補0 pad start for HH:MM format, otherwise pad end
        return time.length === 5 ? time.padStart(6, "0") : time.padEnd(6, "0");
    }
}
