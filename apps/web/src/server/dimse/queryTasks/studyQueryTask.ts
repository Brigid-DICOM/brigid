import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import env from "@brigid/env";
import { Attributes } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Attributes";
import Common from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/common/Common";
import { createQueryTaskInjectProxy } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/QueryTaskInject";
import { StudyQueryTask as JavaStudyQueryTask } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/StudyQueryTask";
import { createStudyQueryTaskInjectProxy } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/StudyQueryTaskInject";
import { DicomSearchStudyQueryBuilder } from "@/server/services/qido-rs/dicomSearchStudyQueryBuilder";
import {
    type IPatientQueryTaskInjectProxy,
    type IPatientTaskForInject,
    type IPatientTaskForIterator,
    type IProxy,
    PatientQueryTask,
} from "./patientQueryTask";
import { attributesToToJsonQuery } from "./queryUtils";

export interface IStudyTaskForIterator extends IPatientTaskForIterator {
    studyAttr: Attributes | null;
    studyQueryTaskInjectProxy: IStudyQueryTaskInjectProxy | null;
}

export interface IStudyTaskForInject extends IPatientTaskForInject {
    studyAttr: Attributes | null;
    studyJson: Record<string, unknown> | null;
    patientQueryTaskInjectProxy: IPatientQueryTaskInjectProxy | null;
}

export interface IStudyQueryTaskInjectProxy extends IProxy {
    wrappedFindNextStudy(): Promise<void>;
    findNextStudy(): Promise<boolean>;
}

export class StudyQueryTask
    extends PatientQueryTask
    implements IStudyTaskForIterator, IStudyTaskForInject
{
    studyJson: Record<string, unknown> | null = null;
    studyAttr: Attributes | null = null;
    studyQueryTaskInjectProxy: StudyQueryTaskInjectProxy | null = null;
    queryTaskInjectProxy: IProxy | null = null;

    async get(): Promise<JavaStudyQueryTask> {
        const studyQueryTask = await JavaStudyQueryTask.newInstanceAsync(
            this.as,
            this.pc,
            this.rq,
            this.keys,
            this.getQueryTaskInjectProxy(),
            this.getPatientQueryTaskInjectProxy(),
            this.getStudyQueryTaskInjectProxy(),
        );
        this.offset = 0;
        await this.studyQueryTaskInjectProxy?.wrappedFindNextStudy();

        return studyQueryTask;
    }

    getQueryTaskInjectProxy() {
        if (!this.queryTaskInjectProxy) {
            this.queryTaskInjectProxy = this.createQueryTaskInjectProxy();
        }

        return this.queryTaskInjectProxy.get();
    }

    getStudyQueryTaskInjectProxy() {
        if (!this.studyQueryTaskInjectProxy) {
            this.studyQueryTaskInjectProxy = new StudyQueryTaskInjectProxy(
                this,
            );
        }

        return this.studyQueryTaskInjectProxy.get();
    }

    protected override createQueryTaskInjectProxy(): IProxy {
        return new StudyMatchIteratorProxy(this);
    }
}

class StudyQueryTaskInjectProxy {
    constructor(private studyQueryTask: StudyQueryTask) {}

    get() {
        return createStudyQueryTaskInjectProxy(
            {
                wrappedFindNextStudy: this.wrappedFindNextStudy.bind(this),
                // @ts-expect-error - java bridge 可以接受 Promise<boolean>
                findNextStudy: this.findNextStudy.bind(this),
                getStudy: this.getStudy.bind(this),
            },
            {
                keepAsDaemon: true,
            },
        );
    }

    async wrappedFindNextStudy() {
        await this.findNextStudy();
    }

    async getStudy() {
        const queryAttr = this.studyQueryTask.getKeys();
        if (queryAttr !== null) {
            const queryJson = await attributesToToJsonQuery("study", queryAttr);

            const studyQueryBuilder = new DicomSearchStudyQueryBuilder();
            const studies = await studyQueryBuilder.execQuery({
                workspaceId: this.studyQueryTask.getWorkspaceId(),
                ...queryJson,
                limit: 1,
                offset: this.studyQueryTask.offset++,
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            });

            if (studies.length > 0) {
                this.studyQueryTask.studyJson = JSON.parse(studies[0].json);
                this.studyQueryTask.studyAttr =
                    await Common.getAttributesFromJsonString(studies[0].json);

                if (studies[0].patient?.json) {
                    this.studyQueryTask.patientAttr =
                        await Common.getAttributesFromJsonString(
                            studies[0].patient.json,
                        );
                }
            } else {
                this.studyQueryTask.studyAttr = null;
                this.studyQueryTask.studyJson = null;
            }
        }

        if (this.studyQueryTask.offset === env.QUERY_MAX_LIMIT + 1) {
            this.studyQueryTask.studyAttr = null;
            this.studyQueryTask.studyJson = null;
        }
    }

    async findNextStudy() {
        await this.getStudy();

        return this.studyQueryTask.studyAttr !== null;
    }
}

class StudyMatchIteratorProxy {
    private opCount: number = 0;

    constructor(private studyQueryTask: StudyQueryTask) {}

    get() {
        return createQueryTaskInjectProxy(
            {
                hasMoreMatches: () => {
                    this.opCount++;
                    if (this.opCount > env.QUERY_MAX_LIMIT) {
                        return false;
                    }

                    const hasMoreMatches =
                        this.studyQueryTask.studyAttr !== null;

                    if (!hasMoreMatches) {
                        this.studyQueryTask.reset();
                    }

                    return hasMoreMatches;
                },
                // @ts-expect-error - java bridge 可以接受 Promise<Attributes>
                nextMatch: async () => {
                    const patientAttrSize =
                        (await this.studyQueryTask.patientAttr?.size()) || 0;
                    const studyAttrSize =
                        (await this.studyQueryTask.studyAttr?.size()) || 0;

                    const returnAttr = await Attributes.newInstanceAsync(
                        patientAttrSize + studyAttrSize,
                    );

                    await Attributes.unifyCharacterSets([
                        this.studyQueryTask.patientAttr,
                        this.studyQueryTask.studyAttr,
                    ]);

                    await returnAttr.addAll(this.studyQueryTask.patientAttr);
                    await returnAttr.addAll(this.studyQueryTask.studyAttr);

                    await this.studyQueryTask.studyQueryTaskInjectProxy?.wrappedFindNextStudy();

                    return returnAttr;
                },
                // @ts-expect-error - java bridge 可以接受 Promise<Attributes>
                adjust: async (match) => {
                    return await this.studyQueryTask.patientAdjust(match);
                },
            },
            {
                keepAsDaemon: true,
            },
        );
    }
}
