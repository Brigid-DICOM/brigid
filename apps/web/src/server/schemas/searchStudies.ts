import { z } from "zod";
import { DICOM_TAG_KEYWORD_REGISTRY } from "../const/dicomTagKeywordRegistry";
import { dateRangeSchema } from "./dateRangeSchema";
import { timeRangeSchema } from "./timeRangeSchema";

export const searchStudiesQueryParamSchema = z.object({
    limit: z.coerce.number().int().min(1).max(1000).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    fuzzymatching: z.boolean().optional(),
    StudyInstanceUID: z.string().optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.StudyInstanceUID.tag]: z.string().optional(),
    StudyDate: dateRangeSchema.optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.StudyDate.tag]: dateRangeSchema.optional(),
    StudyTime: timeRangeSchema.optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.StudyTime.tag]: timeRangeSchema.optional(),
    AccessionNumber: z.string().optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.AccessionNumber.tag]: z.string().optional(),
    ModalitiesInStudy: z.string().optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.ModalitiesInStudy.tag]: z.string().optional(),
    ReferringPhysicianName: z.string().optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.ReferringPhysicianName.tag]: z.string().optional(),
    PatientName: z.string().optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.PatientName.tag]: z.string().optional(),
    PatientID: z.string().optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.PatientID.tag]: z.string().optional(),
    StudyID: z.string().optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.StudyID.tag]: z.string().optional(),
});


export type SearchStudiesQueryParam = z.infer<typeof searchStudiesQueryParamSchema>;