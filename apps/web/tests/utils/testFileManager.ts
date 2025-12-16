import { createReadStream } from "node:fs";
import { app } from "@/app/api/[...route]/route";
import multipartMessage from "@/server/utils/multipartMessage";
import { WORKSPACE_ID } from "../backend/workspace.const";

export class TestFileManager {
    async uploadTestFile(filename: string) {
        const { data, boundary } = multipartMessage.multipartEncodeByStream(
            [
                {
                    stream: createReadStream(filename),
                },
            ],
            undefined,
            "application/dicom",
        );

        const response = await app.request(
            `/api/workspaces/${WORKSPACE_ID}/studies`,
            {
                method: "POST",
                // @ts-expect-error
                body: data,
                headers: new Headers({
                    "Content-Type": `multipart/related; boundary=${boundary}`,
                }),
                duplex: "half",
            },
        );

        return response;
    }
}
