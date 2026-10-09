import { raccoonDcm4cheJavaLoader } from "raccoon-dcm4che-bridge";

// 必須在載入 DimseApp / dcm4che wrapper 之前初始化 JVM classpath
// Must init JVM classpath before importing DimseApp or any dcm4che wrapper
raccoonDcm4cheJavaLoader({
    isPackagedElectron: true,
});

const { useDimseTestContext } = await import("./helpers/dimseTestContext");
useDimseTestContext();
