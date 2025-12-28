import { Hono } from "hono";
import { nanoid } from "nanoid";
import { EventOutcomeIndicator } from "@/server/services/dicom/dicomAudit";
import { logQueryMessage } from "@/server/services/dicom/dicomAuditFactory";
import searchInstancesRoute from "./searchInstances.route";
import searchSeriesRoute from "./searchSeries.route";
import searchStudiesRoute from "./searchStudies.route";
import searchStudySeriesRoute from "./searchStudySeries.route";
import searchStudySeriesInstancesRoute from "./searchStudySeriesInstances.route";

const qidoRsRoute = new Hono<{
    Variables: { rqId: string };
}>()
.use(async (c, next) => {
    const { UID } = await import("raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/UID");
    const ip = c.req.header("X-Forwarded-For") || c.req.header("cf-connecting-ip") || c.req.header("x-real-ip") || "";
    const userId = c.get("authUser")?.user?.id || "";

    logQueryMessage({
        source: {
            userId: "Brigid",
            ip: "127.0.0.1",
        },
        destination: {
            userId,
            ip,
        },
        sopClassUid: UID.StudyRootQueryRetrieveInformationModelFind || "",
        queryPayload: JSON.stringify(c.req.query()),
        outcome: EventOutcomeIndicator.Success,
        requestor: {
            userId,
            ip,
        },
    });
    
    await next();
})
.use(async (c, next) => {
    const rqId = nanoid();
    c.set("rqId", rqId);

    await next();
})
.route("/", searchStudiesRoute)
.route("/", searchStudySeriesRoute)
.route("/", searchStudySeriesInstancesRoute)
.route("/", searchSeriesRoute)
.route("/", searchInstancesRoute)

export default qidoRsRoute;