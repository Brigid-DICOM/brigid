export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const raccoonDcm4cheBridge = await import("raccoon-dcm4che-bridge");
        raccoonDcm4cheBridge.raccoonDcm4cheJavaLoader({
            isPackagedElectron: true
        });
        console.log("Raccoon DCM4CHE Java loader registered");
    }
}