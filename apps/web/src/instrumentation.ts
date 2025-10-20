export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { AppDataSource } = await import("@brigid/database/src/dataSource");
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const raccoonDcm4cheBridge = await import("raccoon-dcm4che-bridge");
        raccoonDcm4cheBridge.raccoonDcm4cheJavaLoader({
            isPackagedElectron: true
        });
        console.log("Raccoon DCM4CHE Java loader registered");
    }
}