import { z } from "zod";
import { DICOM_TAG_KEYWORD_REGISTRY } from "../const/dicomTagKeywordRegistry";
import { dateRangeSchema } from "./dateRangeSchema";
import { numberQuerySchema } from "./numberQuerySchema";
import { searchStudiesQueryParamSchema } from "./searchStudies";
import { timeRangeSchema } from "./timeRangeSchema";

export const searchStudySeriesQueryParamSchema = searchStudiesQueryParamSchema.extend({
    SeriesInstanceUID: z.string().optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.SeriesInstanceUID.tag]: z.string().optional(),

    Modality: z.string().optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.Modality.tag]: z.string().optional(),

    SeriesNumber: numberQuerySchema.optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.SeriesNumber.tag]: numberQuerySchema.optional(),

    SeriesDate: dateRangeSchema.optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.SeriesDate.tag]: dateRangeSchema.optional(),

    SeriesTime: timeRangeSchema.optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.SeriesTime.tag]: timeRangeSchema.optional(),

    PerformedProcedureStepStartDate: dateRangeSchema.optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.PerformedProcedureStepStartDate.tag]: dateRangeSchema.optional(),

    PerformedProcedureStepStartTime: timeRangeSchema.optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.PerformedProcedureStepStartTime.tag]: timeRangeSchema.optional(),

    "RequestAttributesSequence.ScheduleProcedureStepID": z.string().optional(),
    [`${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.ScheduledProcedureStepID.tag}`]: z.string().optional(),
    
    "RequestAttributesSequence.RequestedProcedureID": z.string().optional(),
    [`${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.RequestedProcedureID.tag}`]: z.string().optional(),

    "RequestAttributesSequence.AccessionNumber": z.string().optional(),
    [`${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.AccessionNumber.tag}`]: z.string().optional(),

    "RequestAttributesSequence.StudyInstanceUID": z.string().optional(),
    [`${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.StudyInstanceUID.tag}`]: z.string().optional(),

    "RequestAttributesSequence.IssuerOfAccessionNumberSequence.LocalNamespaceEntityID": z.string().optional(),
    [`${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.IssuerOfAccessionNumberSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.LocalNamespaceEntityID.tag}`]: z.string().optional(),

    "RequestAttributesSequence.IssuerOfAccessionNumberSequence.UniversalEntityID": z.string().optional(),
    [`${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.IssuerOfAccessionNumberSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.UniversalEntityID.tag}`]: z.string().optional(),

    "RequestAttributesSequence.IssuerOfAccessionNumberSequence.UniversalEntityIDType": z.string().optional(),
    [`${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.IssuerOfAccessionNumberSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.UniversalEntityIDType.tag}`]: z.string().optional(),
});

export type SearchStudySeriesQueryParam = z.infer<typeof searchStudySeriesQueryParamSchema>;