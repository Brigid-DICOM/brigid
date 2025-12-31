import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import type { Context } from "hono";
import {
    EventOutcomeIndicator,
    type SOPClassDetail,
} from "@/server/services/dicom/dicomAudit";
import {
    logBeginTransferringDicomInstancesMessage,
    type TransferAudit,
} from "@/server/services/dicom/dicomAuditFactory";
import { DimseConfigService } from "../dimseConfig.service";
import { StudyService } from "../study.service";

export class DicomAuditService {
    async logTransferBegin(
        c: Context,
        params: {
            workspaceId: string;
            studyInstanceUid: string;
            instances: InstanceEntity[];
            name: string;
        },
    ): Promise<TransferAudit> {
        const { workspaceId, studyInstanceUid, instances, name } = params;

        const studyService = new StudyService();
        const study = await studyService.getStudyByUid({
            workspaceId,
            studyInstanceUid,
        });

        const patient = {
            id: study?.dicomPatientId || "",
            name: study?.patient?.patientName?.alphabetic || "",
        };

        const dimseConfigService = new DimseConfigService();
        const dimseConfig =
            await dimseConfigService.getDimseConfig(workspaceId);

        const sopClasses = instances.reduce((acc, instance) => {
            if (
                !acc.some((sopClass) => sopClass.uid === instance.sopClassUid)
            ) {
                acc.push({
                    uid: instance.sopClassUid,
                    numberOfInstances: 1,
                    instances: [instance.sopInstanceUid],
                });
            } else {
                const sopClass = acc.find(
                    (sopClass) => sopClass.uid === instance.sopClassUid,
                );
                if (sopClass?.numberOfInstances) {
                    sopClass.numberOfInstances++;
                }
            }

            return acc;
        }, [] as SOPClassDetail[]);

        const authUser = c.get("authUser");
        const userId = authUser?.user?.id || "";
        const ip =
            c.req.header("X-Forwarded-For") ||
            c.req.header("cf-connecting-ip") ||
            c.req.header("x-real-ip") ||
            "";

        const audit: TransferAudit = {
            source: {
                userId,
                ip,
                aeTitle: c.req.header("X-AE-Title") || "",
            },
            destination: {
                userId,
                ip,
                aeTitle: dimseConfig?.aeTitle || "Brigid",
            },
            studies: [
                {
                    uid: studyInstanceUid,
                    sopClasses: sopClasses,
                },
            ],
            patient,
            outcome: EventOutcomeIndicator.Success,
        };

        logBeginTransferringDicomInstancesMessage({
            name,
            ...audit,
        });

        c.set("transferBeginAudit", audit);

        return audit;
    }
}
