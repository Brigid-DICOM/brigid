import { createMiddleware } from "hono/factory";
import {
    EventActionCode,
    EventOutcomeIndicator,
} from "../services/dicom/dicomAudit";
import { logDicomInstancesTransferred } from "../services/dicom/dicomAuditFactory";

export const auditDicomInstancesTransferredMiddleware = createMiddleware(
    async (c, next) => {
        await next();
        const audit = c.get("transferBeginAudit");
        if (!audit) {
            return;
        }

        logDicomInstancesTransferred({
            name: "RetrieveStudyInstances",
            source: audit.source,
            destination: audit.destination,
            studies: audit.studies,
            patient: audit.patient,
            outcome: audit.outcome || EventOutcomeIndicator.Success,
            actionCode: EventActionCode.Read,
            requestor: audit.requestor,
        });
    },
);
