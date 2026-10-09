import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
    clearAndSeedDicomDataForCfindImageSuite,
    releaseDicomDataPreservation,
} from "./helpers/dimseTestContext";
import {
    buildExpectedInstanceCatalog,
    type ExpectedInstanceCatalog,
    type ExpectedInstanceEntry,
    getInstanceUidByNumber,
    getInstanceUidsByNumbers,
    getInstanceUidsInSeries,
} from "./helpers/expectedInstanceCatalog";
import {
    buildExpectedSeriesCatalog,
    getSeriesUidsByNumbers,
} from "./helpers/expectedSeriesCatalog";
import type { CFindImageMatchingKey } from "./helpers/findscuRunner";
import { runFindscuImage } from "./helpers/findscuRunner";
import type { FindscuImageResponse } from "./helpers/parseFindscuImageResponses";
import { parseFindscuImageResponses } from "./helpers/parseFindscuImageResponses";

interface CFindImageCase {
    label: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    matchingKey: CFindImageMatchingKey;
    queryValue: string;
    expectedSopInstanceUids: string[];
}

const MATCHING_KEY_FIELDS = {
    SOPClassUID: "sopClassUid",
    SOPInstanceUID: "sopInstanceUid",
    InstanceNumber: "instanceNumber",
    ContentDate: "contentDate",
    ContentTime: "contentTime",
} as const satisfies Record<CFindImageMatchingKey, keyof ExpectedInstanceEntry>;

function buildCases(catalog: ExpectedInstanceCatalog): CFindImageCase[] {
    const seriesCatalog = buildExpectedSeriesCatalog();
    const tcgaStudyUid = catalog.byPatientId.get("TCGA-G4-6304") ?? "";
    const philipsStudyUid = catalog.byPatientId.get("123456") ?? "";
    const c3nStudyUid = catalog.byPatientId.get("C3N-00953") ?? "";

    const tcgaLocalizerSeriesUid =
        getSeriesUidsByNumbers(seriesCatalog, tcgaStudyUid, ["1"])[0] ?? "";
    const tcgaOtSeriesUid =
        getSeriesUidsByNumbers(seriesCatalog, tcgaStudyUid, ["3001"])[0] ?? "";
    const tcgaCtSeriesUid =
        getSeriesUidsByNumbers(seriesCatalog, tcgaStudyUid, ["2"])[0] ?? "";
    const philipsSeriesUid =
        getSeriesUidsByNumbers(seriesCatalog, philipsStudyUid, ["1"])[0] ?? "";
    const c3nSeries4Uid =
        getSeriesUidsByNumbers(seriesCatalog, c3nStudyUid, ["4"])[0] ?? "";

    const philipsSopUid =
        getInstanceUidsByNumbers(catalog, philipsSeriesUid, ["1"])[0] ?? "";
    const c3n72SopUid =
        getInstanceUidByNumber(catalog, c3nSeries4Uid, "72") ?? "";

    return [
        {
            label: "SOPClassUID exact: CT (C3N #4)",
            studyInstanceUid: c3nStudyUid,
            seriesInstanceUid: c3nSeries4Uid,
            matchingKey: "SOPClassUID",
            queryValue: "1.2.840.10008.5.1.4.1.1.2",
            expectedSopInstanceUids: getInstanceUidsInSeries(
                catalog,
                c3nSeries4Uid,
                (entry) => entry.sopClassUid === "1.2.840.10008.5.1.4.1.1.2",
            ),
        },
        {
            label: "SOPClassUID wildcard: 1.2.840.10008.5.1.4.1.1.2* (C3N #4)",
            studyInstanceUid: c3nStudyUid,
            seriesInstanceUid: c3nSeries4Uid,
            matchingKey: "SOPClassUID",
            queryValue: "1.2.840.10008.5.1.4.1.1.2*",
            expectedSopInstanceUids: getInstanceUidsInSeries(
                catalog,
                c3nSeries4Uid,
                (entry) => entry.sopClassUid === "1.2.840.10008.5.1.4.1.1.2",
            ),
        },
        {
            label: "SOPClassUID multi-value: SC\\CT (TCGA OT)",
            studyInstanceUid: tcgaStudyUid,
            seriesInstanceUid: tcgaOtSeriesUid,
            matchingKey: "SOPClassUID",
            queryValue: "1.2.840.10008.5.1.4.1.1.7\\1.2.840.10008.5.1.4.1.1.2",
            expectedSopInstanceUids: getInstanceUidsInSeries(
                catalog,
                tcgaOtSeriesUid,
                (entry) =>
                    entry.sopClassUid === "1.2.840.10008.5.1.4.1.1.7" ||
                    entry.sopClassUid === "1.2.840.10008.5.1.4.1.1.2",
            ),
        },
        {
            label: "SOPClassUID exact: SM (Philips)",
            studyInstanceUid: philipsStudyUid,
            seriesInstanceUid: philipsSeriesUid,
            matchingKey: "SOPClassUID",
            queryValue: "1.2.840.10008.5.1.4.1.1.77.1.6",
            expectedSopInstanceUids: getInstanceUidsInSeries(
                catalog,
                philipsSeriesUid,
                (entry) =>
                    entry.sopClassUid === "1.2.840.10008.5.1.4.1.1.77.1.6",
            ),
        },
        {
            label: "SOPClassUID wildcard: no match (C3N #4)",
            studyInstanceUid: c3nStudyUid,
            seriesInstanceUid: c3nSeries4Uid,
            matchingKey: "SOPClassUID",
            queryValue: "9.9.9.*",
            expectedSopInstanceUids: [],
        },
        {
            label: "SOPInstanceUID exact (Philips)",
            studyInstanceUid: philipsStudyUid,
            seriesInstanceUid: philipsSeriesUid,
            matchingKey: "SOPInstanceUID",
            queryValue: philipsSopUid,
            expectedSopInstanceUids: [philipsSopUid],
        },
        {
            label: "SOPInstanceUID exact (C3N #72)",
            studyInstanceUid: c3nStudyUid,
            seriesInstanceUid: c3nSeries4Uid,
            matchingKey: "SOPInstanceUID",
            queryValue: c3n72SopUid,
            expectedSopInstanceUids: [c3n72SopUid],
        },
        {
            label: "InstanceNumber exact: 1 duplicate (TCGA LOCALIZER)",
            studyInstanceUid: tcgaStudyUid,
            seriesInstanceUid: tcgaLocalizerSeriesUid,
            matchingKey: "InstanceNumber",
            queryValue: "1",
            expectedSopInstanceUids: getInstanceUidsByNumbers(
                catalog,
                tcgaLocalizerSeriesUid,
                ["1"],
            ),
        },
        {
            label: "InstanceNumber exact: 6 (TCGA OT)",
            studyInstanceUid: tcgaStudyUid,
            seriesInstanceUid: tcgaOtSeriesUid,
            matchingKey: "InstanceNumber",
            queryValue: "6",
            expectedSopInstanceUids: getInstanceUidsByNumbers(
                catalog,
                tcgaOtSeriesUid,
                ["6"],
            ),
        },
        {
            label: "InstanceNumber multi-value: 1\\2 (TCGA OT)",
            studyInstanceUid: tcgaStudyUid,
            seriesInstanceUid: tcgaOtSeriesUid,
            matchingKey: "InstanceNumber",
            queryValue: "1\\2",
            expectedSopInstanceUids: getInstanceUidsByNumbers(
                catalog,
                tcgaOtSeriesUid,
                ["1", "2"],
            ),
        },
        {
            label: "InstanceNumber exact: 72 (C3N #4)",
            studyInstanceUid: c3nStudyUid,
            seriesInstanceUid: c3nSeries4Uid,
            matchingKey: "InstanceNumber",
            queryValue: "72",
            expectedSopInstanceUids: getInstanceUidsByNumbers(
                catalog,
                c3nSeries4Uid,
                ["72"],
            ),
        },
        {
            label: "InstanceNumber multi-value: 18\\27 (C3N #4)",
            studyInstanceUid: c3nStudyUid,
            seriesInstanceUid: c3nSeries4Uid,
            matchingKey: "InstanceNumber",
            queryValue: "18\\27",
            expectedSopInstanceUids: getInstanceUidsByNumbers(
                catalog,
                c3nSeries4Uid,
                ["18", "27"],
            ),
        },
        {
            label: "InstanceNumber exact: no match (C3N #4)",
            studyInstanceUid: c3nStudyUid,
            seriesInstanceUid: c3nSeries4Uid,
            matchingKey: "InstanceNumber",
            queryValue: "9999",
            expectedSopInstanceUids: [],
        },
        {
            label: "ContentDate exact: 20100213 (C3N #4)",
            studyInstanceUid: c3nStudyUid,
            seriesInstanceUid: c3nSeries4Uid,
            matchingKey: "ContentDate",
            queryValue: "20100213",
            expectedSopInstanceUids: getInstanceUidsInSeries(
                catalog,
                c3nSeries4Uid,
                (entry) => entry.contentDate === "20100213",
            ),
        },
        {
            label: "ContentDate exact: 19990416 (TCGA CT #2)",
            studyInstanceUid: tcgaStudyUid,
            seriesInstanceUid: tcgaCtSeriesUid,
            matchingKey: "ContentDate",
            queryValue: "19990416",
            expectedSopInstanceUids: getInstanceUidsInSeries(
                catalog,
                tcgaCtSeriesUid,
                (entry) => entry.contentDate === "19990416",
            ),
        },
        {
            label: "ContentDate range: 20000101- (C3N #4)",
            studyInstanceUid: c3nStudyUid,
            seriesInstanceUid: c3nSeries4Uid,
            matchingKey: "ContentDate",
            queryValue: "20000101-",
            expectedSopInstanceUids: getInstanceUidsInSeries(
                catalog,
                c3nSeries4Uid,
                (entry) => entry.contentDate === "20100213",
            ),
        },
        {
            label: "ContentDate range: -20000101 (TCGA CT #2)",
            studyInstanceUid: tcgaStudyUid,
            seriesInstanceUid: tcgaCtSeriesUid,
            matchingKey: "ContentDate",
            queryValue: "-20000101",
            expectedSopInstanceUids: getInstanceUidsInSeries(
                catalog,
                tcgaCtSeriesUid,
                (entry) => entry.contentDate === "19990416",
            ),
        },
        {
            label: "ContentDate range: 19990101-20000101 (TCGA CT #2)",
            studyInstanceUid: tcgaStudyUid,
            seriesInstanceUid: tcgaCtSeriesUid,
            matchingKey: "ContentDate",
            queryValue: "19990101-20000101",
            expectedSopInstanceUids: getInstanceUidsInSeries(
                catalog,
                tcgaCtSeriesUid,
                (entry) => entry.contentDate === "19990416",
            ),
        },
        {
            label: "ContentDate exact: no match (C3N #4)",
            studyInstanceUid: c3nStudyUid,
            seriesInstanceUid: c3nSeries4Uid,
            matchingKey: "ContentDate",
            queryValue: "19000101",
            expectedSopInstanceUids: [],
        },
        {
            label: "ContentTime exact: 154333.535814 (C3N #72)",
            studyInstanceUid: c3nStudyUid,
            seriesInstanceUid: c3nSeries4Uid,
            matchingKey: "ContentTime",
            queryValue:
                catalog.bySopInstanceUid.get(c3n72SopUid)?.contentTime ?? "",
            expectedSopInstanceUids: [c3n72SopUid],
        },
        {
            label: "ContentTime exact: 172421.000000 duplicate (TCGA LOCALIZER)",
            studyInstanceUid: tcgaStudyUid,
            seriesInstanceUid: tcgaLocalizerSeriesUid,
            matchingKey: "ContentTime",
            queryValue: "172421.000000",
            expectedSopInstanceUids: getInstanceUidsInSeries(
                catalog,
                tcgaLocalizerSeriesUid,
                (entry) => entry.contentTime === "172421.000000",
            ),
        },
        {
            label: "ContentTime exact: 095646 (Philips)",
            studyInstanceUid: philipsStudyUid,
            seriesInstanceUid: philipsSeriesUid,
            matchingKey: "ContentTime",
            queryValue: "095646",
            expectedSopInstanceUids: getInstanceUidsInSeries(
                catalog,
                philipsSeriesUid,
                (entry) => entry.contentTime === "095646",
            ),
        },
        {
            label: "ContentTime range: 154330-154335 (C3N #4)",
            studyInstanceUid: c3nStudyUid,
            seriesInstanceUid: c3nSeries4Uid,
            matchingKey: "ContentTime",
            queryValue: "154330-154335",
            expectedSopInstanceUids: getInstanceUidsByNumbers(
                catalog,
                c3nSeries4Uid,
                ["27", "56", "63", "72"],
            ),
        },
        {
            label: "ContentTime range: 154330- (C3N #4)",
            studyInstanceUid: c3nStudyUid,
            seriesInstanceUid: c3nSeries4Uid,
            matchingKey: "ContentTime",
            queryValue: "154330-",
            expectedSopInstanceUids: getInstanceUidsByNumbers(
                catalog,
                c3nSeries4Uid,
                ["27", "56", "63", "72"],
            ),
        },
        {
            label: "ContentTime range: -154330 (C3N #4)",
            studyInstanceUid: c3nStudyUid,
            seriesInstanceUid: c3nSeries4Uid,
            matchingKey: "ContentTime",
            queryValue: "-154330",
            expectedSopInstanceUids: getInstanceUidsInSeries(
                catalog,
                c3nSeries4Uid,
                (entry) =>
                    entry.contentTime !== undefined &&
                    entry.contentTime <= "154330",
            ),
        },
        {
            label: "ContentTime exact: no match (C3N #4)",
            studyInstanceUid: c3nStudyUid,
            seriesInstanceUid: c3nSeries4Uid,
            matchingKey: "ContentTime",
            queryValue: "000000",
            expectedSopInstanceUids: [],
        },
    ];
}

function sortBySopInstanceUid(
    instances: FindscuImageResponse[],
): FindscuImageResponse[] {
    return [...instances].sort((left, right) =>
        (left.sopInstanceUid ?? "").localeCompare(right.sopInstanceUid ?? ""),
    );
}

function getResponseField(
    response: FindscuImageResponse,
    matchingKey: CFindImageMatchingKey,
): string | undefined {
    const field = MATCHING_KEY_FIELDS[matchingKey];
    return response[field];
}

function expectInstancesMatch(
    actual: FindscuImageResponse[],
    expectedSopInstanceUids: string[],
    catalog: ExpectedInstanceCatalog,
    matchingKey: CFindImageMatchingKey,
): void {
    const sortedActual = sortBySopInstanceUid(actual);
    const expectedInstances = expectedSopInstanceUids
        .map((sopInstanceUid) => catalog.bySopInstanceUid.get(sopInstanceUid))
        .filter((entry): entry is ExpectedInstanceEntry => entry !== undefined)
        .sort((left, right) =>
            left.sopInstanceUid.localeCompare(right.sopInstanceUid),
        );

    expect(sortedActual).toHaveLength(expectedInstances.length);

    for (let index = 0; index < expectedInstances.length; index++) {
        const actualInstance = sortedActual[index];
        const expectedInstance = expectedInstances[index];

        expect(actualInstance.sopInstanceUid).toBe(
            expectedInstance.sopInstanceUid,
        );
        expect(actualInstance.patientId).toBe(expectedInstance.patientId);
        expect(actualInstance.studyInstanceUid).toBe(
            expectedInstance.studyInstanceUid,
        );
        expect(actualInstance.seriesInstanceUid).toBe(
            expectedInstance.seriesInstanceUid,
        );

        const field = MATCHING_KEY_FIELDS[matchingKey];
        const expectedValue = expectedInstance[field];
        if (expectedValue !== undefined) {
            expect(getResponseField(actualInstance, matchingKey)).toBe(
                expectedValue,
            );
        }
    }
}

const catalog = buildExpectedInstanceCatalog();
const CASES = buildCases(catalog);

describe("C-FIND image level E2E", () => {
    beforeAll(async () => {
        await clearAndSeedDicomDataForCfindImageSuite();
    });

    afterAll(() => {
        releaseDicomDataPreservation();
    });

    it.each(CASES)("$label", async ({
        studyInstanceUid,
        seriesInstanceUid,
        matchingKey,
        queryValue,
        expectedSopInstanceUids,
    }) => {
        const result = await runFindscuImage(
            studyInstanceUid,
            seriesInstanceUid,
            matchingKey,
            queryValue,
        );
        const log = `${result.stdout}\n${result.stderr}`;

        expect(result.exitCode).toBe(0);

        const responses = parseFindscuImageResponses(log);
        expectInstancesMatch(
            responses,
            expectedSopInstanceUids,
            catalog,
            matchingKey,
        );
    });
});
