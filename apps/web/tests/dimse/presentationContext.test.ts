import dcmjsDimse from "dcmjs-dimse";
import { describe, expect, it } from "vitest";
import {
    isQueryRetrieveMoveSopClass,
    isQueryRetrieveSopClass,
    isStorageCommitmentSopClass,
    isStorageSopClass,
    isVerificationSopClass,
    PATIENT_ROOT_QUERY_RETRIEVE_MOVE_SOP_CLASS_UID,
} from "@/server/dimse/presentationContext";

const { SopClass } = dcmjsDimse.constants;

describe("presentationContext", () => {
    it("identifies C-ECHO verification SOP class", () => {
        expect(isVerificationSopClass(SopClass.Verification)).toBe(true);
        expect(isVerificationSopClass("1.2.840.10008.5.1.4.1.1.2")).toBe(
            false,
        );
    });

    it("identifies query/retrieve SOP classes including Patient Root FIND", () => {
        expect(
            isQueryRetrieveSopClass(
                SopClass.StudyRootQueryRetrieveInformationModelFind,
            ),
        ).toBe(true);
        expect(isQueryRetrieveSopClass("1.2.840.10008.5.1.4.1.2.1.1")).toBe(
            true,
        );
        expect(isQueryRetrieveSopClass("1.2.840.10008.5.1.4.1.1.2")).toBe(
            false,
        );
    });

    it("treats standard storage SOP classes missing from dcmjs StorageClass as storage", () => {
        expect(isStorageSopClass("1.2.840.10008.5.1.4.1.1.66.4")).toBe(true);
        expect(isStorageSopClass("1.2.840.10008.5.1.4.1.1.481.3")).toBe(true);
        expect(isStorageSopClass("1.2.840.10008.5.1.4.1.1.9.1.1")).toBe(true);
    });

    it("does not treat verification or query/retrieve as storage", () => {
        expect(isStorageSopClass(SopClass.Verification)).toBe(false);
        expect(
            isStorageSopClass(
                SopClass.StudyRootQueryRetrieveInformationModelFind,
            ),
        ).toBe(false);
    });

    it("identifies query/retrieve MOVE SOP classes", () => {
        expect(
            isQueryRetrieveMoveSopClass(
                SopClass.StudyRootQueryRetrieveInformationModelMove,
            ),
        ).toBe(true);
        expect(
            isQueryRetrieveMoveSopClass(
                PATIENT_ROOT_QUERY_RETRIEVE_MOVE_SOP_CLASS_UID,
            ),
        ).toBe(true);
        expect(
            isQueryRetrieveMoveSopClass(
                SopClass.StudyRootQueryRetrieveInformationModelGet,
            ),
        ).toBe(false);
    });

    it("identifies Storage Commitment Push Model SOP class", () => {
        expect(
            isStorageCommitmentSopClass(SopClass.StorageCommitmentPushModel),
        ).toBe(true);
        expect(isStorageCommitmentSopClass(SopClass.Verification)).toBe(false);
    });
});
