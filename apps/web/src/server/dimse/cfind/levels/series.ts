import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { DicomSearchSeriesQueryBuilder } from "@/server/services/qido-rs/dicomSearchSeriesQueryBuilder";
import { parseEntityDicomJson } from "../responseBuilder";
import type { CFindMatchFetcher } from "../types";

export const fetchSeriesMatch: CFindMatchFetcher = async (
    workspaceId,
    queryJson,
    offset,
) => {
    const seriesQueryBuilder = new DicomSearchSeriesQueryBuilder();
    const series = await seriesQueryBuilder.execQuery({
        workspaceId,
        ...queryJson,
        limit: 1,
        offset,
        deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
    });

    if (series.length === 0) {
        return null;
    }

    const seriesEntity = series[0];
    const study = seriesEntity.study;

    return {
        patient: study?.patient
            ? parseEntityDicomJson(study.patient.json)
            : undefined,
        study: study ? parseEntityDicomJson(study.json) : undefined,
        series: parseEntityDicomJson(seriesEntity.json),
    };
};
