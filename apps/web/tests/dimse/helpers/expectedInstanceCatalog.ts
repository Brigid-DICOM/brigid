import path from "node:path";
import { join } from "desm";
import testData from "../../fixtures/dicomFiles/data.json";
import { readDicomTags, resolveSeedFilePath } from "./readDicomTags";

const FIXTURES_ROOT = path.resolve(
    join(import.meta.url, "../../fixtures/dicomFiles"),
);

const INSTANCE_TAGS = ["0008,0023", "0008,0033"] as const;

export interface ExpectedInstanceEntry {
    sopInstanceUid: string;
    sopClassUid: string;
    seriesInstanceUid: string;
    studyInstanceUid: string;
    patientId: string;
    instanceNumber?: string;
    contentDate?: string;
    contentTime?: string;
}

interface DataJsonInstance {
    instanceNumber?: string;
    sopClassUid: string;
    sopInstanceUid: string;
    file: string;
}

interface DataJsonSeries {
    seriesInstanceUid: string;
    instances: DataJsonInstance[];
}

interface DataJsonStudy {
    patientId: string;
    series: DataJsonSeries[];
}

export interface ExpectedInstanceCatalog {
    bySopInstanceUid: Map<string, ExpectedInstanceEntry>;
    bySeriesInstanceUid: Map<string, ExpectedInstanceEntry[]>;
    byPatientId: Map<string, string>;
    entries: ExpectedInstanceEntry[];
}

function optionalInstanceField(value: string | undefined): string | undefined {
    if (value === undefined || value.length === 0) {
        return undefined;
    }

    return value;
}

export function buildExpectedInstanceCatalog(): ExpectedInstanceCatalog {
    const bySopInstanceUid = new Map<string, ExpectedInstanceEntry>();
    const bySeriesInstanceUid = new Map<string, ExpectedInstanceEntry[]>();
    const byPatientId = new Map<string, string>();
    const entries: ExpectedInstanceEntry[] = [];

    for (const [studyInstanceUid, study] of Object.entries(
        testData as Record<string, DataJsonStudy>,
    )) {
        byPatientId.set(study.patientId, studyInstanceUid);

        for (const series of study.series) {
            for (const instance of series.instances) {
                const filePath = resolveSeedFilePath(
                    FIXTURES_ROOT,
                    instance.file,
                );
                const tags = readDicomTags(filePath, INSTANCE_TAGS);

                const entry: ExpectedInstanceEntry = {
                    sopInstanceUid: instance.sopInstanceUid,
                    sopClassUid: instance.sopClassUid,
                    seriesInstanceUid: series.seriesInstanceUid,
                    studyInstanceUid,
                    patientId: study.patientId,
                    instanceNumber: optionalInstanceField(
                        instance.instanceNumber,
                    ),
                    contentDate: optionalInstanceField(tags["0008,0023"]),
                    contentTime: optionalInstanceField(tags["0008,0033"]),
                };

                entries.push(entry);
                bySopInstanceUid.set(instance.sopInstanceUid, entry);

                const seriesInstances =
                    bySeriesInstanceUid.get(series.seriesInstanceUid) ?? [];
                seriesInstances.push(entry);
                bySeriesInstanceUid.set(
                    series.seriesInstanceUid,
                    seriesInstances,
                );
            }
        }
    }

    return { bySopInstanceUid, bySeriesInstanceUid, byPatientId, entries };
}

export function getInstanceUidsInSeries(
    catalog: ExpectedInstanceCatalog,
    seriesInstanceUid: string,
    filter?: (entry: ExpectedInstanceEntry) => boolean,
): string[] {
    const instances = catalog.bySeriesInstanceUid.get(seriesInstanceUid) ?? [];
    const filtered = filter ? instances.filter(filter) : instances;

    return filtered
        .map((entry) => entry.sopInstanceUid)
        .sort((left, right) => left.localeCompare(right));
}

export function getInstanceUidsByNumbers(
    catalog: ExpectedInstanceCatalog,
    seriesInstanceUid: string,
    instanceNumbers: string[],
): string[] {
    return getInstanceUidsInSeries(
        catalog,
        seriesInstanceUid,
        (entry) =>
            entry.instanceNumber !== undefined &&
            instanceNumbers.includes(entry.instanceNumber),
    );
}

export function getInstanceUidByNumber(
    catalog: ExpectedInstanceCatalog,
    seriesInstanceUid: string,
    instanceNumber: string,
): string | undefined {
    return getInstanceUidsByNumbers(catalog, seriesInstanceUid, [
        instanceNumber,
    ])[0];
}
