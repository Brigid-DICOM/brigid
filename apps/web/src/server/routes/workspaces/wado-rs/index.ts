import { Hono } from "hono";
import { nanoid } from "nanoid";
import { auditDicomInstancesTransferredMiddleware } from "@/server/middlewares/audit.middleware";
import type { TransferAudit } from "@/server/services/dicom/dicomAuditFactory";
import retrieveInstanceMetadataRoute from "./metadata/retrieveInstanceMetadata.route";
import retrieveSeriesMetadataRoute from "./metadata/retrieveSeriesMetadata.route";
import retrieveStudyMetadataRoute from "./metadata/retrieveStudyMetadata.route";
import retrieveFramePixelDataRoute from "./pixelData/retrieveFramePixelData.route";
import retrieveRenderedFramesRoute from "./rendered/retrieveRenderedFrames.route";
import retrieveRenderedInstancesRoute from "./rendered/retrieveRenderedInstances.route";
import retrieveRenderedSeriesRoute from "./rendered/retrieveRenderedSeries.route";
import retrieveInstanceRoute from "./retrieveInstance.route";
import retrieveSeriesInstancesRoute from "./retrieveSeriesInstances.route";
import retrieveStudyInstancesRoute from "./retrieveStudyInstances.route";
import retrieveInstanceThumbnailRoute from "./thumbnail/retrieveInstanceThumbnail.route";
import retrieveSeriesThumbnailRoute from "./thumbnail/retrieveSeriesThumbnail.route";
import retrieveStudyThumbnailRoute from "./thumbnail/retrieveStudyThumbnail.route";

const wadoRsRoute = new Hono<{
    Variables: { transferBeginAudit: TransferAudit; rqId: string };
}>()
    .use(auditDicomInstancesTransferredMiddleware)
    .use(async (c, next) => {
        const rqId = nanoid();
        c.set("rqId", rqId);

        await next();
    })
    .route("/", retrieveStudyInstancesRoute)
    .route("/", retrieveInstanceRoute)
    .route("/", retrieveSeriesInstancesRoute)
    .route("/", retrieveFramePixelDataRoute)
    .route("/", retrieveRenderedFramesRoute)
    .route("/", retrieveRenderedInstancesRoute)
    .route("/", retrieveRenderedSeriesRoute)
    .route("/", retrieveInstanceMetadataRoute)
    .route("/", retrieveSeriesMetadataRoute)
    .route("/", retrieveStudyMetadataRoute)
    .route("/", retrieveInstanceThumbnailRoute)
    .route("/", retrieveSeriesThumbnailRoute)
    .route("/", retrieveStudyThumbnailRoute);

export default wadoRsRoute;
