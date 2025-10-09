import {
    DICOM_DELETE_STATUS,
    DICOM_INSTANCE_AVAILABILITY
} from "@brigid/database/src/const/dicom";
import { DicomCodeSequenceEntity } from "@brigid/database/src/entities/dicomCodeSequence.entity";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { PatientEntity } from "@brigid/database/src/entities/patient.entity";
import { PersonNameEntity } from "@brigid/database/src/entities/personName.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import type { DicomPersonName, DicomTag } from "@brigid/types";
import { hashFile } from "hasha";
import { DICOM_TAG_KEYWORD_REGISTRY } from "@/server/const/dicomTagKeywordRegistry";
import {
    INSTANCE_TAGS_TO_STORE,
    PATIENT_TAGS_TO_STORE,
    SERIES_TAGS_TO_STORE,
    STUDY_TAGS_TO_STORE
} from "@/server/const/dicomTagsToStore";
import type { DicomJsonUtils } from "./dicomJsonUtils";

function extractCodeSequenceEntity(
    dicomJsonUtils: DicomJsonUtils,
    tag: string
): DicomCodeSequenceEntity | null {
    const sequence = dicomJsonUtils.getValue<DicomTag[]>(tag);
    if (!sequence || sequence.length === 0) {
        return null;
    }

    const item = sequence[0];

    const codeValue =
        item[DICOM_TAG_KEYWORD_REGISTRY.CodeValue.tag].Value?.[0] ||
        item[DICOM_TAG_KEYWORD_REGISTRY.LongCodeValue.tag].Value?.[0] ||
        item[DICOM_TAG_KEYWORD_REGISTRY.URNCodeValue.tag].Value?.[0];
    const codeMeaning =
        item[DICOM_TAG_KEYWORD_REGISTRY.CodeMeaning.tag].Value?.[0];

    if (!codeValue || !codeMeaning) {
        // 不寫入半成品，直接返回 null
        // Avoid half-baked entity; return null
        return null;
    }

    const entity = new DicomCodeSequenceEntity();
    entity.codeValue = codeValue as string;
    entity.codeMeaning = codeMeaning as string;

    const codingSchemeDesignator =
        item[DICOM_TAG_KEYWORD_REGISTRY.CodingSchemeDesignator.tag].Value?.[0];
    const codingSchemeVersion =
        item[DICOM_TAG_KEYWORD_REGISTRY.CodingSchemeVersion.tag].Value?.[0];

    if (codingSchemeDesignator) {
        entity.codingSchemeDesignator = codingSchemeDesignator as string;
    }

    if (codingSchemeVersion) {
        entity.codingSchemeVersion = codingSchemeVersion as string;
    }

    return entity;
}

// #region Patient
export const toPatientDbEntity = (
    dicomJsonUtils: DicomJsonUtils,
    workspaceId: string
) => {
    const patient = new PatientEntity();
    const dicomPatientName = dicomJsonUtils.getValue<DicomPersonName>(
        DICOM_TAG_KEYWORD_REGISTRY.PatientName.tag
    );

    if (dicomPatientName) {
        const patientName = new PersonNameEntity();
        patientName.alphabetic = dicomPatientName.Alphabetic;
        patient.patientName = patientName;
    }

    const dicomPatientId = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.PatientID.tag
    );
    if (!dicomPatientId) {
        throw new Error("Patient ID is required");
    }
    patient.dicomPatientId = dicomPatientId;

    patient.issuerOfPatientId = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.IssuerOfPatientID.tag
    );
    patient.birthDate = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.PatientBirthDate.tag
    );
    patient.birthTime = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.PatientBirthTime.tag
    );
    patient.sex = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.PatientSex.tag
    );
    patient.age = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.PatientAge.tag
    );
    patient.ethnicGroup = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.EthnicGroup.tag
    );
    patient.comment = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.PatientComments.tag
    );
    patient.json = JSON.stringify(
        dicomJsonUtils.getSelectionDicomJson([...PATIENT_TAGS_TO_STORE])
    );
    patient.workspaceId = workspaceId;

    return patient;
};

// #endregion Patient

// #region Study
export const toStudyDbEntity = (
    dicomJsonUtils: DicomJsonUtils,
    workspaceId: string,
    patientId: string
) => {
    const study = new StudyEntity();
    study.workspaceId = workspaceId;
    study.patientId = patientId;
    study.studyPath = dicomJsonUtils.getFilePath({ workspaceId });
    const dicomPatientId = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.PatientID.tag
    );
    if (!dicomPatientId) {
        throw new Error("Patient ID is required");
    }
    study.dicomPatientId = dicomPatientId;
    const characterSet = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.SpecificCharacterSet.tag
    );
    if (!characterSet) {
        throw new Error("Character set is required");
    }
    study.characterSet = characterSet;
    study.studyDate = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.StudyDate.tag
    );
    study.studyTime = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.StudyTime.tag
    );
    study.accessionNumber = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.AccessionNumber.tag
    );
    study.instanceAvailability = DICOM_INSTANCE_AVAILABILITY.UNAVAILABLE;
    study.timezoneOffsetFromUTC = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.TimezoneOffsetFromUTC.tag
    );
    study.studyDescription = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.StudyDescription.tag
    );

    const studyInstanceUid = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.StudyInstanceUID.tag
    );
    if (!studyInstanceUid) {
        throw new Error("Study instance UID is required");
    }
    study.studyInstanceUid = studyInstanceUid;
    study.studyId = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.StudyID.tag
    );
    study.numberOfStudyRelatedSeries = dicomJsonUtils.getValue<number>(
        DICOM_TAG_KEYWORD_REGISTRY.NumberOfStudyRelatedSeries.tag
    );
    study.numberOfStudyRelatedInstances = dicomJsonUtils.getValue<number>(
        DICOM_TAG_KEYWORD_REGISTRY.NumberOfStudyRelatedInstances.tag
    );
    study.json = JSON.stringify(
        dicomJsonUtils.getSelectionDicomJson([
            ...STUDY_TAGS_TO_STORE,
            ...PATIENT_TAGS_TO_STORE
        ])
    );
    study.deleteStatus = DICOM_DELETE_STATUS.ACTIVE;

    return study;
};
// #endregion Study

// #region Series

export const toSeriesDbEntity = (
    dicomJsonUtils: DicomJsonUtils,
    workspaceId: string,
    studyId: string
) => {
    const series = new SeriesEntity();

    series.localStudyId = studyId;
    series.workspaceId = workspaceId;
    series.seriesPath = dicomJsonUtils.getFilePath({ workspaceId });
    const studyInstanceUid = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.StudyInstanceUID.tag
    );
    if (!studyInstanceUid) {
        throw new Error("Study instance UID is required");
    }
    series.studyInstanceUid = studyInstanceUid;
    const seriesInstanceUid = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.SeriesInstanceUID.tag
    );
    if (!seriesInstanceUid) {
        throw new Error("Series instance UID is required");
    }
    series.seriesInstanceUid = seriesInstanceUid;
    series.seriesDate = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.SeriesDate.tag
    );
    series.seriesTime = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.SeriesTime.tag
    );
    const modality = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.Modality.tag
    );
    if (!modality) {
        throw new Error("Modality is required");
    }
    series.modality = modality;
    series.seriesDescription = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.SeriesDescription.tag
    );
    series.seriesNumber = dicomJsonUtils.getValue<number>(
        DICOM_TAG_KEYWORD_REGISTRY.SeriesNumber.tag
    );
    series.performedProcedureStepStartDate = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.PerformedProcedureStepStartDate.tag
    );
    series.performedProcedureStepStartTime = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.PerformedProcedureStepStartTime.tag
    );
    series.json = JSON.stringify(
        dicomJsonUtils.getSelectionDicomJson([
            ...SERIES_TAGS_TO_STORE,
            ...STUDY_TAGS_TO_STORE,
            ...PATIENT_TAGS_TO_STORE
        ])
    );
    series.deleteStatus = DICOM_DELETE_STATUS.ACTIVE;

    const seriesDescriptionCodeSequenceEntity = extractCodeSequenceEntity(
        dicomJsonUtils,
        DICOM_TAG_KEYWORD_REGISTRY.SeriesDescriptionCodeSequence.tag
    );
    if (seriesDescriptionCodeSequenceEntity) {
        series.seriesDescriptionCodeSequence =
            seriesDescriptionCodeSequenceEntity;
    }

    return series;
};

// #endregion Series

// #region Instance

export const toInstanceDbEntity = async (
    dicomJsonUtils: DicomJsonUtils,
    workspaceId: string,
    seriesId: string,
    storedFilePath: string
) => {
    const instance = new InstanceEntity();

    instance.instancePath = dicomJsonUtils.getFilePath({ workspaceId });
    instance.workspaceId = workspaceId;
    instance.localSeriesId = seriesId;

    const transferSyntaxUid = dicomJsonUtils.getValue<string>(
        // Transfer Syntax UID
        "00020010"
    );
    if (!transferSyntaxUid) {
        throw new Error("Transfer syntax UID is required");
    }
    instance.transferSyntaxUid = transferSyntaxUid;

    const studyInstanceUid = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.StudyInstanceUID.tag
    );
    if (!studyInstanceUid) {
        throw new Error("Study instance UID is required");
    }
    instance.studyInstanceUid = studyInstanceUid;

    const seriesInstanceUid = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.SeriesInstanceUID.tag
    );
    if (!seriesInstanceUid) {
        throw new Error("Series instance UID is required");
    }
    instance.seriesInstanceUid = seriesInstanceUid;

    const sopClassUid = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.SOPClassUID.tag
    );
    if (!sopClassUid) {
        throw new Error("SOP class UID is required");
    }
    instance.sopClassUid = sopClassUid;

    const sopInstanceUid = dicomJsonUtils.getValue<string>(
        DICOM_TAG_KEYWORD_REGISTRY.SOPInstanceUID.tag
    );
    if (!sopInstanceUid) {
        throw new Error("SOP instance UID is required");
    }
    instance.sopInstanceUid = sopInstanceUid;

    instance.acquisitionDate = dicomJsonUtils.getValue<string>(DICOM_TAG_KEYWORD_REGISTRY.AcquisitionDate.tag);
    instance.acquisitionDateTime = dicomJsonUtils.getValue<string>(DICOM_TAG_KEYWORD_REGISTRY.AcquisitionDateTime.tag);
    instance.contentDate = dicomJsonUtils.getValue<string>(DICOM_TAG_KEYWORD_REGISTRY.ContentDate.tag);
    instance.contentDateTime = dicomJsonUtils.getValue<string>(DICOM_TAG_KEYWORD_REGISTRY.ContentTime.tag);
    instance.instanceNumber = dicomJsonUtils.getValue<number>(DICOM_TAG_KEYWORD_REGISTRY.InstanceNumber.tag);
    instance.numberOfFrames = dicomJsonUtils.getValue<number>(DICOM_TAG_KEYWORD_REGISTRY.NumberOfFrames.tag);
    instance.windowCenter = dicomJsonUtils.getValue<string>(DICOM_TAG_KEYWORD_REGISTRY.WindowCenter.tag);
    instance.windowWidth = dicomJsonUtils.getValue<string>(DICOM_TAG_KEYWORD_REGISTRY.WindowWidth.tag);
    instance.completionFlag = dicomJsonUtils.getValue<string>(DICOM_TAG_KEYWORD_REGISTRY.CompletionFlag.tag);
    instance.verificationFlag = dicomJsonUtils.getValue<string>(DICOM_TAG_KEYWORD_REGISTRY.VerificationFlag.tag);
    instance.deleteStatus = DICOM_DELETE_STATUS.ACTIVE;

    const hashSum = await hashFile(storedFilePath);
    if (!hashSum) {
        throw new Error("Hash sum is required");
    }
    instance.hashSum = hashSum;

    instance.json = JSON.stringify(
        dicomJsonUtils.getSelectionDicomJson([
            ...INSTANCE_TAGS_TO_STORE,
            ...SERIES_TAGS_TO_STORE,
            ...STUDY_TAGS_TO_STORE,
            ...PATIENT_TAGS_TO_STORE
        ])
    );

    return instance;
};

// #endregion Instance
