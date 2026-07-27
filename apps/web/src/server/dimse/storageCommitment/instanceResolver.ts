import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { InstanceService } from "@/server/services/instance.service";

export async function instanceExistsInWorkspace(
    workspaceId: string,
    sopInstanceUid: string,
): Promise<boolean> {
    const instanceService = new InstanceService();
    const instances = await instanceService.getInstancesBySopInstanceUid(
        workspaceId,
        [sopInstanceUid],
    );

    return instances.some(
        (instance) => instance.deleteStatus === DICOM_DELETE_STATUS.ACTIVE,
    );
}
