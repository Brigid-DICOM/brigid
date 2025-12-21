import path from "node:path";
import { AppDataSource } from "@brigid/database";
import { DimseConfigEntity } from "@brigid/database/src/entities/dimseConfig.entity";
import fsE from "fs-extra";
import { File } from "raccoon-dcm4che-bridge/src/wrapper/java/io/File";
import { createAssociationListenerProxy } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/AssociationListener";
import { createCStoreSCPInjectProxy } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/CStoreSCPInject";
import { SimpleCStoreSCP } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/SimpleCStoreSCP";
import tmp from "tmp";
import { StowRsService } from "../services/stowRs.service";
import type { MultipartFile } from "../types/file";
import { appLogger } from "../utils/logger";
import { getContextKey } from "./dimseUtils";

const logger = appLogger.child({
    module: "NativeCStoreScp",
});

let scpInstance: SimpleCStoreSCP | undefined;

const cStoreScpInjectProxy = createCStoreSCPInjectProxy(
    {
        // @ts-expect-error java bridge type mismatch
        preDimseRQ: async (
            association,
            _presentationContext,
            _dimse,
            requestAttr,
        ) => {
            if (!association || !requestAttr) return;

            const contextKey = await getContextKey(association, requestAttr);
            const sourceAET = await association?.getRemoteAET();
            const sourceHost = await association?.getRemoteHostName();

            logger.info(
                `Incoming DIMSE request from ${sourceAET}@${sourceHost}`,
                {
                    op: "C-STORE",
                    contextKey,
                },
            );

            const listener = createAssociationListenerProxy(
                {
                    onClose: () => {
                        logger.info(
                            `Association (${sourceAET}@${sourceHost}) closed`,
                            {
                                op: "C-STORE",
                                contextKey,
                            },
                        );
                    },
                },
                {
                    keepAsDaemon: true,
                },
            );

            await association?.addAssociationListener(listener);

            return true;
        },
        postDimseRQ: async (
            association,
            presentationContext,
            _dimse,
            _requestAttr,
            _data,
            responseAttr,
        ) => {
            return await association?.tryWriteDimseRSP(
                presentationContext,
                responseAttr,
            );
        },
        postStore: async (
            association,
            _presentationContext,
            requestAttr,
            _data,
            _responseAttr,
            file,
        ) => {
            if (!association || !requestAttr || !file) return;

            const contextKey = await getContextKey(association, requestAttr);
            const absPath = await file?.getAbsoluteFile();
            const aeTitle = await association?.getCalledAET();
            if (!aeTitle || !absPath) return;

            const hitDimseConfig = await AppDataSource.manager.findOne(
                DimseConfigEntity,
                {
                    where: {
                        aeTitle,
                    },
                },
            );

            if (!hitDimseConfig) return;

            const stowRsService = new StowRsService(hitDimseConfig.workspaceId);

            // 轉換成給 stowRsService 使用的 MultipartFile
            const multipartFile: MultipartFile = {
                originalFilename: path.basename(absPath.toString()),
                filename: absPath.toString(),
                size: await fsE
                    .stat(absPath.toString())
                    .then((stat) => stat.size),
                mediaType: "application/dicom",
            };

            try {
                const { message } = await stowRsService.storeDicomFiles([
                    multipartFile,
                ]);

                if (message["00081198"].Value.length > 0) {
                    throw new Error(
                        `Failed to store DICOM file, ${JSON.stringify(message["00081198"].Value)}`,
                    );
                }
            } catch (error) {
                logger.error("Failed to store DICOM file", error, {
                    op: "C-STORE",
                    contextKey,
                });
                throw error;
            }
        },
    },
    {
        keepAsDaemon: true,
    },
);

export function getScpInstance() {
    if (scpInstance) {
        return scpInstance;
    }

    const tmpDir = new File(tmp.dirSync().name);

    const basicCStoreScp = new SimpleCStoreSCP(cStoreScpInjectProxy, tmpDir, [
        "*",
    ]);

    scpInstance = basicCStoreScp;
    return basicCStoreScp;
}
