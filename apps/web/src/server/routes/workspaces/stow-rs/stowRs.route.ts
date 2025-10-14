import path from "node:path";
import { parseMultipartRequest } from "@remix-run/multipart-parser";
import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { describeRoute, resolver, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { verifyWorkspaceExists } from "@/server/middlewares/workspace.middleware";
import { StowRsService } from "@/server/services/stowRs.service";
import { StowRsResponseMessageSchema } from "@/server/types/dicom";
import type { MultipartFile } from "@/server/types/file";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "StowRsRoute",
});

const stowRsRoute = new Hono().post(
    "/workspaces/:workspaceId/studies",
    describeRoute({
        description: `Store DICOM instance (STOW-RS), ref: [Store Transaction](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.5)}`,
        tags: ["STOW-RS"],
        requestBody: {
            content: {
                "multipart/related": {
                    schema: {
                        type: "object",
                        description: "binary dicom file",
                        properties: {
                            file: {
                                type: "string",
                                format: "binary",
                            },
                        },
                        required: ["file"],
                    },
                    encoding: {
                        file: {
                            contentType: "application/dicom",
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description: "The DICOM instance stored successfully",
                content: {
                    "application/json": {
                        schema: resolver(StowRsResponseMessageSchema),
                    },
                },
            },
        },
    }),
    verifyWorkspaceExists,
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
        }),
    ),
    async (c) => {
        const workspaceId = c.req.param("workspaceId");

        const files: MultipartFile[] = [];

        for await (const part of parseMultipartRequest(c.req.raw, {
            maxFileSize: 6 * 1024 * 1024 * 1024,
        })) {
            if (!part.filename) {
                throw new Error("File name is required");
            }

            files.push({
                originalFilename:
                    part.originalFilename || path.basename(part.filename),
                filename: part.filename,
                size: part.size,
                mediaType: part.mediaType || "application/dicom",
            });
        }

        const stowRsService = new StowRsService(workspaceId);
        try {
            const { message, httpStatusCode } =
                await stowRsService.storeDicomFiles(files);
            return c.json(message, httpStatusCode as ContentfulStatusCode);
        } catch (error) {
            logger.error("Failed to store DICOM file", error);
            return c.json(
                {
                    message: "Failed to store DICOM file",
                    ok: false,
                },
                500,
            );
        }
    },
);

export default stowRsRoute;
