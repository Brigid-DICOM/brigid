import path from "node:path";
import { AppDataSource } from "@brigid/database";
import { DimseConfigEntity } from "@brigid/database/src/entities/dimseConfig.entity";
import env from "@brigid/env";
import fsE from "fs-extra";
import type Class from "raccoon-dcm4che-bridge/src/wrapper/java/lang/Class";
import { EnumSet } from "raccoon-dcm4che-bridge/src/wrapper/java/util/EnumSet";
import { ApplicationEntity } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/ApplicationEntity";
import { Connection } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/Connection";
import { Device } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/Device";
import { QueryOption } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/QueryOption";
import { BasicCEchoSCP } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/service/BasicCEchoSCP";
import { DicomServiceRegistry } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/service/DicomServiceRegistry";
import { TransferCapability } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/TransferCapability";
import { TransferCapability$Role } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/TransferCapability$Role";
import { Common } from "raccoon-dcm4che-bridge/src/wrapper/org/github/chinlinlee/dcm777/common/Common";
import { NativeCFindScp } from "./cfindScp";
import { getScpInstance } from "./cstoreScp";
import { DeviceService } from "./deviceService";

interface DimseConfigInfo {
    aeTitle: string;
    workspaceId: string;
}

const globalForDimse = globalThis as unknown as {
    dimseApp: DimseApp | undefined;
};

export class DimseApp {
    private device: Device;
    private applicationEntities: Map<string, ApplicationEntity> = new Map();
    private connection = new Connection();
    private deviceService: DeviceService | null = null;
    constructor(
        private hostname: string,
        private port: number,
    ) {
        this.device = new Device("brigid");
        this.configureBindServer();
        this.device.addConnectionSync(this.connection);
    }

    async start() {
        this.configureLog();
        this.configureConnection(this.connection);
        
        const dicomServiceRegistry = await this.createDicomServiceRegistry();
        this.device.setDimseRQHandlerSync(dicomServiceRegistry);
            
        this.deviceService = new DeviceService();
        this.deviceService.init(this.device);
        this.deviceService.start();
        await this.loadApplicationEntitiesFromDatabase();

        console.log(
            `DIMSE SCP started on ${env.DIMSE_HOSTNAME}:${env.DIMSE_PORT}`,
        );
    }

    private async loadApplicationEntitiesFromDatabase() {
        const enabledConfigs = await AppDataSource.manager.find(
            DimseConfigEntity,
            {
                where: { enabled: true },
            },
        );

        for (const config of enabledConfigs) {
            await this.addApplicationEntityToDevice({
                aeTitle: config.aeTitle,
                workspaceId: config.workspaceId,
            });
        }
    }

    async addApplicationEntityToDevice(config: DimseConfigInfo): Promise<ApplicationEntity> {
        const { aeTitle, workspaceId } = config;

        if (this.applicationEntities.has(aeTitle)) {
            console.warn(
                `Application Entity ${aeTitle} already exists, skipping`,
            );
            return this.applicationEntities.get(aeTitle) as ApplicationEntity;
        }

        const ae = new ApplicationEntity(aeTitle);
        ae.setAssociationAcceptorSync(true);
        ae.addConnectionSync(this.connection);

        this.configureTransferCapability(ae);

        this.applicationEntities.set(aeTitle, ae);

        await this.reconfigureDevice();
        
        console.log(
            `Added Application Entity: ${aeTitle} for workspace: ${workspaceId}`,
        );
        return ae;
    }

    async addApplicationEntitiesToDevice(
        configs: DimseConfigInfo[],
    ): Promise<ApplicationEntity[]> {
        return Promise.all(configs.map((config) =>
            this.addApplicationEntityToDevice(config),
        ));
    }

    async removeApplicationEntityFromDevice(aeTitle: string): Promise<boolean> {
        const ae = this.applicationEntities.get(aeTitle);
        if (!ae) {
            return false;
        }

        this.applicationEntities.delete(aeTitle);
        await this.reconfigureDevice();
        console.log(`Removed Application Entity: ${aeTitle}`);
        return true;
    }

    getApplicationEntity(aeTitle: string): ApplicationEntity | undefined {
        return this.applicationEntities.get(aeTitle);
    }

    private async createDicomServiceRegistry() {
        const dicomServiceRegistry = new DicomServiceRegistry();
        await dicomServiceRegistry.addDicomService(new BasicCEchoSCP());

        const nativeCStoreScp = getScpInstance();
        await dicomServiceRegistry.addDicomService(nativeCStoreScp);

        // #region C-FIND SCP
        const patientRootCFindScp = new NativeCFindScp().getPatientRootLevel();
        const studyRootCFindScp = new NativeCFindScp().getStudyRootLevel();
        const patientStudyOnlyCFindScp = new NativeCFindScp().getPatientStudyOnlyLevel();
        await dicomServiceRegistry.addDicomService(patientRootCFindScp);
        await dicomServiceRegistry.addDicomService(studyRootCFindScp);
        await dicomServiceRegistry.addDicomService(patientStudyOnlyCFindScp);
        // #endregion

        return dicomServiceRegistry;
    }

    private configureBindServer() {
        this.connection.setPortSync(this.port);
        this.connection.setHostnameSync(this.hostname);
    }

    private configureTransferCapability(ae: ApplicationEntity) {
        const tc = new TransferCapability(
            null,
            "*",
            TransferCapability$Role.SCP,
            ["*"],
        );
        tc.setQueryOptionsSync(EnumSet.noneOfSync(QueryOption.class as Class));
        ae.addTransferCapabilitySync(tc);
    }

    private configureConnection(conn: Connection = this.connection) {
        conn.setReceivePDULengthSync(
            env.DIMSE_MAX_PDU_LEN_RCV as number,
        );
        conn.setSendPDULengthSync(
            env.DIMSE_MAX_PDU_LEN_SND as number,
        );

        if (env.DIMSE_NOT_ASYNC) {
            conn.setMaxOpsInvokedSync(1);
            conn.setMaxOpsPerformedSync(1);
        } else {
            conn.setMaxOpsInvokedSync(
                env.DIMSE_MAX_OPS_INVOKED as number,
            );
            conn.setMaxOpsPerformedSync(
                env.DIMSE_MAX_OPS_PERFORMED as number,
            );
        }

        conn.setPackPDVSync(!env.DIMSE_NOT_PACK_PDV);
        conn.setConnectTimeoutSync(
            env.DIMSE_CONNECT_TIMEOUT as number,
        );
        conn.setRequestTimeoutSync(
            env.DIMSE_REQUEST_TIMEOUT as number,
        );
        conn.setAcceptTimeoutSync(
            env.DIMSE_ACCEPT_TIMEOUT as number,
        );
        conn.setReleaseTimeoutSync(
            env.DIMSE_RELEASE_TIMEOUT as number,
        );
        conn.setSendTimeoutSync(env.DIMSE_SEND_TIMEOUT as number);
        conn.setStoreTimeoutSync(env.DIMSE_STORE_TIMEOUT as number);
        conn.setResponseTimeoutSync(
            env.DIMSE_RESPONSE_TIMEOUT as number,
        );
        conn.setIdleTimeoutSync(env.DIMSE_IDLE_TIMEOUT as number);
        conn.setSocketCloseDelaySync(
            env.DIMSE_SO_CLOSE_DELAY as number,
        );
        conn.setSendBufferSizeSync(
            env.DIMSE_SO_SND_BUFFER as number,
        );
        conn.setReceiveBufferSizeSync(
            env.DIMSE_SO_RCV_BUFFER as number,
        );
        conn.setTcpNoDelaySync(!!env.DIMSE_TCP_NO_DELAY);
    }

    private configureLog() {
        this.generateLogBackFile();
        Common.LoadLogConfigSync(
            path.join(process.cwd(), "configs/logback.xml"),
        );
    }

    private generateLogBackFile() {
        const logFilePath = path.normalize(
            path.join(process.cwd(), "logs/dimse.log"),
        );
        const logBackXml = `<?xml version="1.0" encoding="UTF-8"?>
        <configuration>
        
            <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
                <encoder>
                    <pattern>%d [%thread] %-5level %logger{36} - %msg%n</pattern>
                    <charset>utf-8</charset>
                </encoder>
                <file>${logFilePath}</file>
                <rollingPolicy class="ch.qos.logback.core.rolling.FixedWindowRollingPolicy">
                    <fileNamePattern>${logFilePath}%i</fileNamePattern>
                </rollingPolicy>
                <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
                    <MaxFileSize>1MB</MaxFileSize>
                </triggeringPolicy>
            </appender>
        
            <root level="INFO">
                <appender-ref ref="FILE" />
            </root>
        </configuration>`;

        fsE.writeFileSync(
            path.normalize(path.join(process.cwd(), "configs/logback.xml")),
            logBackXml,
            "utf-8",
        );
    }

    public static getInstance(hostname: string, port: number): DimseApp {
        if (!globalForDimse.dimseApp) {
            console.log("Creating new DimseApp instance");
            globalForDimse.dimseApp = new DimseApp(hostname, port);
        }
        return globalForDimse.dimseApp;
    }

    public async reconfigureDevice() {
        const tempDevice = new Device("brigid");

        const dicomConn = new Connection("dicom", this.hostname, this.port);

        this.configureConnection(dicomConn);

        tempDevice.addConnectionSync(dicomConn);

        for (const [aeTitle, _] of this.applicationEntities) {
            const ae = new ApplicationEntity(aeTitle);
            await ae.setAssociationAcceptor(true);
            await ae.addConnection(dicomConn);

            this.configureTransferCapability(ae);
            await tempDevice.addApplicationEntity(ae);
        }

        await this.device.reconfigure(tempDevice);

        this.deviceService?.stop();
        this.deviceService?.start();

        console.log("Device configuration reconfigured successfully via template.");
    }
}
