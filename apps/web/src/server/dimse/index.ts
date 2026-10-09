import { AppDataSource } from "@brigid/database";
import { DimseConfigEntity } from "@brigid/database/src/entities/dimseConfig.entity";
import env from "@brigid/env";
import dcmjsDimse from "dcmjs-dimse";
import { dimseAeRegistry } from "./aeRegistry";
import { BrigidDimseScp } from "./brigidDimseScp";
import type {
    DimseApplicationEntityInfo,
    DimseConfigInfo,
} from "./dimseTypes";

export type { DimseApplicationEntityInfo, DimseConfigInfo };

const { Server } = dcmjsDimse;

const globalForDimse = globalThis as unknown as {
    dimseApp: DimseApp | undefined;
};

export class DimseApp {
    private server: InstanceType<typeof Server> | null = null;
    private started = false;

    constructor(
        private readonly hostname: string,
        private readonly port: number,
    ) {}

    async start(): Promise<void> {
        if (this.started) {
            return;
        }

        await this.loadApplicationEntitiesFromDatabase();

        this.server = new Server(BrigidDimseScp);
        this.server.listen(this.port);

        this.started = true;

        console.log(
            `DIMSE SCP started on ${this.hostname}:${env.DIMSE_PORT}`,
        );
    }

    private async loadApplicationEntitiesFromDatabase(): Promise<void> {
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

    async addApplicationEntityToDevice(
        config: DimseConfigInfo,
    ): Promise<DimseApplicationEntityInfo> {
        const { aeTitle, workspaceId } = config;
        const existing = dimseAeRegistry.get(aeTitle);

        if (existing) {
            existing.workspaceId = workspaceId;
            console.warn(
                `Application Entity ${aeTitle} already exists, updated workspace`,
            );
            return existing;
        }

        const entry: DimseApplicationEntityInfo = {
            aeTitle,
            workspaceId,
        };
        dimseAeRegistry.set(aeTitle, entry);

        console.log(
            `Added Application Entity: ${aeTitle} for workspace: ${workspaceId}`,
        );
        return entry;
    }

    async addApplicationEntitiesToDevice(
        configs: DimseConfigInfo[],
    ): Promise<DimseApplicationEntityInfo[]> {
        return Promise.all(
            configs.map((config) => this.addApplicationEntityToDevice(config)),
        );
    }

    async removeApplicationEntityFromDevice(aeTitle: string): Promise<boolean> {
        const removed = dimseAeRegistry.delete(aeTitle);
        if (!removed) {
            return false;
        }

        console.log(`Removed Application Entity: ${aeTitle}`);
        return true;
    }

    getApplicationEntity(
        aeTitle: string,
    ): DimseApplicationEntityInfo | undefined {
        return dimseAeRegistry.get(aeTitle);
    }

    public static getInstance(hostname: string, port: number): DimseApp {
        if (!globalForDimse.dimseApp) {
            console.log("Creating new DimseApp instance");
            globalForDimse.dimseApp = new DimseApp(hostname, port);
        }
        return globalForDimse.dimseApp;
    }

    public static resetInstance(): void {
        globalForDimse.dimseApp = undefined;
        dimseAeRegistry.clear();
    }

    public stop(): void {
        this.server?.close();
        this.server = null;
        this.started = false;
    }

    public async reconfigureDevice(): Promise<void> {
        console.log(
            "AE registry updated; new associations will use the latest configuration.",
        );
    }
}
