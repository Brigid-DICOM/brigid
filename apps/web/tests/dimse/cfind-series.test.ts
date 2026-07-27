import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { CFindSeriesMatchingKey } from "./helpers/findscuRunner";
import { runFindscuSeries } from "./helpers/findscuRunner";
import {
    buildExpectedSeriesCatalog,
    getSeriesUidsByNumbers,
    getSeriesUidsInStudy,
    type ExpectedSeriesCatalog,
    type ExpectedSeriesEntry,
} from "./helpers/expectedSeriesCatalog";
import type { FindscuSeriesResponse } from "./helpers/parseFindscuSeriesResponses";
import { parseFindscuSeriesResponses } from "./helpers/parseFindscuSeriesResponses";
import {
    clearAndSeedDicomDataForCfindSeriesSuite,
    releaseDicomDataPreservation,
} from "./helpers/dimseTestContext";

interface CFindSeriesCase {
    label: string;
    studyInstanceUid: string;
    matchingKey: CFindSeriesMatchingKey;
    queryValue: string;
    expectedSeriesInstanceUids: string[];
}

const MATCHING_KEY_FIELDS = {
    Modality: "modality",
    SeriesInstanceUID: "seriesInstanceUid",
    SeriesNumber: "seriesNumber",
    SeriesDate: "seriesDate",
    SeriesDescription: "seriesDescription",
} as const satisfies Record<
    CFindSeriesMatchingKey,
    keyof ExpectedSeriesEntry
>;

function buildCases(catalog: ExpectedSeriesCatalog): CFindSeriesCase[] {
    const tcgaStudyUid = catalog.byPatientId.get("TCGA-G4-6304") ?? "";
    const philipsStudyUid = catalog.byPatientId.get("123456") ?? "";
    const c3nStudyUid = catalog.byPatientId.get("C3N-00953") ?? "";

    const philipsSeriesUid =
        getSeriesUidsByNumbers(catalog, philipsStudyUid, ["1"])[0] ?? "";
    const c3nSeries4Uid =
        getSeriesUidsByNumbers(catalog, c3nStudyUid, ["4"])[0] ?? "";

    return [
        {
            label: "Modality exact: CT (TCGA)",
            studyInstanceUid: tcgaStudyUid,
            matchingKey: "Modality",
            queryValue: "CT",
            expectedSeriesInstanceUids: getSeriesUidsInStudy(
                catalog,
                tcgaStudyUid,
                (entry) => entry.modality === "CT",
            ),
        },
        {
            label: "Modality wildcard: C* (TCGA)",
            studyInstanceUid: tcgaStudyUid,
            matchingKey: "Modality",
            queryValue: "C*",
            expectedSeriesInstanceUids: getSeriesUidsInStudy(
                catalog,
                tcgaStudyUid,
                (entry) => entry.modality.startsWith("C"),
            ),
        },
        {
            label: "Modality multi-value: CT\\OT (TCGA)",
            studyInstanceUid: tcgaStudyUid,
            matchingKey: "Modality",
            queryValue: "CT\\OT",
            expectedSeriesInstanceUids: getSeriesUidsInStudy(
                catalog,
                tcgaStudyUid,
                (entry) => entry.modality === "CT" || entry.modality === "OT",
            ),
        },
        {
            label: "Modality wildcard: no match (TCGA)",
            studyInstanceUid: tcgaStudyUid,
            matchingKey: "Modality",
            queryValue: "XR*",
            expectedSeriesInstanceUids: [],
        },
        {
            label: "Modality exact: SM (Philips)",
            studyInstanceUid: philipsStudyUid,
            matchingKey: "Modality",
            queryValue: "SM",
            expectedSeriesInstanceUids: getSeriesUidsInStudy(
                catalog,
                philipsStudyUid,
                (entry) => entry.modality === "SM",
            ),
        },
        {
            label: "Modality exact: CT (C3N)",
            studyInstanceUid: c3nStudyUid,
            matchingKey: "Modality",
            queryValue: "CT",
            expectedSeriesInstanceUids: getSeriesUidsInStudy(
                catalog,
                c3nStudyUid,
                (entry) => entry.modality === "CT",
            ),
        },
        {
            label: "SeriesInstanceUID exact (Philips)",
            studyInstanceUid: philipsStudyUid,
            matchingKey: "SeriesInstanceUID",
            queryValue: philipsSeriesUid,
            expectedSeriesInstanceUids: [philipsSeriesUid],
        },
        {
            label: "SeriesInstanceUID exact (C3N #4)",
            studyInstanceUid: c3nStudyUid,
            matchingKey: "SeriesInstanceUID",
            queryValue: c3nSeries4Uid,
            expectedSeriesInstanceUids: [c3nSeries4Uid],
        },
        {
            label: "SeriesNumber exact: 1 (TCGA)",
            studyInstanceUid: tcgaStudyUid,
            matchingKey: "SeriesNumber",
            queryValue: "1",
            expectedSeriesInstanceUids: getSeriesUidsByNumbers(
                catalog,
                tcgaStudyUid,
                ["1"],
            ),
        },
        {
            label: "SeriesNumber exact: 3001 (TCGA)",
            studyInstanceUid: tcgaStudyUid,
            matchingKey: "SeriesNumber",
            queryValue: "3001",
            expectedSeriesInstanceUids: getSeriesUidsByNumbers(
                catalog,
                tcgaStudyUid,
                ["3001"],
            ),
        },
        {
            label: "SeriesNumber multi-value: 1\\2 (TCGA)",
            studyInstanceUid: tcgaStudyUid,
            matchingKey: "SeriesNumber",
            queryValue: "1\\2",
            expectedSeriesInstanceUids: getSeriesUidsByNumbers(
                catalog,
                tcgaStudyUid,
                ["1", "2"],
            ),
        },
        {
            label: "SeriesNumber exact: no match (TCGA)",
            studyInstanceUid: tcgaStudyUid,
            matchingKey: "SeriesNumber",
            queryValue: "9999",
            expectedSeriesInstanceUids: [],
        },
        {
            label: "SeriesNumber exact: 4 (C3N)",
            studyInstanceUid: c3nStudyUid,
            matchingKey: "SeriesNumber",
            queryValue: "4",
            expectedSeriesInstanceUids: getSeriesUidsByNumbers(
                catalog,
                c3nStudyUid,
                ["4"],
            ),
        },
        {
            label: "SeriesDate exact: 20100213 (C3N)",
            studyInstanceUid: c3nStudyUid,
            matchingKey: "SeriesDate",
            queryValue: "20100213",
            expectedSeriesInstanceUids: getSeriesUidsInStudy(
                catalog,
                c3nStudyUid,
                (entry) => entry.seriesDate === "20100213",
            ),
        },
        {
            label: "SeriesDate exact: 19990417 (TCGA)",
            studyInstanceUid: tcgaStudyUid,
            matchingKey: "SeriesDate",
            queryValue: "19990417",
            expectedSeriesInstanceUids: getSeriesUidsInStudy(
                catalog,
                tcgaStudyUid,
                (entry) => entry.seriesDate === "19990417",
            ),
        },
        {
            label: "SeriesDate range: 20000101- (C3N)",
            studyInstanceUid: c3nStudyUid,
            matchingKey: "SeriesDate",
            queryValue: "20000101-",
            expectedSeriesInstanceUids: getSeriesUidsInStudy(
                catalog,
                c3nStudyUid,
                (entry) => entry.seriesDate === "20100213",
            ),
        },
        {
            label: "SeriesDate range: -20100101 (C3N)",
            studyInstanceUid: c3nStudyUid,
            matchingKey: "SeriesDate",
            queryValue: "-20100101",
            expectedSeriesInstanceUids: [],
        },
        {
            label: "SeriesDate exact: no match (C3N)",
            studyInstanceUid: c3nStudyUid,
            matchingKey: "SeriesDate",
            queryValue: "19000101",
            expectedSeriesInstanceUids: [],
        },
        {
            label: "SeriesDescription exact: NON CONTRAST (TCGA)",
            studyInstanceUid: tcgaStudyUid,
            matchingKey: "SeriesDescription",
            queryValue: "NON CONTRAST",
            expectedSeriesInstanceUids: getSeriesUidsInStudy(
                catalog,
                tcgaStudyUid,
                (entry) => entry.seriesDescription === "NON CONTRAST",
            ),
        },
        {
            label: "SeriesDescription wildcard: *LOCALIZER* (TCGA)",
            studyInstanceUid: tcgaStudyUid,
            matchingKey: "SeriesDescription",
            queryValue: "*LOCALIZER*",
            expectedSeriesInstanceUids: getSeriesUidsInStudy(
                catalog,
                tcgaStudyUid,
                (entry) =>
                    entry.seriesDescription?.includes("LOCALIZER") ?? false,
            ),
        },
        {
            label: "SeriesDescription wildcard: *ABD* (C3N)",
            studyInstanceUid: c3nStudyUid,
            matchingKey: "SeriesDescription",
            queryValue: "*ABD*",
            expectedSeriesInstanceUids: getSeriesUidsInStudy(
                catalog,
                c3nStudyUid,
                (entry) => entry.seriesDescription?.includes("ABD") ?? false,
            ),
        },
        {
            label: "SeriesDescription wildcard: no match (C3N)",
            studyInstanceUid: c3nStudyUid,
            matchingKey: "SeriesDescription",
            queryValue: "NOMATCH*",
            expectedSeriesInstanceUids: [],
        },
    ];
}

function sortBySeriesInstanceUid(
    series: FindscuSeriesResponse[],
): FindscuSeriesResponse[] {
    return [...series].sort((left, right) =>
        (left.seriesInstanceUid ?? "").localeCompare(
            right.seriesInstanceUid ?? "",
        ),
    );
}

function getResponseField(
    response: FindscuSeriesResponse,
    matchingKey: CFindSeriesMatchingKey,
): string | undefined {
    const field = MATCHING_KEY_FIELDS[matchingKey];
    return response[field];
}

function expectSeriesMatch(
    actual: FindscuSeriesResponse[],
    expectedSeriesInstanceUids: string[],
    catalog: ExpectedSeriesCatalog,
    matchingKey: CFindSeriesMatchingKey,
): void {
    const sortedActual = sortBySeriesInstanceUid(actual);
    const expectedSeries = expectedSeriesInstanceUids
        .map((seriesInstanceUid) =>
            catalog.bySeriesInstanceUid.get(seriesInstanceUid),
        )
        .filter((entry): entry is ExpectedSeriesEntry => entry !== undefined)
        .sort((left, right) =>
            left.seriesInstanceUid.localeCompare(right.seriesInstanceUid),
        );

    expect(sortedActual).toHaveLength(expectedSeries.length);

    for (let index = 0; index < expectedSeries.length; index++) {
        const actualSeries = sortedActual[index];
        const expectedSeriesEntry = expectedSeries[index];

        expect(actualSeries.seriesInstanceUid).toBe(
            expectedSeriesEntry.seriesInstanceUid,
        );
        expect(actualSeries.patientId).toBe(expectedSeriesEntry.patientId);
        expect(actualSeries.studyInstanceUid).toBe(
            expectedSeriesEntry.studyInstanceUid,
        );

        const field = MATCHING_KEY_FIELDS[matchingKey];
        const expectedValue = expectedSeriesEntry[field];
        if (expectedValue !== undefined) {
            expect(getResponseField(actualSeries, matchingKey)).toBe(
                expectedValue,
            );
        }
    }
}

const catalog = buildExpectedSeriesCatalog();
const CASES = buildCases(catalog);

describe("C-FIND series level E2E", () => {
    beforeAll(async () => {
        await clearAndSeedDicomDataForCfindSeriesSuite();
    });

    afterAll(() => {
        releaseDicomDataPreservation();
    });

    it.each(CASES)(
        "$label",
        async ({
            studyInstanceUid,
            matchingKey,
            queryValue,
            expectedSeriesInstanceUids,
        }) => {
            const result = await runFindscuSeries(
                studyInstanceUid,
                matchingKey,
                queryValue,
            );
            const log = `${result.stdout}\n${result.stderr}`;

            expect(result.exitCode).toBe(0);

            const responses = parseFindscuSeriesResponses(log);
            expectSeriesMatch(
                responses,
                expectedSeriesInstanceUids,
                catalog,
                matchingKey,
            );
        },
    );
});
