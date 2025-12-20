import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import env from "@brigid/env";
import { Attributes } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Attributes";
import Common from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/common/Common";
import { InstanceQueryTask as JavaInstanceQueryTask } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/InstanceQueryTask";
import { createInstanceQueryTaskInjectProxy } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/InstanceQueryTaskInject";
import { createQueryTaskInjectProxy } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/QueryTaskInject";
import { DicomSearchInstanceQueryBuilder } from "@/server/services/qido-rs/dicomSearchInstanceQueryBuilder";
import type { IProxy } from "./patientQueryTask";
import { attributesToToJsonQuery } from "./queryUtils";
import {
    type ISeriesQueryTaskInjectProxy,
    type ISeriesTaskForInject,
    type ISeriesTaskForIterator,
    SeriesQueryTask,
} from "./seriesQueryTask";

interface IInstanceTaskForIterator extends ISeriesTaskForIterator {
    instanceAttr: Attributes | null;
    instanceQueryTaskInjectProxy: IInstanceQueryTaskInjectProxy | null;
}

interface IInstanceTaskForInject extends ISeriesTaskForInject {
    instanceAttr: Attributes | null;
    instanceJson: Record<string, unknown> | null;
    seriesQueryTaskInjectProxy: ISeriesQueryTaskInjectProxy | null;
}

interface IInstanceQueryTaskInjectProxy extends IProxy {
    wrappedFindNextInstance(): Promise<void>;
    findNextInstance(): Promise<boolean>;
}

export class InstanceQueryTask
    extends SeriesQueryTask
    implements IInstanceTaskForIterator, IInstanceTaskForInject
{
    instanceJson: Record<string, unknown> | null = null;
    instanceAttr: Attributes | null = null;
    instanceQueryTaskInjectProxy: InstanceQueryTaskInjectProxy | null = null;
    queryTaskInjectProxy: IProxy | null = null;

    async get(): Promise<JavaInstanceQueryTask> {
        const instanceQueryTask = await JavaInstanceQueryTask.newInstanceAsync(
            this.as,
            this.pc,
            this.rq,
            this.keys,
            this.getQueryTaskInjectProxy(),
            this.getPatientQueryTaskInjectProxy(),
            this.getStudyQueryTaskInjectProxy(),
            this.getSeriesQueryTaskInjectProxy(),
            this.getInstanceQueryTaskInjectProxy(),
        );

        await super.get();
        await this.instanceQueryTaskInjectProxy?.wrappedFindNextInstance();

        return instanceQueryTask;
    }

    getQueryTaskInjectProxy() {
        if (!this.queryTaskInjectProxy) {
            this.queryTaskInjectProxy = this.createQueryTaskInjectProxy();
        }

        return this.queryTaskInjectProxy.get();
    }

    getInstanceQueryTaskInjectProxy() {
        if (!this.instanceQueryTaskInjectProxy) {
            this.instanceQueryTaskInjectProxy =
                new InstanceQueryTaskInjectProxy(this);
        }

        return this.instanceQueryTaskInjectProxy.get();
    }

    async reset() {
        await super.reset();
        this.instanceAttr = null;
        this.instanceJson = null;
    }

    protected createQueryTaskInjectProxy(): IProxy {
        return new InstanceMatchIteratorProxy(this);
    }
}

class InstanceQueryTaskInjectProxy {
    constructor(private instanceQueryTask: InstanceQueryTask) {}

    get() {
        return createInstanceQueryTaskInjectProxy(
            {
                wrappedFindNextInstance:
                    this.wrappedFindNextInstance.bind(this),
                // @ts-expect-error - java bridge 可以接受 Promise<boolean>
                findNextInstance: this.findNextInstance.bind(this),
                getInstance: this.getInstance.bind(this),
            },
            {
                keepAsDaemon: true,
            },
        );
    }

    async wrappedFindNextInstance() {
        await this.findNextInstance();
    }

    async getInstance() {
        const queryAttr = this.instanceQueryTask.getKeys();
        if (queryAttr !== null) {
            const queryJson = await attributesToToJsonQuery(
                "instance",
                queryAttr,
            );

            const instanceQueryBuilder = new DicomSearchInstanceQueryBuilder();
            const instances = await instanceQueryBuilder.execQuery({
                workspaceId: this.instanceQueryTask.getWorkspaceId(),
                ...queryJson,
                limit: 1,
                offset: this.instanceQueryTask.offset++,
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            });

            if (instances.length > 0) {
                this.instanceQueryTask.instanceJson = JSON.parse(
                    instances[0].json,
                );
                this.instanceQueryTask.instanceAttr =
                    await Common.getAttributesFromJsonString(instances[0].json);
                
                if (instances[0].series?.json) {
                    this.instanceQueryTask.seriesAttr =
                        await Common.getAttributesFromJsonString(
                            instances[0].series.json,
                        );
                }
                if (instances[0].series?.study?.json) {
                    this.instanceQueryTask.studyAttr =
                        await Common.getAttributesFromJsonString(
                            instances[0].series.study.json,
                        );
                }

                if (instances[0].series?.study?.patient?.json) {
                    this.instanceQueryTask.patientAttr =
                        await Common.getAttributesFromJsonString(
                            instances[0].series.study.patient.json,
                        );
                }
            } else {
                this.instanceQueryTask.instanceAttr = null;
                this.instanceQueryTask.instanceJson = null;
            }
        }

        if (this.instanceQueryTask.offset === env.QUERY_MAX_LIMIT + 1) {
            this.instanceQueryTask.instanceAttr = null;
        }
    }

    async findNextInstance() {
        await this.getInstance();

        return this.instanceQueryTask.instanceAttr !== null;
    }
}

class InstanceMatchIteratorProxy {
    private opCount: number = 0;
    private instanceQueryTask: IInstanceTaskForIterator;

    constructor(instanceQueryTask: IInstanceTaskForIterator) {
        this.instanceQueryTask = instanceQueryTask;
    }

    get() {
        return createQueryTaskInjectProxy(
            {
                hasMoreMatches: () => {
                    this.opCount++;
                    if (this.opCount > env.QUERY_MAX_LIMIT) {
                        return false;
                    }

                    const hasMoreMatches =
                        this.instanceQueryTask.instanceAttr !== null;

                    if (!hasMoreMatches) {
                        this.instanceQueryTask.reset();
                    }

                    return !!hasMoreMatches;
                },
                // @ts-expect-error - java bridge 可以接受 Promise<Attributes>
                nextMatch: async () => {
                    const patientAttrSize =
                        (await this.instanceQueryTask.patientAttr?.size()) || 0;
                    const studyAttrSize =
                        (await this.instanceQueryTask.studyAttr?.size()) || 0;
                    const seriesAttrSize =
                        (await this.instanceQueryTask.seriesAttr?.size()) || 0;
                    const instanceAttrSize =
                        (await this.instanceQueryTask.instanceAttr?.size()) ||
                        0;

                    const returnAttr = await Attributes.newInstanceAsync(
                        patientAttrSize +
                            studyAttrSize +
                            seriesAttrSize +
                            instanceAttrSize,
                    );

                    await Attributes.unifyCharacterSets([
                        this.instanceQueryTask.patientAttr,
                        this.instanceQueryTask.studyAttr,
                        this.instanceQueryTask.seriesAttr,
                        this.instanceQueryTask.instanceAttr,
                    ]);

                    await returnAttr.addAll(this.instanceQueryTask.patientAttr);
                    await returnAttr.addAll(this.instanceQueryTask.studyAttr);
                    await returnAttr.addAll(this.instanceQueryTask.seriesAttr);
                    await returnAttr.addAll(
                        this.instanceQueryTask.instanceAttr,
                    );

                    await this.instanceQueryTask.instanceQueryTaskInjectProxy?.wrappedFindNextInstance();

                    return returnAttr;
                },
                // @ts-expect-error - java bridge 可以接受 Promise<Attributes>
                adjust: async (match) => {
                    return await this.instanceQueryTask.patientAdjust(match);
                },
            },
            {
                keepAsDaemon: true,
            },
        );
    }
}
