import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { DicomSearchInstanceQueryBuilder } from "@/server/services/qido-rs/dicomSearchInstanceQueryBuilder";
import { parseEntityDicomJson } from "../responseBuilder";
import type { CFindMatchFetcher } from "../types";

export const fetchInstanceMatch: CFindMatchFetcher = async (
    workspaceId,
    queryJson,
    offset,
) => {
    const instanceQueryBuilder = new DicomSearchInstanceQueryBuilder();
    const instances = await instanceQueryBuilder.execQuery({
        workspaceId,
        ...queryJson,
        limit: 1,
        offset,
        deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
    });

    if (instances.length === 0) {
        return null;
    }

    const instance = instances[0];
    const series = instance.series;
    const study = series?.study;

    return {
        patient: study?.patient
            ? parseEntityDicomJson(study.patient.json)
            : undefined,
        study: study ? parseEntityDicomJson(study.json) : undefined,
        series: series ? parseEntityDicomJson(series.json) : undefined,
        instance: parseEntityDicomJson(instance.json),
    };
};
