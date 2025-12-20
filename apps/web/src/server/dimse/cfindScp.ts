import { AppDataSource } from "@brigid/database";
import { DimseConfigEntity } from "@brigid/database/src/entities/dimseConfig.entity";
import type { Attributes } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Attributes";
import Tag from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Tag";
import { UID } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/UID";
import type { Association } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/Association";
import { Commands } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/Commands";
import type { Dimse } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/Dimse";
import type { PresentationContext } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/pdu/PresentationContext";
import { Status } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/Status";
import { QueryRetrieveLevel2 } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/service/QueryRetrieveLevel2";
import { BasicModCFindSCP } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/BasicModCFindSCP";
import { type CFindSCPInjectInterface, createCFindSCPInjectProxy } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/CFindSCPInject";
import { appLogger } from "../utils/logger";
import { PATIENT_ROOT_LEVELS, PATIENT_STUDY_ONLY_LEVELS, STUDY_ROOT_LEVELS } from "./queryRetrieveLevels";
import { InstanceQueryTask } from "./queryTasks/instanceQueryTask";
import { PatientQueryTask } from "./queryTasks/patientQueryTask";
import { SeriesQueryTask } from "./queryTasks/seriesQueryTask";
import { StudyQueryTask } from "./queryTasks/studyQueryTask";

const logger = appLogger.child({
    module: "NativeCFindScp",
});

export class NativeCFindScp {
    basicModCFindSCP: BasicModCFindSCP | null = null;

    getPatientRootLevel() {
        const cFindScpInject = this.getCFindScpInjectProxy();

        this.basicModCFindSCP = new BasicModCFindSCP(
            cFindScpInject,
            UID.PatientRootQueryRetrieveInformationModelFind,
            PATIENT_ROOT_LEVELS
        );

        return this.basicModCFindSCP;
    }

    getStudyRootLevel() {
        const cFindScpInject = this.getCFindScpInjectProxy();

        this.basicModCFindSCP = new BasicModCFindSCP(
            cFindScpInject,
            UID.StudyRootQueryRetrieveInformationModelFind,
            STUDY_ROOT_LEVELS
        );

        return this.basicModCFindSCP;
    }

    getPatientStudyOnlyLevel() {
        const cFindScpInject = this.getCFindScpInjectProxy();

        this.basicModCFindSCP = new BasicModCFindSCP(
            cFindScpInject,
            UID.PatientStudyOnlyQueryRetrieveInformationModelFind,
            PATIENT_STUDY_ONLY_LEVELS
        );

        return this.basicModCFindSCP;
    }

    getCFindScpInjectProxyMethods() {
        const proxyMethods = {
            onDimseRQ: async (as: Association, pc: PresentationContext, _dimse: Dimse, rq: Attributes, key: Attributes) => {
                try {
                    const queryTask = await proxyMethods.calculateMatches(as, pc, rq, key);
                    const applicationEntity = await as.getApplicationEntity();
                    const device = await applicationEntity?.getDevice();
                    await device?.execute(queryTask);
                } catch (error) {
                    logger.error("Failed to onDimseRQ", error);
                    await as.writeDimseRSP(pc, await Commands.mkCFindRSP(rq, Status.ProcessingFailure), null);
                }
            },
            calculateMatches: async (as: Association, pc: PresentationContext, rq: Attributes, keys: Attributes) => {
                try {
                    const level = await this.basicModCFindSCP?.getQrLevel(as, pc, rq, keys);
                    if (await level?.compareTo(QueryRetrieveLevel2.PATIENT) === 0) {
                        const workspaceId = await this.getWorkspaceId(as);
                        const patientQueryTask = new PatientQueryTask(as, pc, rq, keys, workspaceId);
                        return await patientQueryTask.get();
                    } else if (await level?.compareTo(QueryRetrieveLevel2.STUDY) === 0) {
                        const workspaceId = await this.getWorkspaceId(as);
                        const studyQueryTask = new StudyQueryTask(as, pc, rq, keys, workspaceId);
                        return await studyQueryTask.get();
                    } else if (await level?.compareTo(QueryRetrieveLevel2.SERIES) === 0) {
                        const workspaceId = await this.getWorkspaceId(as);
                        const seriesQueryTask = new SeriesQueryTask(as, pc, rq, keys, workspaceId);
                        return await seriesQueryTask.get();
                    } else if (await level?.compareTo(QueryRetrieveLevel2.IMAGE) === 0) {
                        const workspaceId = await this.getWorkspaceId(as);
                        const instanceQueryTask = new InstanceQueryTask(as, pc, rq, keys, workspaceId);
                        return await instanceQueryTask.get();
                    }
                } catch (error) {
                    logger.error("Failed to calculate matches", error);
                    throw error;
                }
            }
        } as unknown as CFindSCPInjectInterface;

        return proxyMethods;
    }

    async getWorkspaceId(as: Association) {
        const aeTitle = await as.getCalledAET();

        const workspace = await AppDataSource.manager.findOne(
            DimseConfigEntity,
            {
                where: {
                    aeTitle: aeTitle ?? "",
                },  
            },
        );

        return workspace?.workspaceId ?? "";
    }

    private getCFindScpInjectProxy() {
        return createCFindSCPInjectProxy(
            this.getCFindScpInjectProxyMethods(),
            {
                keepAsDaemon: true
            }
        );
    }
}

