import { createWriteStream } from "node:fs";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { AppDataSource } from "@brigid/database";
import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { DimseAllowedRemoteEntity } from "@brigid/database/src/entities/dimseAllowedRemote.entity";
import { importClass } from "java-bridge";
import { nanoid } from "nanoid";
import File from "raccoon-dcm4che-bridge/src/wrapper/java/io/File";
import type { Attributes } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Attributes";
import { Tag } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Tag";
import { UID } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/UID";
import type { Association } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/Association";
import { createAssociationListenerProxy } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/AssociationListener";
import { Commands } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/Commands";
import { Connection } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/Connection";
import { Dimse } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/Dimse";
import { AAssociateRQ } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/pdu/AAssociateRQ";
import type { PresentationContext } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/pdu/PresentationContext";
import { Status } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/Status";
import { InstanceLocator } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/service/InstanceLocator";
import { createRetrieveAuditInjectProxy } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/dcmqrscp/RetrieveAuditInject";
import { RetrieveTaskImpl } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/dcmqrscp/RetrieveTaskImpl";
import {
    type CMoveSCPInjectInterface,
    createCMoveSCPInjectProxy,
} from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/CMoveSCPInject";
import { SimpleCMoveSCP } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/SimpleCMoveSCP";
import tmp from "tmp";
import { DicomSearchInstanceQueryBuilder } from "../services/qido-rs/dicomSearchInstanceQueryBuilder";
import { appLogger } from "../utils/logger";
import { getStorageProvider } from "../utils/storage/storageFactory";
import { getContextKey, getWorkspaceIdFromAssociation } from "./dimseUtils";
import {
    PATIENT_ROOT_LEVELS,
    PATIENT_STUDY_ONLY_LEVELS,
    STUDY_ROOT_LEVELS,
} from "./queryRetrieveLevels";
import { attributesToToJsonQuery } from "./queryTasks/queryUtils";

const logger = appLogger.child({
    module: "NativeCMoveScp",
});

export class NativeCMoveScp {
    getPatientRootLevel() {
        return new SimpleCMoveSCP(
            this.getCMoveScpInjectProxy(),
            UID.PatientRootQueryRetrieveInformationModelMove,
            PATIENT_ROOT_LEVELS,
        );
    }

    getStudyRootLevel() {
        return new SimpleCMoveSCP(
            this.getCMoveScpInjectProxy(),
            UID.StudyRootQueryRetrieveInformationModelMove,
            STUDY_ROOT_LEVELS,
        );
    }

    getPatientStudyOnlyLevel() {
        return new SimpleCMoveSCP(
            this.getCMoveScpInjectProxy(),
            UID.PatientRootQueryRetrieveInformationModelMove,
            PATIENT_STUDY_ONLY_LEVELS,
        );
    }

    getCMoveScpInjectProxy() {
        return createCMoveSCPInjectProxy(this.getCMoveScpInjectProxyMethods(), {
            keepAsDaemon: true,
        });
    }

    getCMoveScpInjectProxyMethods() {
        const proxyMethods: CMoveSCPInjectInterface = {
            // @ts-expect-error java bridge can handle it
            calculateMatches: async (
                as: Association | null,
                pc: PresentationContext | null,
                rq: Attributes | null,
                keys: Attributes | null,
            ) => {
                if (!as || !pc || !rq || !keys) {
                    throw new Error("Invalid arguments");
                }

                const aeTitle = await as.getCalledAET();
                const moveDestAeTitle = await rq.getString(Tag.MoveDestination);
                if (!moveDestAeTitle) {
                    logger.error(`Missing MoveDestination in C-MOVE request`);
                    return await as.tryWriteDimseRSP(
                        pc,
                        await Commands.mkCMoveRSP(
                            rq,
                            Status.MoveDestinationUnknown,
                        ),
                    );
                }

                const allowedRemote = await AppDataSource.manager.findOne(
                    DimseAllowedRemoteEntity,
                    {
                        where: {
                            aeTitle: moveDestAeTitle,
                            dimseConfig: {
                                aeTitle: aeTitle ?? "",
                            },
                        },
                        relations: {
                            dimseConfig: true,
                        },
                    },
                );

                if (!allowedRemote) {
                    logger.error(
                        `No allowed remotes found for ${moveDestAeTitle}`,
                    );
                    return await as.tryWriteDimseRSP(
                        pc,
                        await Commands.mkCMoveRSP(
                            rq,
                            Status.MoveDestinationUnknown,
                        ),
                    );
                }

                const sourceAET = await as.getCallingAET();
                const sourceHost = await as.getRemoteHostName();
                const socket = await as.getSocket();
                const sourcePort = await socket?.getPort();

                logger.info(
                    `C-MOVE request from ${sourceAET}@${sourceHost}:${sourcePort} to ${moveDestAeTitle}@${allowedRemote.host}:${allowedRemote.port}`,
                    {
                        op: "C-MOVE",
                        contextKey: await getContextKey(as, rq),
                    },
                );

                let asListener = createAssociationListenerProxy(
                    {
                        onClose: async () => {
                            logger.info(
                                `Association (${sourceAET}@${sourceHost}:${sourcePort}) closed`,
                                {
                                    op: "C-MOVE",
                                    contextKey: await getContextKey(as, rq),
                                },
                            );
                            // @ts-expect-error 讓 asListener 被 GC
                            asListener = undefined;
                        },
                    },
                    {
                        keepAsDaemon: true,
                    },
                );
                await as.addAssociationListener(asListener);

                try {
                    const workspaceId = await getWorkspaceIdFromAssociation(as);
                    const instanceLocators = await this.getJavaInstanceLocators(
                        workspaceId,
                        keys,
                    );

                    if (instanceLocators.length === 0) {
                        return await as.tryWriteDimseRSP(
                            pc,
                            await Commands.mkCMoveRSP(
                                rq,
                                Status.NoSuchObjectInstance,
                            ),
                        );
                    }

                    const aAssociateRQ = await this.makeAAssociateRQ(
                        sourceAET ?? "",
                        moveDestAeTitle,
                        instanceLocators,
                    );
                    const remoteConn = new Connection();
                    await remoteConn.setHostname(allowedRemote.host);
                    await remoteConn.setPort(allowedRemote.port);
                    // TODO: TLS Cipher configuration

                    const storeAssociation = await this.openStoreAssociation(
                        as,
                        remoteConn,
                        aAssociateRQ,
                    );
                    const auditInject = await this.getAuditInjectProxy();

                    const retrieveTask = new RetrieveTaskImpl(
                        Dimse.C_MOVE_RQ,
                        as,
                        pc,
                        rq,
                        // 因為沒有把 ArrayList 的 definition 給 export 出來，所以用 any 代替
                        instanceLocators as any,
                        storeAssociation as Association,
                        false,
                        0,
                        auditInject,
                    );
                    await retrieveTask.setSendPendingRSPInterval(0);
                    return retrieveTask;
                } catch (error) {
                    logger.error("Failed to calculate matches", error);
                    throw error;
                }
            },
        };

        return proxyMethods;
    }

    private async getJavaInstanceLocators(
        workspaceId: string,
        keys: Attributes,
    ) {
        const queryKey = await attributesToToJsonQuery("instance", keys);

        const instanceQueryBuilder = new DicomSearchInstanceQueryBuilder();
        const instances = await instanceQueryBuilder.execQuery({
            workspaceId,
            ...queryKey,
            // 在 C-MOVE，至少要有 patient id 的 query，且 c move 是一次性傳送影像的動作，所以一次撈取大量資料直接送回
            // 不過在一些情境當中，難免會遇到 timeout 的問題，正常還是建議先進行 C-FIND 查詢
            // 再加入 UID 層級的查詢 (e.g. StudyInstanceUID, SeriesInstanceUID, SOPInstanceUID)
            limit: 1_000_000,
            offset: 0,
            deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
        });

        const JArrayList = importClass("java.util.ArrayList");
        const instanceLocators = await JArrayList.newInstanceAsync();
        const storage = getStorageProvider();
        const workDir = tmp.dirSync().name;
        const destFile = join(workDir, `${nanoid()}.dcm`);

        for (const instance of instances) {
            const key = instance.instancePath;
            const { body } = await storage.downloadFile(key);
            await pipeline(body, createWriteStream(destFile));
            const instanceJFile = new File(destFile);
            const fileUri = await instanceJFile.toURI();

            const instanceLocator = new InstanceLocator(
                instance.sopClassUid,
                instance.sopInstanceUid,
                instance.transferSyntaxUid,
                fileUri?.toString() ?? null,
            );

            await instanceLocators.add(instanceLocator);
        }

        return instanceLocators;
    }

    private async makeAAssociateRQ(
        callingAET: string,
        calledAET: string,
        matches: any,
    ) {
        const aAssociateRQ = new AAssociateRQ();
        await aAssociateRQ.setCallingAET(callingAET);
        await aAssociateRQ.setCalledAET(calledAET);

        const matchesArray = (await matches.toArray()) as InstanceLocator[];
        for (const match of matchesArray) {
            if (
                await aAssociateRQ.addPresentationContextFor(
                    match.cuid,
                    match.tsuid,
                )
            ) {
                if (UID.ExplicitVRLittleEndian !== match.tsuid) {
                    await aAssociateRQ.addPresentationContextFor(
                        match.cuid,
                        UID.ExplicitVRLittleEndian,
                    );
                }

                if (UID.ImplicitVRLittleEndian !== match.tsuid) {
                    await aAssociateRQ.addPresentationContextFor(
                        match.cuid,
                        UID.ImplicitVRLittleEndian,
                    );
                }
            }
        }

        return aAssociateRQ;
    }

    private async openStoreAssociation(
        association: Association,
        remoteConn: Connection,
        aAssociateRQ: AAssociateRQ,
    ) {
        try {
            const applicationEntity = await association.getApplicationEntity();

            return await applicationEntity?.connect(
                await association.getConnection(),
                remoteConn,
                aAssociateRQ,
            );
        } catch (error) {
            logger.error("Failed to open store association", error);
            throw new Error("Failed to open store association");
        }
    }

    private async getAuditInjectProxy() {
        const dimseRetrieveAuditInject = createRetrieveAuditInjectProxy(
            {
                onBeginTransferringDICOMInstances: async (studyUID) => {
                    logger.info(
                        `Begin transferring DICOM instances for study ${studyUID}`,
                        {
                            op: "C-MOVE",
                        },
                    );
                },
                onDicomInstancesTransferred: async (studyUID) => {
                    logger.info(
                        `DICOM instances transferred for study ${studyUID}`,
                        {
                            op: "C-MOVE",
                        },
                    );
                },
                setEventResult: async (eventResult) => {
                    logger.info(`Event result: ${eventResult}`, {
                        op: "C-MOVE",
                    });
                },
            },
            {
                keepAsDaemon: true,
            },
        );

        return dimseRetrieveAuditInject;
    }
}
