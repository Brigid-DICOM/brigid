import type { StudyEntity } from "@brigid/database/src/entities/study.entity";
import { DICOM_TAG_KEYWORD_REGISTRY } from "@/server/const/dicomTagKeywordRegistry";
import type { SearchStudiesQueryParam } from "@/server/schemas/searchStudies";

export enum QueryType {
    STRING = "string",
    DATE = "date",
    TIME = "time",
    NUMBER = "number",
    DATETIME = "datetime",
}

export interface FieldConfig {
    table: string;
    field:
        | keyof Pick<
              StudyEntity,
              | "dicomPatientId"
              | "studyInstanceUid"
              | "studyDate"
              | "studyTime"
              | "accessionNumber"
              | "referringPhysicianName"
              | "studyId"
          >
        | "alphabetic"
        | "modality";
    type: QueryType;
    paramKeys: (keyof SearchStudiesQueryParam)[];
    joinConfig?: {
        type: "leftJoin" | "innerJoin";
        tableName: string;
        alias: string;
        condition: string;
    };
}

export const STUDY_SEARCH_FIELDS: FieldConfig[] = [
    {
        table: "study",
        field: "dicomPatientId",
        type: QueryType.STRING,
        paramKeys: ["PatientID", DICOM_TAG_KEYWORD_REGISTRY.PatientID.tag],
    },
    {
        table: "study",
        field: "studyInstanceUid",
        type: QueryType.STRING,
        paramKeys: ["StudyInstanceUID", DICOM_TAG_KEYWORD_REGISTRY.StudyInstanceUID.tag],
    },
    {
        table: "study",
        field: "studyDate",
        type: QueryType.DATE,
        paramKeys: ["StudyDate", DICOM_TAG_KEYWORD_REGISTRY.StudyDate.tag],
    },
    {
        table: "study",
        field: "studyTime",
        type: QueryType.TIME,
        paramKeys: ["StudyTime", DICOM_TAG_KEYWORD_REGISTRY.StudyTime.tag],
    },
    {
        table: "study",
        field: "accessionNumber",
        type: QueryType.STRING,
        paramKeys: ["AccessionNumber", DICOM_TAG_KEYWORD_REGISTRY.AccessionNumber.tag],
    },
    {
        table: "series",
        field: "modality",
        type: QueryType.STRING,
        paramKeys: ["ModalitiesInStudy", DICOM_TAG_KEYWORD_REGISTRY.ModalitiesInStudy.tag],
        joinConfig: {
            type: "innerJoin",
            tableName: "series",
            alias: "series",
            condition: "series.localStudyId = study.id",
        }
    },
    {
        table: "referringPhysicianName",
        field: "alphabetic",
        type: QueryType.STRING,
        paramKeys: ["ReferringPhysicianName", DICOM_TAG_KEYWORD_REGISTRY.ReferringPhysicianName.tag],
        joinConfig: {
            type: "leftJoin",
            tableName: "person_name",
            alias: "referringPhysicianName",
            condition: "referringPhysicianName.id = study.referringPhysicianNameId",
        }
    },
    {
        table: "patientName",
        field: "alphabetic",
        type: QueryType.STRING,
        paramKeys: ["PatientName", DICOM_TAG_KEYWORD_REGISTRY.PatientName.tag]
    },
    {
        table: "study",
        field: "studyId",
        type: QueryType.STRING,
        paramKeys: ["StudyID", DICOM_TAG_KEYWORD_REGISTRY.StudyID.tag],
    }
]