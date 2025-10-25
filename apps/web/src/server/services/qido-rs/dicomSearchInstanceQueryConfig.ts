import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { DICOM_TAG_KEYWORD_REGISTRY } from "@/server/const/dicomTagKeywordRegistry";
import type { SearchStudySeriesInstancesQueryParam } from "@/server/schemas/searchStudySeriesInstancesSchema";
import {
    SERIES_SEARCH_FIELDS, 
    type SeriesFieldConfig
} from "./dicomSearchSeriesQueryConfig";
import {
    type FieldConfig,
    QueryType,
    STUDY_SEARCH_FIELDS
} from "./dicomSearchStudyQueryConfig";


export interface InstanceFieldConfig {
    table: string;
    field: keyof Pick<
        InstanceEntity,
        | "sopClassUid"
        | "sopInstanceUid"
        | "instanceNumber"
        | "acquisitionDate"
        | "acquisitionDateTime"
        | "contentDate"
        | "contentTime"
    >;
    type: QueryType;
    paramKeys: (keyof SearchStudySeriesInstancesQueryParam)[];
    joinConfig?: {
        type: "leftJoin" | "innerJoin";
        tableName: string;
        alias: string;
        condition: string;
    }
}

export const INSTANCE_SEARCH_FIELDS: (InstanceFieldConfig | FieldConfig | SeriesFieldConfig)[] = [
    ...STUDY_SEARCH_FIELDS,
    ...SERIES_SEARCH_FIELDS,
    {
        table: "instance",
        field: "sopClassUid",
        type: QueryType.STRING,
        paramKeys: ["SOPClassUID", DICOM_TAG_KEYWORD_REGISTRY.SOPClassUID.tag],
    },
    {
        table: "instance",
        field: "sopInstanceUid",
        type: QueryType.STRING,
        paramKeys: ["SOPInstanceUID", DICOM_TAG_KEYWORD_REGISTRY.SOPInstanceUID.tag],
    },
    {
        table: "instance",
        field: "instanceNumber",
        type: QueryType.NUMBER,
        paramKeys: ["InstanceNumber", DICOM_TAG_KEYWORD_REGISTRY.InstanceNumber.tag],
    },
    {
        table: "instance",
        field: "acquisitionDate",
        type: QueryType.DATE,
        paramKeys: ["AcquisitionDate", DICOM_TAG_KEYWORD_REGISTRY.AcquisitionDate.tag],
    },
    {
        table: "instance",
        field: "acquisitionDateTime",
        type: QueryType.DATETIME,
        paramKeys: ["AcquisitionDateTime", DICOM_TAG_KEYWORD_REGISTRY.AcquisitionDateTime.tag],
    },
    {
        table: "instance",
        field: "contentDate",
        type: QueryType.DATE,
        paramKeys: ["ContentDate", DICOM_TAG_KEYWORD_REGISTRY.ContentDate.tag],
    },
    {
        table: "instance",
        field: "contentTime",
        type: QueryType.TIME,
        paramKeys: ["ContentTime", DICOM_TAG_KEYWORD_REGISTRY.ContentTime.tag],
    }
];