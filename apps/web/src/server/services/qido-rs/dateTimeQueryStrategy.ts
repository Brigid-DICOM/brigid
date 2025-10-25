import { type QueryDicomResult, QueryStrategy } from "./queryStrategy";

export class DateTimeQueryStrategy extends QueryStrategy {
    buildQuery(table: string, field: string, value: string): QueryDicomResult {
        const dashIndex = value.indexOf("-");

        if (dashIndex === 0) {
            // case: -<datetime1>
            const end = value.substring(1).trim();
            return {
                sql: `${table}.${field} <= :endDateTime`,
                parameters: { endDateTime: this.formatDateTime(end) }
            };
        }

        if (dashIndex === value.length - 1) {
            // case: <datetime1>-
            const start = value.substring(0, dashIndex).trim();
            return {
                sql: `${table}.${field} >= :startDateTime`,
                parameters: { startDateTime: this.formatDateTime(start) }
            };
        }

        if (dashIndex > 0) {
            // case: <datetime1>-<datetime2>
            const start = value.substring(0, dashIndex).trim();
            const end = value.substring(dashIndex + 1).trim();
            return {
                sql: `${table}.${field} >= :startDateTime AND ${table}.${field} <= :endDateTime`,
                parameters: {
                    startDateTime: this.formatDateTime(start),
                    endDateTime: this.formatDateTime(end)
                }
            };
        }

        // case: single datetime
        return {
            sql: `${table}.${field} = :dateTime`,
            parameters: { dateTime: this.formatDateTime(value) }
        };
    }

    /**
     * 將 DICOM DT (YYYYMMDD[HHMMSS[.FFFFFF]][±ZZZZ]) 轉為 timestamp (milliseconds)
     * e.g. 20240101120000+0800 → 1704079200000
     */
    private formatDateTime(dt: string): number {
        // 分離 offset
        const offsetMatch = dt.match(/([+-]\d{4})$/);
        const offset = offsetMatch ? offsetMatch[1] : "+0000";
        const main = offsetMatch ? dt.replace(offset, "") : dt;

        // 補齊長度到至少 YYYYMMDD
        if (main.length < 8) {
            throw new Error("Invalid DICOM DT: missing date portion");
        }

        const year = main.slice(0, 4);
        const month = main.slice(4, 6) || "01";
        const day = main.slice(6, 8) || "01";
        const hour = main.slice(8, 10) || "00";
        const minute = main.slice(10, 12) || "00";
        const second = main.slice(12, 14) || "00";

        let milliseconds = 0;
        const fractionMatch = main.match(/\.(\d{1,6})/);
        if (fractionMatch) {
            const fractionalDigits = fractionMatch[1];
            milliseconds = Math.floor(Number(`0.${fractionalDigits}`) * 1000);
        }

        const offsetFormatted = offset === "+0000" ? "Z" : offset.replace(/([+-])(\d{2})(\d{2})$/, "$1$2:$3");
        const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}.${String(milliseconds).padStart(3, "0")}${offsetFormatted}`;

        return new Date(isoString).valueOf();
    }
}
