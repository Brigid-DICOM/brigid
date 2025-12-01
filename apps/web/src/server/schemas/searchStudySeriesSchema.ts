import { z } from "zod";
import { DICOM_TAG_KEYWORD_REGISTRY } from "../const/dicomTagKeywordRegistry";
import { dateRangeSchema } from "./dateRangeSchema";
import { numberQuerySchema } from "./numberQuerySchema";
import { searchStudiesQueryParamSchema } from "./searchStudies";
import { timeRangeSchema } from "./timeRangeSchema";

const NESTED_TAG_KEYS = {
    "RequestAttributesSequence_ScheduledProcedureStepID": `${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.ScheduledProcedureStepID.tag}`,
    "RequestAttributesSequence_RequestedProcedureID": `${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.RequestedProcedureID.tag}`,
    "RequestAttributesSequence_AccessionNumber": `${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.AccessionNumber.tag}`,
    "RequestAttributesSequence_StudyInstanceUID": `${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.StudyInstanceUID.tag}`,
    "RequestAttributesSequence_IssuerOfAccessionNumberSequence_LocalNamespaceEntityID": `${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.IssuerOfAccessionNumberSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.LocalNamespaceEntityID.tag}`,
    "RequestAttributesSequence_IssuerOfAccessionNumberSequence_UniversalEntityID": `${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.IssuerOfAccessionNumberSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.UniversalEntityID.tag}`,
    "RequestAttributesSequence_IssuerOfAccessionNumberSequence_UniversalEntityIDType": `${DICOM_TAG_KEYWORD_REGISTRY.RequestAttributesSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.IssuerOfAccessionNumberSequence.tag}.${DICOM_TAG_KEYWORD_REGISTRY.UniversalEntityIDType.tag}`,
} as const;

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

    SeriesDescription: z.string().optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.SeriesDescription.tag]: z.string().optional(),

    PerformedProcedureStepStartDate: dateRangeSchema.optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.PerformedProcedureStepStartDate.tag]: dateRangeSchema.optional(),

    PerformedProcedureStepStartTime: timeRangeSchema.optional(),
    [DICOM_TAG_KEYWORD_REGISTRY.PerformedProcedureStepStartTime.tag]: timeRangeSchema.optional(),

    "RequestAttributesSequence.ScheduledProcedureStepID": z.string().optional(),
    [NESTED_TAG_KEYS.RequestAttributesSequence_ScheduledProcedureStepID]: z.string().optional(),
    
    "RequestAttributesSequence.RequestedProcedureID": z.string().optional(),
    [NESTED_TAG_KEYS.RequestAttributesSequence_RequestedProcedureID]: z.string().optional(),

    "RequestAttributesSequence.AccessionNumber": z.string().optional(),
    [NESTED_TAG_KEYS.RequestAttributesSequence_AccessionNumber]: z.string().optional(),

    "RequestAttributesSequence.StudyInstanceUID": z.string().optional(),
    [NESTED_TAG_KEYS.RequestAttributesSequence_StudyInstanceUID]: z.string().optional(),

    "RequestAttributesSequence.IssuerOfAccessionNumberSequence.LocalNamespaceEntityID": z.string().optional(),
    [NESTED_TAG_KEYS.RequestAttributesSequence_IssuerOfAccessionNumberSequence_LocalNamespaceEntityID]: z.string().optional(),

    "RequestAttributesSequence.IssuerOfAccessionNumberSequence.UniversalEntityID": z.string().optional(),
    [NESTED_TAG_KEYS.RequestAttributesSequence_IssuerOfAccessionNumberSequence_UniversalEntityID]: z.string().optional(),

    "RequestAttributesSequence.IssuerOfAccessionNumberSequence.UniversalEntityIDType": z.string().optional(),
    [NESTED_TAG_KEYS.RequestAttributesSequence_IssuerOfAccessionNumberSequence_UniversalEntityIDType]: z.string().optional(),
});

export type SearchStudySeriesQueryParam = z.infer<typeof searchStudySeriesQueryParamSchema>;