import { raccoonDcm4cheJavaLoader } from "raccoon-dcm4che-bridge";
import { useDimseTestContext } from "./helpers/dimseTestContext";

raccoonDcm4cheJavaLoader({
    isPackagedElectron: true,
});

// suite 級生命週期由 setup 註冊，符合 spec / Register suite lifecycle from setup per spec
useDimseTestContext();
