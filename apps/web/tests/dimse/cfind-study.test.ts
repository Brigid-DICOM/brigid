import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { CFindStudyMatchingKey } from "./helpers/findscuRunner";
import { runFindscuStudy } from "./helpers/findscuRunner";
import {
    buildExpectedStudyCatalog,
    type ExpectedStudyCatalog,
    type ExpectedStudyEntry,
} from "./helpers/expectedStudyCatalog";
import type { FindscuStudyResponse } from "./helpers/parseFindscuStudyResponses";
import { parseFindscuStudyResponses } from "./helpers/parseFindscuStudyResponses";
import {
    clearAndSeedDicomDataForCfindSuite,
    releaseDicomDataPreservation,
} from "./helpers/dimseTestContext";

interface CFindStudyCase {
    label: string;
    matchingKey: CFindStudyMatchingKey;
    queryValue: string;
    expectedPatientIds: string[];
}

const MATCHING_KEY_FIELDS = {
    PatientID: "patientId",
    PatientName: "patientName",
    StudyInstanceUID: "studyInstanceUid",
    StudyDate: "studyDate",
    StudyTime: "studyTime",
    AccessionNumber: "accessionNumber",
    ModalitiesInStudy: "modalitiesInStudy",
    StudyID: "studyId",
    ReferringPhysicianName: "referringPhysicianName",
} as const satisfies Record<
    CFindStudyMatchingKey,
    keyof ExpectedStudyEntry
>;

function buildCases(catalog: ExpectedStudyCatalog): CFindStudyCase[] {
    const philipsUid =
        catalog.byPatientId.get("123456")?.studyInstanceUid ?? "";

    return [
        {
            label: "PatientID wildcard: TC*",
            matchingKey: "PatientID",
            queryValue: "TC*",
            expectedPatientIds: ["TCGA-G4-6304"],
        },
        {
            label: "PatientID wildcard: C3*",
            matchingKey: "PatientID",
            queryValue: "C3*",
            expectedPatientIds: ["C3N-00953", "C3L-00277"],
        },
        {
            label: "PatientID wildcard: no match",
            matchingKey: "PatientID",
            queryValue: "NOMATCH*",
            expectedPatientIds: [],
        },
        {
            label: "PatientName wildcard: TCGA*",
            matchingKey: "PatientName",
            queryValue: "TCGA*",
            expectedPatientIds: ["TCGA-G4-6304"],
        },
        {
            label: "PatientName wildcard: Philips*",
            matchingKey: "PatientName",
            queryValue: "Philips*",
            expectedPatientIds: ["123456"],
        },
        {
            label: "PatientName wildcard: *TwoViews",
            matchingKey: "PatientName",
            queryValue: "*TwoViews",
            expectedPatientIds: ["C3L-00277"],
        },
        {
            label: "StudyDate exact: 20100213",
            matchingKey: "StudyDate",
            queryValue: "20100213",
            expectedPatientIds: ["C3N-00953"],
        },
        {
            label: "StudyDate range: 20000101-",
            matchingKey: "StudyDate",
            queryValue: "20000101-",
            expectedPatientIds: ["C3N-00953", "123456", "GLIOMA01-i_03A6"],
        },
        {
            label: "StudyDate range: -20000101",
            matchingKey: "StudyDate",
            queryValue: "-20000101",
            expectedPatientIds: ["TCGA-G4-6304", "C3L-00277"],
        },
        {
            label: "StudyDate range: 19990101-20100101",
            matchingKey: "StudyDate",
            queryValue: "19990101-20100101",
            expectedPatientIds: ["TCGA-G4-6304", "C3L-00277", "GLIOMA01-i_03A6"],
        },
        {
            label: "StudyDate exact: no match",
            matchingKey: "StudyDate",
            queryValue: "19000101",
            expectedPatientIds: [],
        },
        {
            label: "StudyTime exact: 095253",
            matchingKey: "StudyTime",
            queryValue: "095253",
            expectedPatientIds: ["123456"],
        },
        {
            label: "StudyTime range: 120000-160000",
            matchingKey: "StudyTime",
            queryValue: "120000-160000",
            expectedPatientIds: ["C3N-00953", "C3L-00277"],
        },
        {
            label: "StudyTime range: 120000-",
            matchingKey: "StudyTime",
            queryValue: "120000-",
            expectedPatientIds: ["TCGA-G4-6304", "C3N-00953", "C3L-00277"],
        },
        {
            label: "StudyTime range: -100000",
            matchingKey: "StudyTime",
            queryValue: "-100000",
            expectedPatientIds: ["123456"],
        },
        {
            label: "StudyTime exact: no match",
            matchingKey: "StudyTime",
            queryValue: "000000",
            expectedPatientIds: [],
        },
        {
            label: "AccessionNumber exact: D18-1001",
            matchingKey: "AccessionNumber",
            queryValue: "D18-1001",
            expectedPatientIds: ["123456"],
        },
        {
            label: "AccessionNumber wildcard: 3266*",
            matchingKey: "AccessionNumber",
            queryValue: "3266*",
            expectedPatientIds: ["TCGA-G4-6304"],
        },
        {
            label: "AccessionNumber wildcard: D18*",
            matchingKey: "AccessionNumber",
            queryValue: "D18*",
            expectedPatientIds: ["123456"],
        },
        {
            label: "AccessionNumber wildcard: no match",
            matchingKey: "AccessionNumber",
            queryValue: "NOMATCH*",
            expectedPatientIds: [],
        },
        {
            label: "ReferringPhysicianName exact: ROBERT^BROWN",
            matchingKey: "ReferringPhysicianName",
            queryValue: "ROBERT^BROWN",
            expectedPatientIds: ["123456"],
        },
        {
            label: "ReferringPhysicianName wildcard: ROBERT*",
            matchingKey: "ReferringPhysicianName",
            queryValue: "ROBERT*",
            expectedPatientIds: ["123456"],
        },
        {
            label: "ReferringPhysicianName wildcard: FAKE*",
            matchingKey: "ReferringPhysicianName",
            queryValue: "FAKE*",
            expectedPatientIds: ["GLIOMA01-i_03A6"],
        },
        {
            label: "ReferringPhysicianName wildcard: no match",
            matchingKey: "ReferringPhysicianName",
            queryValue: "NOMATCH*",
            expectedPatientIds: [],
        },
        {
            label: "ModalitiesInStudy exact: CT",
            matchingKey: "ModalitiesInStudy",
            queryValue: "CT",
            expectedPatientIds: ["C3N-00953"],
        },
        {
            label: "ModalitiesInStudy wildcard: C*",
            matchingKey: "ModalitiesInStudy",
            queryValue: "C*",
            expectedPatientIds: ["C3N-00953"],
        },
        {
            label: "ModalitiesInStudy multi-value: CT\\SM",
            matchingKey: "ModalitiesInStudy",
            queryValue: "CT\\SM",
            expectedPatientIds: ["C3N-00953", "123456"],
        },
        {
            label: "ModalitiesInStudy wildcard: no match",
            matchingKey: "ModalitiesInStudy",
            queryValue: "XR*",
            expectedPatientIds: [],
        },
        {
            label: "StudyInstanceUID exact",
            matchingKey: "StudyInstanceUID",
            queryValue: philipsUid,
            expectedPatientIds: ["123456"],
        },
        {
            label: "StudyID exact: D18-1001",
            matchingKey: "StudyID",
            queryValue: "D18-1001",
            expectedPatientIds: ["123456"],
        },
    ];
}

function sortByStudyInstanceUid(
    studies: FindscuStudyResponse[],
): FindscuStudyResponse[] {
    return [...studies].sort((left, right) =>
        (left.studyInstanceUid ?? "").localeCompare(
            right.studyInstanceUid ?? "",
        ),
    );
}

function getResponseField(
    response: FindscuStudyResponse,
    matchingKey: CFindStudyMatchingKey,
): string | undefined {
    const field = MATCHING_KEY_FIELDS[matchingKey];
    return response[field];
}

function expectStudiesMatch(
    actual: FindscuStudyResponse[],
    expectedPatientIds: string[],
    catalog: ExpectedStudyCatalog,
    matchingKey: CFindStudyMatchingKey,
): void {
    const sortedActual = sortByStudyInstanceUid(actual);
    const expectedStudies = expectedPatientIds
        .map((patientId) => catalog.byPatientId.get(patientId))
        .filter((entry): entry is ExpectedStudyEntry => entry !== undefined)
        .sort((left, right) =>
            left.studyInstanceUid.localeCompare(right.studyInstanceUid),
        );

    expect(sortedActual).toHaveLength(expectedStudies.length);

    for (let index = 0; index < expectedStudies.length; index++) {
        const actualStudy = sortedActual[index];
        const expectedStudy = expectedStudies[index];

        expect(actualStudy.studyInstanceUid).toBe(
            expectedStudy.studyInstanceUid,
        );
        expect(actualStudy.patientId).toBe(expectedStudy.patientId);

        const field = MATCHING_KEY_FIELDS[matchingKey];
        const expectedValue = expectedStudy[field];
        if (expectedValue !== undefined) {
            expect(getResponseField(actualStudy, matchingKey)).toBe(
                expectedValue,
            );
        }
    }
}

const catalog = buildExpectedStudyCatalog();
const CASES = buildCases(catalog);

describe("C-FIND study level E2E", () => {
    beforeAll(async () => {
        await clearAndSeedDicomDataForCfindSuite();
    });

    afterAll(() => {
        releaseDicomDataPreservation();
    });

    it.each(CASES)(
        "$label",
        async ({ matchingKey, queryValue, expectedPatientIds }) => {
            const result = await runFindscuStudy(matchingKey, queryValue);
            const log = `${result.stdout}\n${result.stderr}`;

            expect(result.exitCode).toBe(0);

            const responses = parseFindscuStudyResponses(log);
            expectStudiesMatch(
                responses,
                expectedPatientIds,
                catalog,
                matchingKey,
            );
        },
    );
});
