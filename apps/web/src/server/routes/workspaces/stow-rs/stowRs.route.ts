import fs from "node:fs";
import { parseMultipartRequest } from "@remix-run/multipart-parser";
import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { describeRoute, validator as zValidator } from "hono-openapi";
import tmp from "tmp";
import { z } from "zod";
import { StowRsService } from "@/server/services/stowRs.service";

const stowRsRoute = new Hono()
.post(
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
                                format: "binary"
                            }
                        },
                        required: ["file"]
                    },
                    encoding: {
                        "file": {
                            contentType: "application/dicom"
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: "The DICOM instance stored successfully"
            }
        }
    }),
    zValidator("param", z.object({
        workspaceId: z.string().describe("The ID of the workspace")
    })),
    async (c) => {
        const workspaceId = c.req.param("workspaceId");

        const files: {
            originalFilename: string;
            filename: string;
        }[] = [];

        for await (const part of parseMultipartRequest(c.req.raw)) {
            const tempFile = tmp.fileSync();
            console.log("tempFile", tempFile);
            await fs.promises.writeFile(tempFile.name, part.bytes);
            files.push({
                originalFilename: part.filename || tempFile.name,
                filename: tempFile.name,
            });
        }

        const stowRsService = new StowRsService(workspaceId);
        const { message, httpStatusCode } = await stowRsService.storeDicomFiles(files);

        return c.json({
            message: message
        }, httpStatusCode as ContentfulStatusCode);
    }
);

export default stowRsRoute;