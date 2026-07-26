import path from "node:path";
import { runProcessSync } from "./dimseScuRunner";

const TAG_VALUE_PATTERN =
    /^\s*\((\d{4},\d{4})\)\s+\S+\s+(?:\[(?<value>[^\]]*)\]|(?<empty>\(no value available\)))/;

export function readDicomTags(
    filePath: string,
    tags: readonly string[],
): Record<string, string | undefined> {
    const tagArgs = tags.flatMap((tag) => ["+P", tag]);
    const result = runProcessSync("dcmdump", [...tagArgs, filePath]);
    const output = `${result.stdout}\n${result.stderr}`;

    const values: Record<string, string | undefined> = {};
    for (const tag of tags) {
        values[tag] = undefined;
    }

    for (const line of output.split(/\r?\n/)) {
        const match = line.match(TAG_VALUE_PATTERN);
        if (!match?.groups) {
            continue;
        }

        const tag = match[1];
        if (match.groups.empty !== undefined) {
            if (values[tag] === undefined) {
                values[tag] = undefined;
            }
            continue;
        }

        const value = match.groups.value?.trim();
        if (value && value.length > 0 && values[tag] === undefined) {
            values[tag] = value;
        }
    }

    return values;
}

export function resolveSeedFilePath(fixturesRoot: string, relativeFile: string): string {
    return path.join(fixturesRoot, relativeFile.replace(/\\/g, path.sep));
}
