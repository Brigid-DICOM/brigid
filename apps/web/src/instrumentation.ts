export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        console.log("current working directory", process.cwd());

        const { default: env } = await import("@brigid/env");

        const { AppDataSource } = await import(
            "@brigid/database/src/dataSource"
        );
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
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
            const dimseApp = new DimseApp(env.DIMSE_HOSTNAME, env.DIMSE_PORT);
            await dimseApp.start();
        }

        const handleShutdown = async (signal: string) => {
            console.log(`Received ${signal}, shutting down...`);

            if (cleanupScheduler) {
                await cleanupScheduler.stop();
                console.log("Dicom cleanup scheduler stopped");
            }

            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
                console.log("Database connection closed");
            }

            process.exit(0);
        };

        process.on("SIGINT", () => handleShutdown("SIGINT"));
        process.on("SIGTERM", () => handleShutdown("SIGTERM"));
    }
}
