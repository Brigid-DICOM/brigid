import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import env from "@brigid/env";
import { Attributes } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Attributes";
import Common from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/common/Common";
import { createQueryTaskInjectProxy } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/QueryTaskInject";
import { SeriesQueryTask as JavaSeriesQueryTask } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/SeriesQueryTask";
import { createSeriesQueryTaskInjectProxy } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/SeriesQueryTaskInject";
import { DicomSearchSeriesQueryBuilder } from "@/server/services/qido-rs/dicomSearchSeriesQueryBuilder";
import type { IProxy } from "./patientQueryTask";
import { attributesToToJsonQuery } from "./queryUtils";
import {
    type IStudyQueryTaskInjectProxy,
    type IStudyTaskForInject,
    type IStudyTaskForIterator,
    StudyQueryTask,
} from "./studyQueryTask";

export interface ISeriesTaskForIterator extends IStudyTaskForIterator {
    seriesAttr: Attributes | null;
    seriesQueryTaskInjectProxy: ISeriesQueryTaskInjectProxy | null;
}

export interface ISeriesTaskForInject extends IStudyTaskForInject {
    seriesAttr: Attributes | null;
    seriesJson: Record<string, unknown> | null;
    studyQueryTaskInjectProxy: IStudyQueryTaskInjectProxy | null;
}

export interface ISeriesQueryTaskInjectProxy extends IProxy {
    wrappedFindNextSeries(): Promise<void>;
    findNextSeries(): Promise<boolean>;
}

export class SeriesQueryTask
    extends StudyQueryTask
    implements ISeriesTaskForIterator, ISeriesTaskForInject
{
    seriesJson: Record<string, unknown> | null = null;
    seriesAttr: Attributes | null = null;
    seriesQueryTaskInjectProxy: SeriesQueryTaskInjectProxy | null = null;
    queryTaskInjectProxy: IProxy | null = null;

    async get(): Promise<JavaSeriesQueryTask> {
        const seriesQueryTask = await JavaSeriesQueryTask.newInstanceAsync(
            this.as,
            this.pc,
            this.rq,
            this.keys,
            this.getQueryTaskInjectProxy(),
            this.getPatientQueryTaskInjectProxy(),
            this.getStudyQueryTaskInjectProxy(),
            this.getSeriesQueryTaskInjectProxy(),
        );

        await super.get();
        await this.seriesQueryTaskInjectProxy?.wrappedFindNextSeries();

        return seriesQueryTask;
    }

    getQueryTaskInjectProxy() {
        if (!this.queryTaskInjectProxy) {
            this.queryTaskInjectProxy = this.createQueryTaskInjectProxy();
        }

        return this.queryTaskInjectProxy.get();
    }

    getSeriesQueryTaskInjectProxy() {
        if (!this.seriesQueryTaskInjectProxy) {
            this.seriesQueryTaskInjectProxy = new SeriesQueryTaskInjectProxy(
                this,
            );
        }

        return this.seriesQueryTaskInjectProxy.get();
    }

    async reset() {
        await super.reset();
        this.seriesAttr = null;
        this.seriesJson = null;
    }

    protected override createQueryTaskInjectProxy(): IProxy {
        return new SeriesMatchIteratorProxy(this);
    }
}

class SeriesQueryTaskInjectProxy {
    constructor(private seriesQueryTask: SeriesQueryTask) {}

    get() {
        return createSeriesQueryTaskInjectProxy(
            {
                wrappedFindNextSeries: this.wrappedFindNextSeries.bind(this),
                // @ts-expect-error - java bridge 可以接受 Promise<boolean>
                findNextSeries: this.findNextSeries.bind(this),
                getSeries: this.getSeries.bind(this),
            },
            {
                keepAsDaemon: true,
            },
        );
    }

    async wrappedFindNextSeries() {
        await this.findNextSeries();
    }

    async getSeries() {
        const queryAttr = this.seriesQueryTask.getKeys();
        if (queryAttr !== null) {
            const queryJson = await attributesToToJsonQuery(
                "series",
                queryAttr,
            );

            const seriesQueryBuilder = new DicomSearchSeriesQueryBuilder();
            const series = await seriesQueryBuilder.execQuery({
                workspaceId: this.seriesQueryTask.getWorkspaceId(),
                ...queryJson,
                limit: 1,
                offset: this.seriesQueryTask.offset++,
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            });

            if (series.length > 0) {
                this.seriesQueryTask.seriesJson = JSON.parse(series[0].json);
                this.seriesQueryTask.seriesAttr =
                    await Common.getAttributesFromJsonString(series[0].json);
                
                if (series[0].study?.json) {
                    this.seriesQueryTask.studyAttr =
                        await Common.getAttributesFromJsonString(
                            series[0].study.json,
                        );
                }

                if (series[0].study?.patient?.json) {
                    
                }
            } else {
                this.seriesQueryTask.seriesAttr = null;
                this.seriesQueryTask.seriesJson = null;
            }
        }

        if (this.seriesQueryTask.offset === env.QUERY_MAX_LIMIT + 1) {
            this.seriesQueryTask.seriesAttr = null;
            this.seriesQueryTask.seriesJson = null;
        }
    }

    async findNextSeries() {
        await this.getSeries();

        return this.seriesQueryTask.seriesAttr !== null;
    }
}

class SeriesMatchIteratorProxy {
    private opCount: number = 0;

    constructor(private seriesQueryTask: SeriesQueryTask) {}

    get() {
        return createQueryTaskInjectProxy(
            {
                hasMoreMatches: () => {
                    this.opCount++;
                    if (this.opCount > env.QUERY_MAX_LIMIT) {
                        return false;
                    }

                    const hasMoreMatches =
                        this.seriesQueryTask.seriesAttr !== null;

                    if (!hasMoreMatches) {
                        this.seriesQueryTask.reset();
                    }

                    return !!hasMoreMatches;
                },
                // @ts-expect-error - java bridge 可以接受 Promise<Attributes>
                nextMatch: async () => {
                    const patientAttrSize =
                        (await this.seriesQueryTask.patientAttr?.size()) || 0;
                    const studyAttrSize =
                        (await this.seriesQueryTask.studyAttr?.size()) || 0;
                    const seriesAttrSize =
                        (await this.seriesQueryTask.seriesAttr?.size()) || 0;

                    const returnAttr = await Attributes.newInstanceAsync(
                        patientAttrSize + studyAttrSize + seriesAttrSize,
                    );

                    await Attributes.unifyCharacterSets([
                        this.seriesQueryTask.patientAttr,
                        this.seriesQueryTask.studyAttr,
                        this.seriesQueryTask.seriesAttr,
                    ]);

                    await returnAttr.addAll(this.seriesQueryTask.patientAttr);
                    await returnAttr.addAll(this.seriesQueryTask.studyAttr);
                    await returnAttr.addAll(this.seriesQueryTask.seriesAttr);

                    await this.seriesQueryTask.seriesQueryTaskInjectProxy?.wrappedFindNextSeries();

                    return returnAttr;
                },
                // @ts-expect-error - java bridge 可以接受 Promise<Attributes>
                adjust: async (match) => {
                    return await this.seriesQueryTask.patientAdjust(match);
                },
            },
            {
                keepAsDaemon: true,
            },
        );
    }
}
