import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { DicomSearchStudyQueryBuilder } from "@/server/services/qido-rs/dicomSearchStudyQueryBuilder";
import { parseEntityDicomJson } from "../responseBuilder";
import type { CFindMatchFetcher } from "../types";

export const fetchStudyMatch: CFindMatchFetcher = async (
    workspaceId,
    queryJson,
    offset,
) => {
    const studyQueryBuilder = new DicomSearchStudyQueryBuilder();
    const studies = await studyQueryBuilder.execQuery({
        workspaceId,
        ...queryJson,
        limit: 1,
        offset,
        deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
    });

    if (studies.length === 0) {
        return null;
    }

    const study = studies[0];

    return {
        patient: study.patient
            ? parseEntityDicomJson(study.patient.json)
            : undefined,
        study: parseEntityDicomJson(study.json),
    };
};
