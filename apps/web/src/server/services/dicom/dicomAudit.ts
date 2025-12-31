import { create } from "xmlbuilder2";

// ==========================================
// Defined Constants (Magic Numbers Replacement)
// ==========================================

export const AuditSourceType = {
    EndUserDisplay: "1",
    DataAcquisition: "2",
    WebServer: "3",
    ApplicationServer: "4",
    DatabaseServer: "5",
    SecurityServer: "6",
    NetworkComponent: "7",
    OperatingSoftware: "8",
    Other: "9",
} as const;

export type AuditSourceType =
    (typeof AuditSourceType)[keyof typeof AuditSourceType];

export const ParticipantObjectType = {
    Person: "1",
    System: "2",
    Organization: "3",
    Other: "4",
} as const;

export type ParticipantObjectType =
    (typeof ParticipantObjectType)[keyof typeof ParticipantObjectType];

export const ParticipantObjectRole = {
    Patient: "1",
    Location: "2",
    Report: "3",
    Resource: "4",
    MasterFile: "5",
    User: "6",
    List: "7",
    Doctor: "8",
    Subscriber: "9",
    Guarantor: "10",
    SecurityUserEntity: "11",
    SecurityUserGroup: "12",
    SecurityResource: "13",
    SecurityGranularityDefinition: "14",
    Provider: "15",
    ReportDestination: "16",
    ReportLibrary: "17",
    Schedule: "18",
    Customer: "19",
    Job: "20",
    JobStream: "21",
    Table: "22",
    RoutingCriteria: "23",
    Query: "24",
} as const;

export type ParticipantObjectRole =
    (typeof ParticipantObjectRole)[keyof typeof ParticipantObjectRole];

export const NetworkAccessPointType = {
    MachineName: "1",
    IPAddress: "2",
    TelephoneNumber: "3",
    Email: "4",
    URI: "5",
} as const;

export type NetworkAccessPointType =
    (typeof NetworkAccessPointType)[keyof typeof NetworkAccessPointType];

export const EventActionCode = {
    Create: "C",
    Read: "R",
    Update: "U",
    Delete: "D",
    Execute: "E",
} as const;

export type EventActionCode =
    (typeof EventActionCode)[keyof typeof EventActionCode];

export const EventOutcomeIndicator = {
    Success: "0",
    MinorFailure: "4",
    SeriousFailure: "8",
    MajorFailure: "12",
} as const;

export type EventOutcomeIndicator =
    (typeof EventOutcomeIndicator)[keyof typeof EventOutcomeIndicator];

export interface CodedValue {
    code: string;
    system?: string; // Default: DCM
    display?: string;
}

// ------------------------------------------
// Data Model Interfaces
// ------------------------------------------

export interface SOPClassDetail {
    uid: string;
    numberOfInstances?: number;
    instances?: string[]; // List of SOP Instance UIDs
}

export interface ParticipantObjectDescription {
    mpps?: string[];
    accession?: string[];
    sopClasses?: SOPClassDetail[];
    studyIDs?: string[];
    encrypted?: boolean;
    anonymized?: boolean;
}

export interface ParticipantObject {
    id: string;
    type: ParticipantObjectType;
    role: ParticipantObjectRole;
    idType: CodedValue;
    name?: string;
    query?: string | Buffer;
    description?: ParticipantObjectDescription;
    details?: Record<string, string>;
}

export interface ActiveParticipant {
    userId: string;
    isRequestor: boolean;
    role?: CodedValue;
    ip?: string;
    networkType: NetworkAccessPointType;
    altUserId?: string;
    userName?: string;
}

export interface AuditSource {
    id: string;
    site?: string;
    type: AuditSourceType;
}

export interface AuditEventInfo {
    id: CodedValue;
    type?: CodedValue;
    action: EventActionCode;
    outcome: EventOutcomeIndicator;
    time: string;
    name: string;
}

export interface DicomAuditLogData {
    event: AuditEventInfo;
    source: AuditSource;
    participants: ActiveParticipant[];
    objects: ParticipantObject[];
}

// ==========================================
// DICOM Constants Dictionary
// ==========================================

export const DICOM_AUDIT_CONSTANTS = {
    EventID: {
        ApplicationActivity: {
            code: "110100",
            display: "Application Activity",
        },
        BeginTransferring: {
            code: "110102",
            display: "Begin Transferring DICOM Instances",
        },
        InstancesTransferred: {
            code: "110104",
            display: "DICOM Instances Transferred",
        },
        InstancesAccessed: {
            code: "110103",
            display: "DICOM Instances Accessed",
        },
        StudyDeleted: { code: "110105", display: "DICOM Study Deleted" },
        Query: { code: "110112", display: "Query" },
        SecurityAlert: { code: "110113", display: "Security Alert" },
        UserAuthentication: { code: "110114", display: "User Authentication" },
    },
    EventTypeCode: {
        ApplicationStart: { code: "110120", display: "Application Start" },
        ApplicationStop: { code: "110121", display: "Application Stop" },
        Login: { code: "110122", display: "Login" },
        Logout: { code: "110123", display: "Logout" },
        Attach: { code: "110124", display: "Attach" },
        Detach: { code: "110125", display: "Detach" },
    },
    RoleID: {
        Application: "110150",
        Destination: "110152",
        Source: "110153",
        User: "110151",
    },
    ParticipantObjectIDType: {
        StudyInstanceUID: { code: "110180", display: "Study Instance UID" },
        SOPClassUID: { code: "110181", display: "SOP Class UID" },
        PatientNumber: {
            code: "2",
            display: "Patient Number",
            system: "RFC-3881",
        },
        NodeID: { code: "110182", display: "Node ID" },
    },
} as const;

// ==========================================
// AuditMessageBuilder
// ==========================================

export class AuditMessageBuilder {
    private data: DicomAuditLogData;

    constructor(
        eventID: CodedValue | string,
        actionCode: EventActionCode,
        outcome: EventOutcomeIndicator,
        eventName?: string,
        eventTypeCode?: CodedValue | string,
    ) {
        // Handle overload: if string passed, create default CodedValue
        const evtIdVal: CodedValue =
            typeof eventID === "string"
                ? {
                      code: eventID,
                      system: "DCM",
                      display: eventName || "Unknown",
                  }
                : eventID;

        // Use custom name or fallback to CodedValue display
        const displayName = eventName || evtIdVal.display || "Unknown Event";

        const eventTypeCodeVal: CodedValue | undefined =
            typeof eventTypeCode === "string"
                ? {
                      code: eventTypeCode,
                      system: "DCM",
                      display: "Event Type Code",
                  }
                : eventTypeCode || undefined;

        this.data = {
            event: {
                id: evtIdVal,
                type: eventTypeCodeVal || undefined,
                action: actionCode,
                outcome: outcome,
                time: new Date().toISOString(),
                name: displayName,
            },
            source: {
                id: "Unknown",
                site: "",
                type: "4", // Default: Application Server Process
            },
            participants: [],
            objects: [],
        };
    }

    public setAuditSource(
        sourceId: string,
        enterpriseSiteId: string = "",
        type: AuditSourceType = AuditSourceType.ApplicationServer,
    ): this {
        this.data.source = { id: sourceId, site: enterpriseSiteId, type };
        return this;
    }

    /**
     *
     * @param userId - The user ID of the active participant 如果是 transaction，userId 則為 client, server 的 ae title
     * @param isRequestor
     * @param roleIdCode
     * @param networkId
     * @param networkType
     * @param altUserId
     * @returns
     */
    public addActiveParticipant(
        userId: string,
        isRequestor: boolean,
        roleIdCode?: string | CodedValue,
        networkId: string = "127.0.0.1",
        networkType: NetworkAccessPointType = NetworkAccessPointType.IPAddress,
        altUserId?: string,
        userName?: string,
    ): this {
        let roleVal: CodedValue | undefined;
        if (roleIdCode) {
            roleVal =
                typeof roleIdCode === "string"
                    ? { code: roleIdCode, system: "DCM", display: "Role" }
                    : roleIdCode;
        }

        this.data.participants.push({
            userId,
            isRequestor,
            role: roleVal,
            ip: networkId,
            networkType,
            altUserId,
            userName,
        });
        return this;
    }

    public addParticipantObject(
        objectId: string,
        typeCode: ParticipantObjectType,
        role: ParticipantObjectRole,
        idTypeCode: string | CodedValue,
        name?: string,
        description?: ParticipantObjectDescription,
        details?: Record<string, string>,
        query?: string | Buffer,
    ): this {
        const idTypeVal: CodedValue =
            typeof idTypeCode === "string"
                ? { code: idTypeCode, system: "DCM", display: "ID Type" }
                : idTypeCode;

        this.data.objects.push({
            id: objectId,
            type: typeCode,
            role: role,
            idType: idTypeVal,
            name: name,
            description: description,
            details: details,
            query: query ? Buffer.from(query).toString("base64") : undefined,
        });
        return this;
    }

    public build(): DicomAuditLog {
        return new DicomAuditLog(this.data);
    }
}

// ==========================================
// DicomAuditLog Class
// ==========================================

export class DicomAuditLog {
    private data: DicomAuditLogData;

    constructor(data: DicomAuditLogData) {
        this.data = data;
    }

    /**
     * Get JSON for SQL Storage
     */
    public toJSON(): DicomAuditLogData {
        return this.data;
    }

    /**
     * Generate compliant XML
     */
    public toXML(): string {
        const doc = create({ version: "1.0", encoding: "UTF-8" }).ele(
            "AuditMessage",
            {
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:noNamespaceSchemaLocation": "audit-message.xsd",
            },
        );

        // 1. Event Identification
        const evt = doc.ele("EventIdentification", {
            EventActionCode: this.data.event.action,
            EventTypeCode: this.data.event.type?.code || undefined,
            EventDateTime: this.data.event.time,
            EventOutcomeIndicator: this.data.event.outcome,
        });

        this._appendCodedValue(evt, "EventID", this.data.event.id);

        // 2. Active Participants
        this.data.participants.forEach((p) => {
            const node = doc.ele("ActiveParticipant", {
                UserID: p.userId,
                UserIsRequestor: p.isRequestor.toString(),
                NetworkAccessPointID: p.ip || "127.0.0.1",
                NetworkAccessPointTypeCode: "2", // 2=IP Address
            });

            if (p.altUserId) node.att("AlternativeUserID", p.altUserId);
            if (p.role) this._appendCodedValue(node, "RoleIDCode", p.role);
            if (p.userName) node.ele("UserName").txt(p.userName);
        });

        // 3. Audit Source
        const src = doc.ele("AuditSourceIdentification", {
            AuditSourceID: this.data.source.id,
            AuditEnterpriseSiteID: this.data.source.site || "",
        });
        src.ele("AuditSourceTypeCode", { "csd-code": this.data.source.type });

        // 4. Participant Objects
        this.data.objects.forEach((obj) => {
            const node = doc.ele("ParticipantObjectIdentification", {
                ParticipantObjectID: obj.id,
                ParticipantObjectTypeCode: obj.type,
                ParticipantObjectTypeCodeRole: obj.role,
            });

            this._appendCodedValue(
                node,
                "ParticipantObjectIDTypeCode",
                obj.idType,
            );

            if (obj.name) {
                node.ele("ParticipantObjectName").txt(obj.name);
            }

            // --- Handle ParticipantObjectDescription ---
            if (obj.description) {
                this._buildDescription(node, obj.description);
            }

            // --- Handle Generic Details (Base64) ---
            if (obj.details) {
                Object.entries(obj.details).forEach(([key, value]) => {
                    node.ele("ParticipantObjectDetail", {
                        type: key,
                        value: Buffer.from(String(value)).toString("base64"),
                    });
                });
            }

            if (obj.query) {
                node.ele("ParticipantObjectQuery").txt(
                    Buffer.from(obj.query).toString("base64"),
                );
            }
        });

        return doc.end({ prettyPrint: true });
    }

    private _buildDescription(
        parentNode: any,
        desc: ParticipantObjectDescription,
    ): void {
        const hasContent =
            (desc.mpps && desc.mpps.length > 0) ||
            (desc.accession && desc.accession.length > 0) ||
            (desc.sopClasses && desc.sopClasses.length > 0) ||
            (desc.studyIDs && desc.studyIDs.length > 0) ||
            desc.encrypted !== undefined ||
            desc.anonymized !== undefined;

        if (!hasContent) return;

        const descNode = parentNode.ele("ParticipantObjectDescription");

        // MPPS
        desc.mpps?.forEach((uid) => {
            descNode.ele("MPPS", { UID: uid });
        });

        // Accession
        desc.accession?.forEach((acc) => {
            descNode.ele("Accession", { Number: acc });
        });

        // SOP Classes & Instances
        desc.sopClasses?.forEach((sop) => {
            const sopNode = descNode.ele("SOPClass", {
                UID: sop.uid,
                NumberOfInstances: sop.numberOfInstances?.toString(),
            });
            sop.instances?.forEach((instUid) => {
                sopNode.ele("Instance", { UID: instUid });
            });
        });

        // Study IDs
        desc.studyIDs?.forEach((uid) => {
            const sNode = descNode.ele("ParticipantObjectContainsStudy");
            sNode.ele("StudyIDs", { UID: uid });
        });

        // Encrypted / Anonymized
        if (desc.encrypted !== undefined)
            descNode.att("Encrypted", desc.encrypted.toString());
        if (desc.anonymized !== undefined)
            descNode.att("Anonymized", desc.anonymized.toString());
    }

    private _appendCodedValue(
        node: any,
        tagName: string,
        val: CodedValue,
    ): void {
        const el = node.ele(tagName, {
            "csd-code": val.code,
            codeSystemName: val.system || "DCM",
            originalText: val.display || "",
        });
        if (val.display) {
            el.att("displayName", val.display);
        }
    }
}

// for test
function main() {
    const builder = new AuditMessageBuilder(
        DICOM_AUDIT_CONSTANTS.EventID.InstancesTransferred,
        EventActionCode.Create,
        EventOutcomeIndicator.Success,
    );

    builder.setAuditSource(
        "Brigid",
        "Brigid-Server",
        AuditSourceType.ApplicationServer,
    );

    builder
        .addActiveParticipant(
            "ANY_SCU",
            true,
            DICOM_AUDIT_CONSTANTS.RoleID.User,
            "127.0.0.1",
            NetworkAccessPointType.IPAddress,
        )
        .addActiveParticipant(
            "Brigid",
            false,
            DICOM_AUDIT_CONSTANTS.RoleID.Destination,
            "192.168.1.100",
        );

    // Study 物件
    builder.addParticipantObject(
        "1.2.840.10008.1.2.3.4.5.67890",
        ParticipantObjectType.System,
        ParticipantObjectRole.Report,
        DICOM_AUDIT_CONSTANTS.ParticipantObjectIDType.StudyInstanceUID,
        undefined,
        {
            accession: ["ACC-123"],
            sopClasses: [
                {
                    uid: "1.2.840.10008.1.2.3.4.5.67890",
                    numberOfInstances: 1,
                    instances: ["1.2.840.10008.1.2.3.4.5.67890"],
                },
            ],
        },
    );

    // patient 物件
    builder.addParticipantObject(
        "PID-12345",
        ParticipantObjectType.Person,
        ParticipantObjectRole.Patient,
        DICOM_AUDIT_CONSTANTS.ParticipantObjectIDType.PatientNumber,
        "John Doe",
    );

    const log = builder.build();

    console.log("--- JSON Output ---");
    console.log(JSON.stringify(log.toJSON(), null, 2));

    console.log("\n--- XML Output ---");
    console.log(log.toXML());
}

if (require.main === module) {
    main();
}
