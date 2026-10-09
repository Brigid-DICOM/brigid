import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
    clearAndSeedDicomDataForCfindSuite,
    releaseDicomDataPreservation,
} from "./helpers/dimseTestContext";
import type { CFindMatchingKey } from "./helpers/findscuRunner";
import { runFindscu } from "./helpers/findscuRunner";
import type { FindscuPatientResponse } from "./helpers/parseFindscuResponses";
import { parseFindscuResponses } from "./helpers/parseFindscuResponses";

interface ExpectedPatient {
    patientId: string;
    patientName?: string;
    patientBirthDate?: string;
}

interface CFindPatientCase {
    label: string;
    matchingKey: CFindMatchingKey;
    queryValue: string;
    expectedPatients: ExpectedPatient[];
}

const CASES: CFindPatientCase[] = [
    {
        label: "PatientID wildcard: TC*",
        matchingKey: "PatientID",
        queryValue: "TC*",
        expectedPatients: [
            { patientId: "TCGA-G4-6304", patientName: "TCGA-G4-6304" },
        ],
    },
    {
        label: "PatientID wildcard: C3*",
        matchingKey: "PatientID",
        queryValue: "C3*",
        expectedPatients: [
            { patientId: "C3N-00953", patientName: "C3N-00953" },
            { patientId: "C3L-00277", patientName: "ChestXR^TwoViews" },
        ],
    },
    {
        label: "PatientID wildcard: no match",
        matchingKey: "PatientID",
        queryValue: "NOMATCH*",
        expectedPatients: [],
    },
    {
        label: "PatientName wildcard: TCGA*",
        matchingKey: "PatientName",
        queryValue: "TCGA*",
        expectedPatients: [
            { patientId: "TCGA-G4-6304", patientName: "TCGA-G4-6304" },
        ],
    },
    {
        label: "PatientName wildcard: Philips*",
        matchingKey: "PatientName",
        queryValue: "Philips*",
        expectedPatients: [{ patientId: "123456", patientName: "Philips^Amy" }],
    },
    {
        label: "PatientName wildcard: *TwoViews",
        matchingKey: "PatientName",
        queryValue: "*TwoViews",
        expectedPatients: [
            { patientId: "C3L-00277", patientName: "ChestXR^TwoViews" },
        ],
    },
    {
        label: "PatientBirthDate exact: 19601218",
        matchingKey: "PatientBirthDate",
        queryValue: "19601218",
        expectedPatients: [
            {
                patientId: "C3L-00277",
                patientName: "ChestXR^TwoViews",
                patientBirthDate: "19601218",
            },
        ],
    },
    {
        label: "PatientBirthDate exact: 20010101",
        matchingKey: "PatientBirthDate",
        queryValue: "20010101",
        expectedPatients: [
            {
                patientId: "123456",
                patientName: "Philips^Amy",
                patientBirthDate: "20010101",
            },
        ],
    },
    {
        label: "PatientBirthDate range: 19990101-",
        matchingKey: "PatientBirthDate",
        queryValue: "19990101-",
        expectedPatients: [
            {
                patientId: "123456",
                patientName: "Philips^Amy",
                patientBirthDate: "20010101",
            },
        ],
    },
    {
        label: "PatientBirthDate range: -19610101",
        matchingKey: "PatientBirthDate",
        queryValue: "-19610101",
        expectedPatients: [
            {
                patientId: "C3L-00277",
                patientName: "ChestXR^TwoViews",
                patientBirthDate: "19601218",
            },
        ],
    },
    {
        label: "PatientBirthDate range: 19600101-20011231",
        matchingKey: "PatientBirthDate",
        queryValue: "19600101-20011231",
        expectedPatients: [
            {
                patientId: "C3L-00277",
                patientName: "ChestXR^TwoViews",
                patientBirthDate: "19601218",
            },
            {
                patientId: "123456",
                patientName: "Philips^Amy",
                patientBirthDate: "20010101",
            },
        ],
    },
];

function sortByPatientId(
    patients: FindscuPatientResponse[],
): FindscuPatientResponse[] {
    return [...patients].sort((left, right) =>
        (left.patientId ?? "").localeCompare(right.patientId ?? ""),
    );
}

function expectPatientsMatch(
    actual: FindscuPatientResponse[],
    expected: ExpectedPatient[],
): void {
    const sortedActual = sortByPatientId(actual);
    const sortedExpected = sortByPatientId(expected);

    expect(sortedActual).toHaveLength(sortedExpected.length);

    for (let index = 0; index < sortedExpected.length; index++) {
        const actualPatient = sortedActual[index];
        const expectedPatient = sortedExpected[index];

        expect(actualPatient.patientId).toBe(expectedPatient.patientId);

        if (expectedPatient.patientName !== undefined) {
            expect(actualPatient.patientName).toBe(expectedPatient.patientName);
        }

        if (expectedPatient.patientBirthDate !== undefined) {
            expect(actualPatient.patientBirthDate).toBe(
                expectedPatient.patientBirthDate,
            );
        }
    }
}

describe("C-FIND patient level E2E", () => {
    beforeAll(async () => {
        await clearAndSeedDicomDataForCfindSuite();
    });

    afterAll(() => {
        releaseDicomDataPreservation();
    });

    it.each(CASES)("$label", async ({
        matchingKey,
        queryValue,
        expectedPatients,
    }) => {
        const result = await runFindscu(matchingKey, queryValue);
        const log = `${result.stdout}\n${result.stderr}`;

        expect(result.exitCode).toBe(0);

        const responses = parseFindscuResponses(log);
        expectPatientsMatch(responses, expectedPatients);
    });
});
