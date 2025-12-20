import type { PatientEntity } from "@brigid/database/src/entities/patient.entity";
import { DICOM_TAG_KEYWORD_REGISTRY } from "@/server/const/dicomTagKeywordRegistry";
import type { SearchPatientsQueryParam } from "@/server/schemas/searchPatientSchema";
import { QueryType } from "./dicomSearchStudyQueryConfig";

export interface PatientFieldConfig {
    table: string;
    field:
        | keyof Pick<
              PatientEntity,
              "dicomPatientId" | "birthDate" | "birthTime" | "sex"
          >
        | "alphabetic";
    type: QueryType;
    paramKeys: (keyof SearchPatientsQueryParam)[];
    joinConfig?: {
        type: "leftJoin" | "innerJoin";
        tableName: string;
        alias: string;
        condition: string;
    };
}

export const PATIENT_SEARCH_FIELDS: PatientFieldConfig[] = [
    {
        table: "patient",
        field: "dicomPatientId",
        type: QueryType.STRING,
        paramKeys: ["PatientID", DICOM_TAG_KEYWORD_REGISTRY.PatientID.tag],
    },
    {
        table: "patientName",
        field: "alphabetic",
        type: QueryType.STRING,
        paramKeys: ["PatientName", DICOM_TAG_KEYWORD_REGISTRY.PatientName.tag],
        joinConfig: {
            type: "innerJoin",
            tableName: "person_name",
            alias: "patientName",
            condition: "patientName.id = patient.patientNameId",
        },
    },
    {
        table: "patient",
        field: "birthDate",
        type: QueryType.DATE,
        paramKeys: [
            "PatientBirthDate",
            DICOM_TAG_KEYWORD_REGISTRY.PatientBirthDate.tag,
        ],
    },
    {
        table: "patient",
        field: "birthTime",
        type: QueryType.TIME,
        paramKeys: [
            "PatientBirthTime",
            DICOM_TAG_KEYWORD_REGISTRY.PatientBirthTime.tag,
        ],
    },
    {
        table: "patient",
        field: "sex",
        type: QueryType.STRING,
        paramKeys: ["PatientSex", DICOM_TAG_KEYWORD_REGISTRY.PatientSex.tag],
    },
];