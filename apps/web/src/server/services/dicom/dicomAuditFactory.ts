import { appLogger } from "@/server/utils/logger";
import {
    AuditMessageBuilder,
    DICOM_AUDIT_CONSTANTS,
    EventActionCode,
    EventOutcomeIndicator,
    NetworkAccessPointType,
    ParticipantObjectRole,
    ParticipantObjectType,
    type SOPClassDetail,
} from "./dicomAudit";

export interface TransferParticipant {
    userId: string;
    ip: string;
    aeTitle?: string;
}

export interface StudyInfo {
    uid: string;
    // Begin Transferring 訊息通常需要記錄包含的 SOP Classes
    sopClasses?: SOPClassDetail[];
}

export interface PatientInfo {
    id: string;
    name: string;
}

export interface TransferAudit {
    source: TransferParticipant;
    destination: TransferParticipant;
    studies: StudyInfo[];
    patient: PatientInfo;
    outcome?: EventOutcomeIndicator;
    requestor?: { userId: string; ip: string };
}

/**
 * 可以是人或系統
 */
interface AccessorParticipant {
    userId: string;
    isRequestor: boolean;
    ip?: string;
    networkType?: NetworkAccessPointType;
    roleCode?: string; // 選填，例如 Doctor (110156) 或 User (110151)
    altUserId?: string;
    userName?: string;
}

const logger = appLogger.child({
    module: "dicomAuditFactory",
});

export const logApplicationActivityMessage = ({
    isStart = true,
}: {
    isStart: boolean;
}) => {
    const auditMessageBuilder = new AuditMessageBuilder(
        DICOM_AUDIT_CONSTANTS.EventID.ApplicationActivity,
        EventActionCode.Execute,
        EventOutcomeIndicator.Success,
        "ApplicationActivityMessage",
        isStart
            ? DICOM_AUDIT_CONSTANTS.EventTypeCode.ApplicationStart
            : DICOM_AUDIT_CONSTANTS.EventTypeCode.ApplicationStop,
    );

    auditMessageBuilder.addActiveParticipant(
        "local",
        true,
        DICOM_AUDIT_CONSTANTS.RoleID.Application,
        "127.0.0.1",
        NetworkAccessPointType.IPAddress,
    );

    const auditMessage = auditMessageBuilder.build();

    logger.info("dicom audit", { auditMessage: auditMessage.toJSON() });
};

export interface LogBeginTransferringDicomInstancesParams {
    name?: string;
    source: TransferParticipant;
    destination: TransferParticipant;
    studies: StudyInfo[];
    patient: PatientInfo;
    outcome?: EventOutcomeIndicator;
    requestor?: { userId: string; ip: string };
}

export const logBeginTransferringDicomInstancesMessage = ({
    name = "Begin Transferring DICOM Instances",
    source,
    destination,
    studies,
    patient,
    outcome = EventOutcomeIndicator.Success,
    requestor, // 選填：如果是某人發起的操作
}: LogBeginTransferringDicomInstancesParams) => {
    // 1. 初始化 Builder
    // Action Code 必須為 'E' (Execute)
    const builder = new AuditMessageBuilder(
        DICOM_AUDIT_CONSTANTS.EventID.BeginTransferring,
        EventActionCode.Execute,
        outcome,
        name,
    );

    // 2. 加入主動參與者：傳送端 (Source)
    // Role: Source Role ID (110153)
    builder.addActiveParticipant(
        source.userId,
        false, // 通常機器傳輸不是 Requestor (除非它是自動觸發)
        DICOM_AUDIT_CONSTANTS.RoleID.Source,
        source.ip,
        NetworkAccessPointType.IPAddress,
        source.aeTitle ? `${source.aeTitle}` : undefined,
    );

    // 3. 加入主動參與者：接收端 (Destination)
    // Role: Destination Role ID (110152)
    builder.addActiveParticipant(
        destination.userId,
        false,
        DICOM_AUDIT_CONSTANTS.RoleID.Destination,
        destination.ip,
        NetworkAccessPointType.IPAddress,
        destination.aeTitle ? `${destination.aeTitle}` : undefined,
    );

    // 4. 加入發起者 Requestor
    if (requestor) {
        builder.addActiveParticipant(
            requestor.userId,
            true, // Is Requestor
            undefined, // 若無特定 Role 可留空，或填 User
            requestor.ip,
            NetworkAccessPointType.IPAddress,
        );
    }

    // 5. 加入參與物件：Study (可多個)
    // Type: System(2), Role: Report(3), ID Type: StudyInstanceUID(110180)
    studies.forEach((study) => {
        builder.addParticipantObject(
            study.uid,
            ParticipantObjectType.System,
            ParticipantObjectRole.Report,
            DICOM_AUDIT_CONSTANTS.ParticipantObjectIDType.StudyInstanceUID,
            undefined, // Study 通常不需要 Name
            {
                // 將 SOP Class 資訊放入 Description
                sopClasses: study.sopClasses,
            },
        );
    });

    // 6. 加入參與物件：Patient (單一)
    // Type: Person(1), Role: Patient(1), ID Type: PatientNumber(2)
    builder.addParticipantObject(
        patient.id,
        ParticipantObjectType.Person,
        ParticipantObjectRole.Patient,
        DICOM_AUDIT_CONSTANTS.ParticipantObjectIDType.PatientNumber,
        patient.name,
    );

    const message = builder.build().toJSON();

    logger.info("dicom audit", { auditMessage: message });
};

export const logDicomInstancesTransferred = ({
    name = "DICOM Instances Transferred",
    source,
    destination,
    studies,
    patient,
    outcome = EventOutcomeIndicator.Success,
    actionCode = EventActionCode.Create, // 預設為 Create (C)
    requestor,
}: {
    name?: string;
    source: TransferParticipant;
    destination: TransferParticipant;
    studies: StudyInfo[];
    patient: PatientInfo;
    outcome: EventOutcomeIndicator;
    actionCode: EventActionCode;
    requestor?: { userId: string; ip: string };
}) => {
    // 1. 初始化 Builder
    // Event ID: 110104 (DICOM Instances Transferred)
    const builder = new AuditMessageBuilder(
        DICOM_AUDIT_CONSTANTS.EventID.InstancesTransferred,
        actionCode,
        outcome,
        name,
    );

    // 2. 加入 Source (Process that sent the data)
    // Role: 110153 (Source Role ID)
    builder.addActiveParticipant(
        source.userId,
        false,
        DICOM_AUDIT_CONSTANTS.RoleID.Source,
        source.ip,
        NetworkAccessPointType.IPAddress,
        source.aeTitle ? `AETITLE=${source.aeTitle}` : undefined,
    );

    // 3. 加入 Destination (The process that received the data)
    // Role: 110152 (Destination Role ID)
    builder.addActiveParticipant(
        destination.userId,
        false,
        DICOM_AUDIT_CONSTANTS.RoleID.Destination,
        destination.ip,
        NetworkAccessPointType.IPAddress,
        destination.aeTitle ? `AETITLE=${destination.aeTitle}` : undefined,
    );

    // 4. (選填) Requestor (Third parties that requested the query/move)
    if (requestor) {
        builder.addActiveParticipant(
            requestor.userId,
            true, // Is Requestor = true
            undefined, // 若無特定 Role 可不填
            requestor.ip,
            NetworkAccessPointType.IPAddress,
        );
    }

    // 5. 加入 Study Objects (Studies being transferred)
    studies.forEach((study) => {
        builder.addParticipantObject(
            study.uid,
            ParticipantObjectType.System, // Type: 2
            ParticipantObjectRole.Report, // Role: 3
            DICOM_AUDIT_CONSTANTS.ParticipantObjectIDType.StudyInstanceUID, // ID Type: 110180
            undefined,
            {
                // Description: 包含 SOP Class UID 和實例數量
                sopClasses: study.sopClasses,
            },
        );
    });

    // 6. 加入 Patient Object (Patient)
    builder.addParticipantObject(
        patient.id,
        ParticipantObjectType.Person, // Type: 1
        ParticipantObjectRole.Patient, // Role: 1
        DICOM_AUDIT_CONSTANTS.ParticipantObjectIDType.PatientNumber, // ID Type: 2
        patient.name,
    );

    const message = builder.build().toJSON();

    logger.info("dicom audit", { auditMessage: message });
};

export const logDicomInstancesAccessedMessage = ({
    accessors,
    studies,
    patient,
    outcome = EventOutcomeIndicator.Success,
    actionCode = EventActionCode.Read,
}: {
    accessors: AccessorParticipant[];
    studies: StudyInfo[];
    patient: PatientInfo;
    outcome: EventOutcomeIndicator;
    actionCode: EventActionCode;
}) => {
    // 1. 初始化 Builder
    // Event ID: 110103 (DICOM Instances Accessed)
    const builder = new AuditMessageBuilder(
        DICOM_AUDIT_CONSTANTS.EventID.InstancesAccessed,
        actionCode,
        outcome,
    );

    // 2. 加入 Active Participants (Person and/or Process manipulating the data)
    accessors.forEach((acc) => {
        builder.addActiveParticipant(
            acc.userId,
            acc.isRequestor,
            acc.roleCode, // 若未提供則為 undefined
            acc.ip || "127.0.0.1",
            acc.networkType || NetworkAccessPointType.IPAddress,
            acc.altUserId,
            acc.userName,
        );
    });

    // 3. 加入 Study Objects (Studies being accessed)
    studies.forEach((study) => {
        builder.addParticipantObject(
            study.uid,
            ParticipantObjectType.System,
            ParticipantObjectRole.Report,
            DICOM_AUDIT_CONSTANTS.ParticipantObjectIDType.StudyInstanceUID,
            undefined,
            {
                sopClasses: study.sopClasses,
            },
        );
    });

    // 4. 加入 Patient Object (Patient)
    builder.addParticipantObject(
        patient.id,
        ParticipantObjectType.Person,
        ParticipantObjectRole.Patient,
        DICOM_AUDIT_CONSTANTS.ParticipantObjectIDType.PatientNumber,
        patient.name,
    );

    const message = builder.build().toJSON();

    logger.info("dicom audit", { auditMessage: message });
};

export const logQueryMessage = async ({
    name = "Query",
    source,
    destination,
    sopClassUid,
    queryPayload,
    outcome = EventOutcomeIndicator.Success,
    requestor,
}: {
    name?: string;
    source: TransferParticipant;
    destination: TransferParticipant;
    sopClassUid: string;
    queryPayload: string | Buffer;
    outcome: EventOutcomeIndicator;
    requestor?: { userId: string; ip: string };
}) => {
    const builder = new AuditMessageBuilder(
        DICOM_AUDIT_CONSTANTS.EventID.Query,
        EventActionCode.Execute,
        outcome,
        name,
    );

    builder.addActiveParticipant(
        source.userId,
        false,
        DICOM_AUDIT_CONSTANTS.RoleID.Source,
        source.ip,
        NetworkAccessPointType.IPAddress,
        source.aeTitle ? `${source.aeTitle}` : undefined,
    );

    builder.addActiveParticipant(
        destination.userId,
        false,
        DICOM_AUDIT_CONSTANTS.RoleID.Destination,
        destination.ip,
        NetworkAccessPointType.IPAddress,
        destination.aeTitle ? `${destination.aeTitle}` : undefined,
    );

    if (requestor) {
        builder.addActiveParticipant(
            requestor.userId,
            true, // Is Requestor = true
            undefined,
            requestor.ip,
            NetworkAccessPointType.IPAddress,
        );
    }

    builder.addParticipantObject(
        sopClassUid, // ObjectID
        ParticipantObjectType.System, // Type: 2
        ParticipantObjectRole.Report, // Role: 3
        DICOM_AUDIT_CONSTANTS.ParticipantObjectIDType.SOPClassUID, // ID Type: 110181
        undefined, // Name (Not specialized)
        undefined, // Description (Not specialized)
        undefined, // Details (Not specialized)
        queryPayload, // Query: Base64 content
    );

    const message = builder.build().toJSON();
    logger.info("dicom audit", { auditMessage: message });
};
