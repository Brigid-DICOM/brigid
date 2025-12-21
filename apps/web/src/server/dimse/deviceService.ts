import { importClass } from "java-bridge";
import type { ExecutorService } from "raccoon-dcm4che-bridge/src/wrapper/java/util/concurrent/ExecutorService";
import type { ScheduledExecutorService } from "raccoon-dcm4che-bridge/src/wrapper/java/util/concurrent/ScheduledExecutorService";
import type { Device } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/Device";

const Executors = importClass("java.util.concurrent.Executors");

export class DeviceService {
    protected device: Device | null = null;
    protected executor: ExecutorService | null = null;
    protected scheduledExecutor: ScheduledExecutorService | null = null;

    public init(device: Device) {
        this.setDevice(device);
    }

    public setDevice(device: Device) {
        this.device = device;
    }

    public getDevice() {
        return this.device;
    }

    public isRunning() {
        return this.executor !== null;
    }

    public start() {
        if (this.device === null) {
            throw new Error("Not initialized");
        }
        if (this.executor !== null) {
            throw new Error("Already started");
        }

        this.executor = this.executorService();
        this.scheduledExecutor = this.scheduledExecutorService();

        try {
            this.device.setExecutorSync(this.executor);
            this.device.setScheduledExecutorSync(this.scheduledExecutor);
            this.device.bindConnectionsSync();
        } catch (error) {
            this.stop();
            console.error("Failed to start", error);
            throw new Error("Failed to start");
        }
    }

    public stop() {
        if (this.device !== null) {
            this.device?.unbindConnectionsSync();
        }
        if (this.scheduledExecutor !== null) {
            this.scheduledExecutor.shutdownSync();
        }

        if (this.executor !== null) {
            this.executor.shutdownSync();
        }

        this.executor = null;
        this.scheduledExecutor = null;
    }

    protected executorService() {
        return Executors.newCachedThreadPoolSync();
    }

    protected scheduledExecutorService() {
        return Executors.newSingleThreadScheduledExecutorSync();
    }
}
