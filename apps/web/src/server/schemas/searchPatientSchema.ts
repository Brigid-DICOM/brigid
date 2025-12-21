import env from "@brigid/env";
import { z } from "zod";
import { DICOM_TAG_KEYWORD_REGISTRY } from "../const/dicomTagKeywordRegistry";
import { dateRangeSchema } from "./dateRangeSchema";
import { timeRangeSchema } from "./timeRangeSchema";

export const searchPatientsQueryParamSchema = z.object({
    limit: z.coerce.number().int().min(1).max(env.QUERY_MAX_LIMIT).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    fuzzymatching: z.boolean().optional(),
    // 支援的查詢欄位
    PatientName: z.string().optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.PatientName.tag]: z.string().optional(),
    PatientID: z.string().optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.PatientID.tag]: z.string().optional(),
    PatientBirthDate: dateRangeSchema.optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.PatientBirthDate.tag]:
        dateRangeSchema.optional(),
    PatientBirthTime: timeRangeSchema.optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.PatientBirthTime.tag]:
        timeRangeSchema.optional(),
    PatientSex: z.string().optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.PatientSex.tag]: z.string().optional(),
});

export type SearchPatientsQueryParam = z.infer<
    typeof searchPatientsQueryParamSchema
>;
