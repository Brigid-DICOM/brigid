import path from "node:path";
import { join } from "desm";
import testData from "../../fixtures/dicomFiles/data.json";
import { readDicomTags, resolveSeedFilePath } from "./readDicomTags";

const FIXTURES_ROOT = path.resolve(
    join(import.meta.url, "../../fixtures/dicomFiles"),
);

const STUDY_TAGS = [
    "0010,0020",
    "0010,0010",
    "0008,0020",
    "0008,0030",
    "0008,0050",
    "0020,0010",
    "0008,0090",
] as const;

export interface ExpectedStudyEntry {
    studyInstanceUid: string;
    patientId: string;
    patientName?: string;
    studyDate?: string;
    studyTime?: string;
    accessionNumber?: string;
    modalitiesInStudy: string;
    studyId?: string;
    referringPhysicianName?: string;
}

interface DataJsonInstance {
    file: string;
}

interface DataJsonSeries {
    modality: string;
    instances: DataJsonInstance[];
}

interface DataJsonStudy {
    series: DataJsonSeries[];
}

export interface ExpectedStudyCatalog {
    byStudyInstanceUid: Map<string, ExpectedStudyEntry>;
    byPatientId: Map<string, ExpectedStudyEntry>;
    entries: ExpectedStudyEntry[];
}

export function buildExpectedStudyCatalog(): ExpectedStudyCatalog {
    const byStudyInstanceUid = new Map<string, ExpectedStudyEntry>();
    const byPatientId = new Map<string, ExpectedStudyEntry>();
    const entries: ExpectedStudyEntry[] = [];

    for (const [studyInstanceUid, study] of Object.entries(
        testData as Record<string, DataJsonStudy>,
    )) {
        const instanceFile = study.series[0]?.instances[0]?.file;
        if (!instanceFile) {
            throw new Error(
                "data.json study is missing series[0].instances[0]",
            );
        }

        const modality = study.series[0]?.modality;
        if (!modality) {
            throw new Error("data.json study is missing series[0].modality");
        }

        const filePath = resolveSeedFilePath(FIXTURES_ROOT, instanceFile);
        const tags = readDicomTags(filePath, STUDY_TAGS);

        const patientId = tags["0010,0020"];
        if (!patientId) {
            throw new Error(`seed file missing PatientID: ${instanceFile}`);
        }

        const entry: ExpectedStudyEntry = {
            studyInstanceUid,
            patientId,
            patientName: tags["0010,0010"],
            studyDate: tags["0008,0020"],
            studyTime: tags["0008,0030"],
            accessionNumber: tags["0008,0050"],
            modalitiesInStudy: modality,
            studyId: tags["0020,0010"],
            referringPhysicianName: tags["0008,0090"],
        };

        entries.push(entry);
        byStudyInstanceUid.set(studyInstanceUid, entry);
        byPatientId.set(patientId, entry);
    }

    return { byStudyInstanceUid, byPatientId, entries };
}
