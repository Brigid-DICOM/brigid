import { z } from "zod";
import { DICOM_TAG_KEYWORD_REGISTRY } from "../const/dicomTagKeywordRegistry";
import { dateRangeSchema } from "./dateRangeSchema";
import { dateTimeRangeSchema } from "./dateTimeRangeSchema";
import { numberQuerySchema } from "./numberQuerySchema";
import { searchStudySeriesQueryParamSchema } from "./searchStudySeriesSchema";
import { timeRangeSchema } from "./timeRangeSchema";

export const searchStudySeriesInstancesQueryParamSchema =
    searchStudySeriesQueryParamSchema.extend({
        SOPClassUID: z.string().optional(),
        [DICOM_TAG_KEYWORD_REGISTRY.SOPClassUID.tag]: z.string().optional(),

        SOPInstanceUID: z.string().optional(),
        [DICOM_TAG_KEYWORD_REGISTRY.SOPInstanceUID.tag]: z.string().optional(),

        InstanceNumber: numberQuerySchema.optional(),
        [DICOM_TAG_KEYWORD_REGISTRY.InstanceNumber.tag]:
            numberQuerySchema.optional(),

        AcquisitionDate: dateRangeSchema.optional(),
        [DICOM_TAG_KEYWORD_REGISTRY.AcquisitionDate.tag]:
            dateRangeSchema.optional(),

        AcquisitionDateTime: dateTimeRangeSchema.optional(),
        [DICOM_TAG_KEYWORD_REGISTRY.AcquisitionDateTime.tag]:
            dateTimeRangeSchema.optional(),

        ContentDate: dateRangeSchema.optional(),
        [DICOM_TAG_KEYWORD_REGISTRY.ContentDate.tag]:
            dateRangeSchema.optional(),

        ContentTime: timeRangeSchema.optional(),
        [DICOM_TAG_KEYWORD_REGISTRY.ContentTime.tag]:
            timeRangeSchema.optional(),
    });

export type SearchStudySeriesInstancesQueryParam = z.infer<typeof searchStudySeriesInstancesQueryParamSchema>;