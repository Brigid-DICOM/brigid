import testData from "../../fixtures/dicomFiles/data.json";

export interface ExpectedSeriesEntry {
    seriesInstanceUid: string;
    studyInstanceUid: string;
    patientId: string;
    modality: string;
    seriesNumber?: string;
    seriesDate?: string;
    seriesDescription?: string;
}

interface DataJsonSeries {
    seriesInstanceUid: string;
    modality: string;
    seriesDate?: string;
    seriesDescription?: string;
    seriesNumber?: string;
    instances: { file: string }[];
}

interface DataJsonStudy {
    patientId: string;
    series: DataJsonSeries[];
}

export interface ExpectedSeriesCatalog {
    bySeriesInstanceUid: Map<string, ExpectedSeriesEntry>;
    byStudyInstanceUid: Map<string, ExpectedSeriesEntry[]>;
    byPatientId: Map<string, string>;
    entries: ExpectedSeriesEntry[];
}

function optionalSeriesField(value: string | undefined): string | undefined {
    if (value === undefined || value.length === 0) {
        return undefined;
    }

    return value;
}

export function buildExpectedSeriesCatalog(): ExpectedSeriesCatalog {
    const bySeriesInstanceUid = new Map<string, ExpectedSeriesEntry>();
    const byStudyInstanceUid = new Map<string, ExpectedSeriesEntry[]>();
    const byPatientId = new Map<string, string>();
    const entries: ExpectedSeriesEntry[] = [];

    for (const [studyInstanceUid, study] of Object.entries(
        testData as Record<string, DataJsonStudy>,
    )) {
        byPatientId.set(study.patientId, studyInstanceUid);

        for (const series of study.series) {
            const entry: ExpectedSeriesEntry = {
                seriesInstanceUid: series.seriesInstanceUid,
                studyInstanceUid,
                patientId: study.patientId,
                modality: series.modality,
                seriesNumber: optionalSeriesField(series.seriesNumber),
                seriesDate: optionalSeriesField(series.seriesDate),
                seriesDescription: optionalSeriesField(
                    series.seriesDescription,
                ),
            };

            entries.push(entry);
            bySeriesInstanceUid.set(series.seriesInstanceUid, entry);

            const studySeries = byStudyInstanceUid.get(studyInstanceUid) ?? [];
            studySeries.push(entry);
            byStudyInstanceUid.set(studyInstanceUid, studySeries);
        }
    }

    return { bySeriesInstanceUid, byStudyInstanceUid, byPatientId, entries };
}

export function getSeriesUidsInStudy(
    catalog: ExpectedSeriesCatalog,
    studyInstanceUid: string,
    filter?: (entry: ExpectedSeriesEntry) => boolean,
): string[] {
    const series = catalog.byStudyInstanceUid.get(studyInstanceUid) ?? [];
    const filtered = filter ? series.filter(filter) : series;

    return filtered
        .map((entry) => entry.seriesInstanceUid)
        .sort((left, right) => left.localeCompare(right));
}

export function getSeriesUidsByNumbers(
    catalog: ExpectedSeriesCatalog,
    studyInstanceUid: string,
    seriesNumbers: string[],
): string[] {
    return getSeriesUidsInStudy(
        catalog,
        studyInstanceUid,
        (entry) =>
            entry.seriesNumber !== undefined &&
            seriesNumbers.includes(entry.seriesNumber),
    );
}
