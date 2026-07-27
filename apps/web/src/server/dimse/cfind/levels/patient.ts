import { DicomSearchPatientQueryBuilder } from "@/server/services/qido-rs/dicomSearchPatientQueryBuilder";
import { parseEntityDicomJson } from "../responseBuilder";
import type { CFindMatchFetcher } from "../types";

export const fetchPatientMatch: CFindMatchFetcher = async (
    workspaceId,
    queryJson,
    offset,
) => {
    const patientQueryBuilder = new DicomSearchPatientQueryBuilder();
    const patients = await patientQueryBuilder.execQuery({
        workspaceId,
        ...queryJson,
        limit: 1,
        offset,
    });

    if (patients.length === 0) {
        return null;
    }

    return {
        patient: parseEntityDicomJson(patients[0].json),
    };
};
