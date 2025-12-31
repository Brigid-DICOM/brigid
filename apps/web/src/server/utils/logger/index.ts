import path from "node:path";
import { format, loggers, transports } from "winston";
import { getWritableRoot } from "..";
import { DbTransport } from "./dbTransport";

const { combine, label, json, timestamp, errors, colorize, printf } = format;

const customConsoleFormat = printf(
    ({ level, message, label, timestamp, stack, ...meta }) => {
        const args = (meta[Symbol.for("splat")] as any[]) || [];
        const argString = args
            .map((arg) => {
                if (typeof arg === "object") {
                    const argCopy = structuredClone(arg);
                    return Object.entries(argCopy)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", ");
                }
                return arg;
            })
            .join(", ");

        const text = `[${timestamp}] [${label}] [${level}] ${message} ${argString}`;
        return stack ? `${text}\n${stack}` : text;
    },
);

loggers.add("brigid", {
    level: "info",
    transports: [
        new transports.Console({
            format: combine(
                errors({ stack: true }),
                label({ label: "brigid-node" }),
                timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                customConsoleFormat,
                colorize({ all: true }),
            ),
        }),
        new transports.File({
            filename: path.join(getWritableRoot(), "logs", "brigid-node.log"),
            maxFiles: 3,
            maxsize: 15 * 1024 * 1024,
            tailable: true,
            format: combine(
                errors({ stack: true }),
                label({ label: "brigid-node" }),
                timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                json(),
            ),
        }),
    ],
});

loggers.add("event", {
    level: "info",
    transports: [
        new transports.Console({
            format: combine(
                errors({ stack: true }),
                label({ label: "brigid-node" }),
                timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                customConsoleFormat,
                colorize({ all: true }),
            ),
        }),
        new DbTransport(),
    ],
});

export const appLogger = loggers.get("brigid");

export const eventLogger = loggers.get("event");
