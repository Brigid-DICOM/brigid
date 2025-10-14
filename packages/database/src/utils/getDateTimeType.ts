export function getDateTimeType() {
    if (process.env.NODE_ENV === "test") {
        return "datetime";
    }

    return "timestamp";
}