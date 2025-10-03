import type { ValueTransformer } from "typeorm";

export const transformer: Record<"date" | "bigint" | "textJson", ValueTransformer> = {
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
    }
}