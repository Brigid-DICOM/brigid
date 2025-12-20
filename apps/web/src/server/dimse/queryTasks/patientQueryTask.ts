import env from "@brigid/env";
import Attributes from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Attributes";
import Tag from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Tag";
import VR from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/VR";
import type { Association } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/Association";
import type { PresentationContext } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/pdu/PresentationContext";
import { Common } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/common/Common";
import { PatientQueryTask as JavaPatientQueryTask } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/PatientQueryTask";
import { createPatientQueryTaskInjectProxy } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/PatientQueryTaskInject";
import { createQueryTaskInjectProxy } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/net/QueryTaskInject";
import { DicomSearchPatientQueryBuilder } from "@/server/services/qido-rs/dicomSearchPatientQueryBuilder";
import { attributesToToJsonQuery } from "./queryUtils";

export interface IProxy {
    get(): any;
}

export interface IPatientTaskForIterator {
    patientAttr: Attributes | null;
    offset: number;
    reset(): Promise<void>;
    patientQueryTaskInjectProxy: IPatientQueryTaskInjectProxy | null;
    patientAdjust(match: Attributes | null): Promise<Attributes | null>;
}

export interface IPatientTaskForInject {
    offset: number;
    patientAttr: Attributes | null;
    patientJson: Record<string, unknown> | null;
    getKeys(): Attributes | null;
    getWorkspaceId(): string;
}

export interface IPatientQueryTaskInjectProxy extends IProxy {
    wrappedFindNextPatient(): Promise<void>;
}

export class PatientQueryTask
    implements IPatientTaskForIterator, IPatientTaskForInject {

    offset: number = 0;
    patientAttr: Attributes | null = null;
    patientJson: Record<string, unknown> | null = null;
    patientQueryTaskInjectProxy: PatientQueryTaskInjectProxy | null = null;
    queryTaskInjectProxy: IProxy | null = null;

    constructor(
        protected as: Association | null, 
        protected pc: PresentationContext | null,
        protected rq: Attributes | null,
        protected keys: Attributes | null,
        protected workspaceId: string
    ) {}

    async reset() {
        this.as = null;
        this.pc = null;
        this.rq = null;
        this.keys = null;
    }

    async get() {
        const patientQueryTask = await JavaPatientQueryTask.newInstanceAsync(
            this.as,
            this.pc,
            this.rq,
            this.keys,
            this.getQueryTaskInjectProxy(),
            this.getPatientQueryTaskInjectProxy()
        );
        await this.patientQueryTaskInjectProxy?.wrappedFindNextPatient();

        return patientQueryTask;
    }

    async basicAdjust(match: Attributes | null) {
        if (match === null) {
            return null;
        }

        const filtered = new Attributes(await match.size());

        if (!await this.keys?.contains(Tag.SpecificCharacterSet)) {
            const ss = await match.getStrings(Tag.SpecificCharacterSet);
            if (ss && ss?.length > 0) {
                await filtered.setString(Tag.SpecificCharacterSet, VR.CS, ss);
            } else {
                await filtered.setString(Tag.SpecificCharacterSet, VR.CS, ["ISO_IR 192"]);
            }
        }

        await filtered.addSelected(match, this.keys);
        await filtered.supplementEmpty(this.keys);

        return filtered;
    }

    async patientAdjust(match: Attributes | null) {
        const basicAdjusted = await this.basicAdjust(match);
        if (basicAdjusted === null) {
            return null;
        }

        await basicAdjusted.remove(Tag.DirectoryRecordType);

        if (await this.keys?.contains(Tag.SOPClassUID)) {
            const referencedSopClassUID = await match?.getString(Tag.ReferencedSOPClassUIDInFile);
            if (referencedSopClassUID) {
                await basicAdjusted.setString(
                    Tag.SOPClassUID,
                    VR.UI,
                    referencedSopClassUID
                );
            }
        }

        if (await this.keys?.contains(Tag.SOPInstanceUID)) {
            const referencedSopInstanceUID = await match?.getString(Tag.ReferencedSOPInstanceUIDInFile);
            if (referencedSopInstanceUID) {
                await basicAdjusted.setString(
                    Tag.SOPInstanceUID,
                    VR.UI,
                    referencedSopInstanceUID
                );
            }
        }

        const queryRetrieveLevel = await this.keys?.getString(
            Tag.QueryRetrieveLevel
        );
        await basicAdjusted.setString(
            Tag.QueryRetrieveLevel,
            VR.CS,
            queryRetrieveLevel ?? null
        );

        return basicAdjusted;
    }

    getKeys() {
        return this.keys;
    }

    getQueryTaskInjectProxy() {
        if (!this.queryTaskInjectProxy) {
            this.queryTaskInjectProxy = this.createQueryTaskInjectProxy();
        }

        return this.queryTaskInjectProxy.get();
    }

    getPatientQueryTaskInjectProxy() {
        if (!this.patientQueryTaskInjectProxy) {
            this.patientQueryTaskInjectProxy = new PatientQueryTaskInjectProxy(this);
        }

        return this.patientQueryTaskInjectProxy.get();
    }

    getWorkspaceId() {
        return this.workspaceId;
    }

    protected createQueryTaskInjectProxy(): IProxy {
        return new PatientMatchIteratorProxy(this);
    }
}

class PatientQueryTaskInjectProxy implements IPatientQueryTaskInjectProxy {
    constructor(
        private patientQueryTask: IPatientTaskForInject
    ) {}

    get() {
        return createPatientQueryTaskInjectProxy({
            wrappedFindNextPatient: this.wrappedFindNextPatient.bind(this),
            // @ts-expect-error - java bridge 可以接受 Promise<boolean>
            findNextPatient: this.findNextPatient.bind(this),
            getPatient: this.getPatient.bind(this),
        }, {
            keepAsDaemon: true
        })
    }

    async wrappedFindNextPatient() {
        await this.findNextPatient();
    }

    async findNextPatient() {
        await this.getPatient();

        return this.patientQueryTask.patientAttr !== null;
    }

    async getPatient() {
        const queryAttr = this.patientQueryTask.getKeys();
        if (queryAttr !== null) {
            const queryJson = await attributesToToJsonQuery(
                "patient",
                queryAttr
            );

            const patientQueryBuilder = new DicomSearchPatientQueryBuilder();
            const patients = await patientQueryBuilder.execQuery({
                workspaceId: this.patientQueryTask.getWorkspaceId(),
                ...queryJson,
                limit: 1,
                offset: this.patientQueryTask.offset++
            });

            if (patients.length > 0) {
                this.patientQueryTask.patientJson = JSON.parse(patients[0].json);
                this.patientQueryTask.patientAttr = await Common.getAttributesFromJsonString(patients[0].json);
            } else {
                this.patientQueryTask.patientAttr = null;
                this.patientQueryTask.patientJson = null;
            }
        }

        if (this.patientQueryTask.offset === (env.QUERY_MAX_LIMIT + 1)) {
            this.patientQueryTask.patientAttr = null;
            this.patientQueryTask.patientJson = null;
        }
    }
}

class PatientMatchIteratorProxy {
    private patientQueryTask: IPatientTaskForIterator;

    constructor(
        patientQueryTask: IPatientTaskForIterator
    ) {
        this.patientQueryTask = patientQueryTask;
    }

    get() {
        return createQueryTaskInjectProxy({
            hasMoreMatches: () => {
                const hasMoreMatches = this.patientQueryTask.patientAttr;

                if (!hasMoreMatches) {
                    this.patientQueryTask.reset();
                }

                return !!hasMoreMatches;
            },
            // @ts-expect-error - java bridge 可以接受 Promise<Attributes>
            nextMatch: async () => {
                const tempRecord = this.patientQueryTask.patientAttr;
                await this.patientQueryTask.patientQueryTaskInjectProxy?.wrappedFindNextPatient();
                return tempRecord;
            },
            // @ts-expect-error - java bridge 可以接受 Promise<Attributes>
            adjust: async (match) => {
                return await this.patientQueryTask.patientAdjust(match);
            }
        }, {
            keepAsDaemon: true
        });
    }
}