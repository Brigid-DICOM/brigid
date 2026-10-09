import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import type dcmjsDimse from "dcmjs-dimse";
import { DicomSearchInstanceQueryBuilder } from "@/server/services/qido-rs/dicomSearchInstanceQueryBuilder";
import { datasetToJsonQuery } from "../cfind/datasetQuery";

const INSTANCE_QUERY_LIMIT = 1_000_000;

export async function resolveMoveInstances(
    workspaceId: string,
    identifier: dcmjsDimse.Dataset,
): Promise<InstanceEntity[]> {
    const queryJson = datasetToJsonQuery("instance", identifier);
    const instanceQueryBuilder = new DicomSearchInstanceQueryBuilder();

    return instanceQueryBuilder.execQuery({
        workspaceId,
        ...queryJson,
        limit: INSTANCE_QUERY_LIMIT,
        offset: 0,
        deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
    });
}
