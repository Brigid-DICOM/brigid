import path from "node:path";
import fsE from "fs-extra";
import { importClass } from "java-bridge";
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
import { AppDataSource } from "../../database/src/dataSource";
import { DimseConfigEntity } from "../../database/src/entities/dimseConfig.entity";
import env from "../../env/src/index";

interface DimseConfigInfo {
    aeTitle: string;
    workspaceId: string;
}


export class DimseApp {
    private device: Device;
    private applicationEntities: Map<string, ApplicationEntity> = new Map();
    private connection = new Connection();

    constructor(private hostname: string, private port: number) {
        this.device = new Device("brigid");
        this.device.addConnectionSync(this.connection);
    }

    async start () {
        this.configureLog();
        this.configureConnection();
        this.configureBindServer();

        await this.loadApplicationEntitiesFromDatabase();
        
        const dicomServiceRegistry = await this.createDicomServiceRegistry();
        this.device.setDimseRQHandlerSync(dicomServiceRegistry);

        const Executors = importClass("java.util.concurrent.Executors");
        const executorService = await Executors.newCachedThreadPool();
        const scheduledExecutorService = await Executors.newSingleThreadScheduledExecutor();
        
        await this.device.setScheduledExecutor(scheduledExecutorService);
        await this.device.setExecutor(executorService);
        await this.device.bindConnections();

        console.log(`DIMSE SCP started on ${env.DIMSE_HOSTNAME}:${env.DIMSE_PORT}`);
    }

    private async loadApplicationEntitiesFromDatabase() {
        const enabledConfigs = await AppDataSource.manager.find(DimseConfigEntity, {
            where: { enabled: true }
        });

        for (const config of enabledConfigs) {
            this.addApplicationEntityToDevice({
                aeTitle: config.aeTitle,
                workspaceId: config.workspaceId
            });
        }
    }

    addApplicationEntityToDevice(config: DimseConfigInfo): ApplicationEntity {
        const { aeTitle, workspaceId } = config;

        if (this.applicationEntities.has(aeTitle)) {
            console.warn(`Application Entity ${aeTitle} already exists, skipping`);
            return this.applicationEntities.get(aeTitle) as ApplicationEntity;
        }

        const ae = new ApplicationEntity(aeTitle);
        ae.setAssociationAcceptorSync(true);
        ae.addConnectionSync(this.connection);

        this.configureTransferCapability(ae);

        this.device.addApplicationEntitySync(ae);
        this.applicationEntities.set(aeTitle, ae);

        console.log(`Added Application Entity: ${aeTitle} for workspace: ${workspaceId}`);
        return ae;
    }

    addApplicationEntitiesToDevice(configs: DimseConfigInfo[]): ApplicationEntity[] {
        return configs.map((config) => this.addApplicationEntityToDevice(config));
    }

    removeApplicationEntityFromDevice(aeTitle: string): boolean {
        const ae = this.applicationEntities.get(aeTitle);
        if (!ae) {
            return false;
        }

        this.device.removeApplicationEntitySync(ae);
        this.applicationEntities.delete(aeTitle);
        console.log(`Removed Application Entity: ${aeTitle}`);
        return true;
    }

    getApplicationEntity(aeTitle: string): ApplicationEntity | undefined {
        return this.applicationEntities.get(aeTitle);
    }

    private async createDicomServiceRegistry() {
        const dicomServiceRegistry = new DicomServiceRegistry();
        await dicomServiceRegistry.addDicomService(new BasicCEchoSCP());
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
            ["*"]
        );
        tc.setQueryOptionsSync(EnumSet.noneOfSync(QueryOption.class as Class));
        ae.addTransferCapabilitySync(tc);
    }

    private configureConnection() {
        this.connection.setReceivePDULengthSync(env.DIMSE_MAX_PDU_LEN_RCV as number);
        this.connection.setSendPDULengthSync(env.DIMSE_MAX_PDU_LEN_SND as number);

        if (env.DIMSE_NOT_ASYNC) {
            this.connection.setMaxOpsInvokedSync(1);
            this.connection.setMaxOpsPerformedSync(1);
        } else {
            this.connection.setMaxOpsInvokedSync(env.DIMSE_MAX_OPS_INVOKED as number);
            this.connection.setMaxOpsPerformedSync(env.DIMSE_MAX_OPS_PERFORMED as number);
        }

        this.connection.setPackPDVSync(!env.DIMSE_NOT_PACK_PDV);
        this.connection.setConnectTimeoutSync(env.DIMSE_CONNECT_TIMEOUT as number);
        this.connection.setRequestTimeoutSync(env.DIMSE_REQUEST_TIMEOUT as number);
        this.connection.setAcceptTimeoutSync(env.DIMSE_ACCEPT_TIMEOUT as number);
        this.connection.setReleaseTimeoutSync(env.DIMSE_RELEASE_TIMEOUT as number);
        this.connection.setSendTimeoutSync(env.DIMSE_SEND_TIMEOUT as number);
        this.connection.setStoreTimeoutSync(env.DIMSE_STORE_TIMEOUT as number);
        this.connection.setResponseTimeoutSync(env.DIMSE_RESPONSE_TIMEOUT as number);
        this.connection.setIdleTimeoutSync(env.DIMSE_IDLE_TIMEOUT as number);
        this.connection.setSocketCloseDelaySync(env.DIMSE_SO_CLOSE_DELAY as number);
        this.connection.setSendBufferSizeSync(env.DIMSE_SO_SND_BUFFER as number);
        this.connection.setReceiveBufferSizeSync(env.DIMSE_SO_RCV_BUFFER as number);
        this.connection.setTcpNoDelaySync(!!env.DIMSE_TCP_NO_DELAY);
    }

    private configureLog() {
        this.generateLogBackFile();
        Common.LoadLogConfigSync(
            path.join(
                process.cwd(),
                "configs/logback.xml",
            )
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
}
