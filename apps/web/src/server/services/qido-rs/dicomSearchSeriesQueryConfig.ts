import type { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import { DICOM_TAG_KEYWORD_REGISTRY } from "@/server/const/dicomTagKeywordRegistry";
import type { SearchStudySeriesQueryParam } from "@/server/schemas/searchStudySeriesSchema";
import {
    type FieldConfig,
    QueryType,
    STUDY_SEARCH_FIELDS,
} from "./dicomSearchStudyQueryConfig";

export interface SeriesFieldConfig {
    table: string;
    field:
        | keyof Pick<
              SeriesEntity,
              | "seriesInstanceUid"
              | "modality"
              | "seriesNumber"
              | "seriesDescription"
              | "seriesDate"
              | "seriesTime"
              | "performedProcedureStepStartDate"
              | "performedProcedureStepStartTime"
          >
        | "accessionNumber"
        | "studyInstanceUid"
        | "scheduledProcedureStepId"
        | "requestedProcedureId"
        | "accLocalNamespaceEntityId"
        | "accUniversalEntityId"
        | "accUniversalEntityIdType";
    type: QueryType;
    paramKeys: (keyof SearchStudySeriesQueryParam)[];
    joinConfig?: {
        type: "leftJoin" | "innerJoin";
        tableName: string;
        alias: string;
        condition: string;
    };
}

export const SERIES_SEARCH_FIELDS: (SeriesFieldConfig | FieldConfig)[] = [
    ...STUDY_SEARCH_FIELDS,
    {
        table: "series",
        field: "seriesInstanceUid",
        type: QueryType.STRING,
        paramKeys: [
            "SeriesInstanceUID",
            DICOM_TAG_KEYWORD_REGISTRY.SeriesInstanceUID.tag,
        ],
    },
    {
        table: "series",
        field: "modality",
        type: QueryType.STRING,
        paramKeys: ["Modality", DICOM_TAG_KEYWORD_REGISTRY.Modality.tag],
    },
    {
        table: "series",
        field: "seriesDescription",
        type: QueryType.STRING,
        paramKeys: [
            "SeriesDescription",
            DICOM_TAG_KEYWORD_REGISTRY.SeriesDescription.tag,
        ],
    },
    {
        table: "series",
        field: "seriesNumber",
        type: QueryType.NUMBER,
        paramKeys: [
            "SeriesNumber",
            DICOM_TAG_KEYWORD_REGISTRY.SeriesNumber.tag,
        ],
    },
    {
        table: "series",
        field: "seriesDate",
        type: QueryType.DATE,
        paramKeys: ["SeriesDate", DICOM_TAG_KEYWORD_REGISTRY.SeriesDate.tag],
    },
    {
        table: "series",
        field: "seriesTime",
        type: QueryType.TIME,
        paramKeys: ["SeriesTime", DICOM_TAG_KEYWORD_REGISTRY.SeriesTime.tag],
    },
    {
        table: "series",
        field: "performedProcedureStepStartDate",
        type: QueryType.DATE,
        paramKeys: [
            "PerformedProcedureStepStartDate",
            DICOM_TAG_KEYWORD_REGISTRY.PerformedProcedureStepStartDate.tag,
        ],
    },
    {
        table: "series",
        field: "performedProcedureStepStartTime",
        type: QueryType.TIME,
        paramKeys: [
            "PerformedProcedureStepStartTime",
            DICOM_TAG_KEYWORD_REGISTRY.PerformedProcedureStepStartTime.tag,
        ],
    },
    {
        table: "seriesRequestAttributes",
        field: "accessionNumber",
        type: QueryType.STRING,
        paramKeys: [
            "RequestAttributesSequence.AccessionNumber",
            `${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.AccessionNumber.tag}`,
        ],
        joinConfig: {
            type: "leftJoin",
            tableName: "series_request_attributes",
            alias: "seriesRequestAttributes",
            condition: `"seriesRequestAttributes"."id" = series."seriesRequestAttributesId"`,
        },
    },
    {
        table: "seriesRequestAttributes",
        field: "studyInstanceUid",
        type: QueryType.STRING,
        paramKeys: [
            "RequestAttributesSequence.StudyInstanceUID",
            `${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.StudyInstanceUID.tag}`,
        ],
        joinConfig: {
            type: "leftJoin",
            tableName: "series_request_attributes",
            alias: "seriesRequestAttributes",
            condition: `"seriesRequestAttributes"."id" = series."seriesRequestAttributesId"`,
        },
    },
    {
        table: "seriesRequestAttributes",
        field: "accLocalNamespaceEntityId",
        type: QueryType.STRING,
        paramKeys: [
            "RequestAttributesSequence.IssuerOfAccessionNumberSequence.LocalNamespaceEntityID",
            `${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.IssuerOfAccessionNumberSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.LocalNamespaceEntityID.tag}`,
        ],
        joinConfig: {
            type: "leftJoin",
            tableName: "series_request_attributes",
            alias: "seriesRequestAttributes",
            condition: `"seriesRequestAttributes"."id" = series."seriesRequestAttributesId"`,
        },
    },
    {
        table: "seriesRequestAttributes",
        field: "accUniversalEntityId",
        type: QueryType.STRING,
        paramKeys: [
            "RequestAttributesSequence.IssuerOfAccessionNumberSequence.UniversalEntityID",
            `${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.IssuerOfAccessionNumberSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.UniversalEntityID.tag}`,
        ],
        joinConfig: {
            type: "leftJoin",
            tableName: "series_request_attributes",
            alias: "seriesRequestAttributes",
            condition: `"seriesRequestAttributes"."id" = series."seriesRequestAttributesId"`,
        },
    },
    {
        table: "seriesRequestAttributes",
        field: "accUniversalEntityIdType",
        type: QueryType.STRING,
        paramKeys: [
            "RequestAttributesSequence.IssuerOfAccessionNumberSequence.UniversalEntityIDType",
            `${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.IssuerOfAccessionNumberSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.UniversalEntityIDType.tag}`,
        ],
        joinConfig: {
            type: "leftJoin",
            tableName: "series_request_attributes",
            alias: "seriesRequestAttributes",
            condition: `"seriesRequestAttributes"."id" = series."seriesRequestAttributesId"`,
        },
    },
    {
        table: "seriesRequestAttributes",
        field: "requestedProcedureId",
        type: QueryType.STRING,
        paramKeys: [
            "RequestAttributesSequence.RequestedProcedureID",
            `${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.RequestedProcedureID.tag}`,
        ],
        joinConfig: {
            type: "leftJoin",
            tableName: "series_request_attributes",
            alias: "seriesRequestAttributes",
            condition: `"seriesRequestAttributes"."id" = series."seriesRequestAttributesId"`,
        },
    },
    {
        table: "seriesRequestAttributes",
        field: "scheduledProcedureStepId",
        type: QueryType.STRING,
        paramKeys: [
            "RequestAttributesSequence.ScheduledProcedureStepID",
            `${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.ScheduledProcedureStepID.tag}`,
        ],
        joinConfig: {
            type: "leftJoin",
            tableName: "series_request_attributes",
            alias: "seriesRequestAttributes",
            condition: `"seriesRequestAttributes"."id" = series."seriesRequestAttributesId"`,
        },
    },
];
