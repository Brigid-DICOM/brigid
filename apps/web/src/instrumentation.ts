export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {

        if ((global as any)._shutdownHandlersRegistered) return;
        (global as any)._shutdownHandlersRegistered = true;

        console.log("current working directory", process.cwd());

        const { default: env } = await import("@brigid/env");
        const { logApplicationActivityMessage } = await import("@/server/services/dicom/dicomAuditFactory");
        const { AppDataSource, initializeDb } = await import(
            "@brigid/database/src/dataSource"
        );

        await initializeDb();
        
        const raccoonDcm4cheBridge = await import("raccoon-dcm4che-bridge");
        raccoonDcm4cheBridge.raccoonDcm4cheJavaLoader({
            isPackagedElectron: true,
        });
        console.log("Raccoon DCM4CHE Java loader registered");

        let cleanupScheduler: any;
        try {
            const { DicomCleanupSchedulerService } = await import(
                "@/server/services/dicom/dicomCleanupScheduler.service"
            );
            cleanupScheduler = new DicomCleanupSchedulerService();
            cleanupScheduler.start();
            console.log("Dicom cleanup scheduler started");
        } catch (error) {
            console.error("Failed to start dicom cleanup scheduler", error);
        }

        const { DimseApp } = await import("./server/dimse/index");
        if (env.DIMSE_HOSTNAME && env.DIMSE_PORT) {
            const dimseApp = DimseApp.getInstance(
                env.DIMSE_HOSTNAME,
                env.DIMSE_PORT,
            );
            await dimseApp.start();
        }

        const handleShutdown = async (signal: string) => {
            console.log(`[Shutdown] Received ${signal}, shutting down...`);

            if (cleanupScheduler) {
                await cleanupScheduler.stop();
                console.log("Dicom cleanup scheduler stopped");
            }

            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
                console.log("Database connection closed");
            }

            logApplicationActivityMessage({ isStart: false });
            process.exit(0);
        };

        process.prependListener("SIGINT", () => handleShutdown("SIGINT"));
        process.prependListener("SIGTERM", () => handleShutdown("SIGTERM"));
        process.prependListener("SIGQUIT", () => handleShutdown("SIGQUIT"));

        if (process.platform === "win32") {
            const readline = await import("readline");
            readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            }).on("SIGINT", () => handleShutdown("SIGINT"));
        }

        logApplicationActivityMessage({ isStart: true });
    }
}
