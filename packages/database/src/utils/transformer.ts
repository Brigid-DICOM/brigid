import { parse } from "date-fns";
import type { ValueTransformer } from "typeorm";

export const transformer: Record<"date" | "bigint" | "textJson" | "DT", ValueTransformer> = {
    date: {
        from: (date: string | null) => date && new Date(parseInt(date, 10)),
        to: (date: Date) => date?.valueOf().toString()
    },
    bigint: {
        from: (value: string | null) => value && parseInt(value, 10),
        to: (value: number) => value.toString()
    },
    textJson: {
        from: (value: string | null) => value && JSON.parse(value),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        to: (value: any) => JSON.stringify(value)
    },
    DT: {
        from: (value: string | null) => value && new Date(parseInt(value, 10)),
        to: (value: string | Date | null) => {
            if (!value) return null;
            if (value instanceof Date) value = value.toISOString();
            
            value = value.trim();
            if (value === '""') return null;

            const match = value.match(
                /^(\d{4})(\d{2})?(\d{2})?(\d{2})?(\d{2})?(\d{2})?(?:\.(\d{1,6}))?(?:([+\-])(\d{2})(\d{2}))?$/
              );
            
            if (!match) return null;

            const [
                ,
                year,
                month = "01",
                day = "01",
                hour = "00",
                minute = "00",
                second = "00",
                fraction,
                tzSign,
                tzHour,
                tzMin,
            ] = match;

             // 處理 fractional 秒數（補成毫秒）
            const milliseconds = fraction
                ? Math.floor(Number("0." + fraction) * 1000)
                : 0;
            
             // timezone offset
            let timezone = "Z";
            if (tzSign && tzHour && tzMin) {
                timezone = `${tzSign}${tzHour}:${tzMin}`;
            }

            // 組成 ISO-like 字串
            const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}.${String(
                milliseconds
            ).padStart(3, "0")}${timezone}`;

            const date = parse(isoString, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", new Date());

            return date.valueOf();
        },
    }
}