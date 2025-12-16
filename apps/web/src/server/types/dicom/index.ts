import { z } from "zod";

const DicomPersonNameSchema = z.object({
    Alphabetic: z.string(),
    Ideographic: z.string().optional(),
    Phonetic: z.string().optional(),
});

const DicomElementSchema = z.object({
    vr: z.string(),
    Value: z.union([
        z.array(z.string()),
        z.array(z.number()),
        z.array(z.lazy(() => DicomTagSchema)),
        z.array(DicomPersonNameSchema),
    ]),
});

const DicomTagSchema: z.ZodType<Record<string, any>> = z.record(
    z.string(),
    z.lazy(() => DicomElementSchema),
);

// #region SOP Instance Reference

const ReferencedSopClassUidSchema = z.object({
    vr: z.literal("UI"),
    Value: z.array(z.string()),
});

const ReferencedSopInstanceUidSchema = z.object({
    vr: z.literal("UI"),
    Value: z.array(z.string()),
});

const SopInstanceReferenceSchema = z.object({
    "00081150": ReferencedSopClassUidSchema,
    "00081155": ReferencedSopInstanceUidSchema,
});

// #endregion SOP Instance Reference

// #region Failed SOP Sequence & Other Failure Reason

const FailedSopSequenceElementSchema = SopInstanceReferenceSchema.extend({
    "00081197": z.object({
        vr: z.literal("US"),
        Value: z.array(z.string()).optional(),
    }),
});

const OtherFailureReasonSchema = z.object({
    "00081197": z.object({
        vr: z.literal("US"),
        Value: z.array(z.string()).optional(),
    }),
});

// #endregion Failed SOP Sequence & Other Failure Reason

// #region STOW-RS Response Message Schema
export const StowRsResponseMessageSchema = z.object({
    "00081190": z.object({
        vr: z.literal("UR"),
        Value: z.array(z.string()),
    }),

    "00081198": z.object({
        vr: z.literal("SQ"),
        Value: z.array(FailedSopSequenceElementSchema),
    }),

    "00081199": z.object({
        vr: z.literal("SQ"),
        Value: z.array(SopInstanceReferenceSchema),
    }),

    "0008119A": z.object({
        vr: z.literal("SQ"),
        Value: z.array(OtherFailureReasonSchema),
    }),
});
// #endregion STOW-RS Response Message Schema

export type StowRsResponseMessageType = z.infer<
    typeof StowRsResponseMessageSchema
>;
