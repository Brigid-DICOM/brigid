import { raccoonDcm4cheJavaLoader } from "raccoon-dcm4che-bridge";
import type { DataSource } from "typeorm";
import { vi } from "vitest";

raccoonDcm4cheJavaLoader({
    isPackagedElectron: true,
});
let testDataSource: any = null;

// Mock AppDataSource to use test database
vi.mock("@brigid/database", () => ({
    AppDataSource: {
        get manager() {
            return testDataSource?.manager;
        },
        get options() {
            return testDataSource?.options || { entities: [] };
        },
        getRepository: vi.fn((entity) => {
            return testDataSource?.getRepository(entity);
        }),
        transaction: vi.fn(async (callback) => {
            // 模擬事務行為，直接使用測試資料庫的 manager
            if (testDataSource?.manager) {
                return await callback(testDataSource.manager);
            }
            throw new Error("Test database not initialized");
        }),
        initialize: vi.fn(),
        destroy: vi.fn(),
        get isInitialized() {
            return !!testDataSource?.isInitialized;
        },
    },
    initializeDb: vi.fn(async () => {
        // 在測試環境中，資料庫初始化由 TestDatabaseManager 處理
        // 這裡只需確保它回傳一個 Promise 即可，或者回傳當前的 testDataSource
        return testDataSource;
    }),
}));

// Mock environment variables
vi.mock("@brigid/env", () => ({
    default: {
        NEXT_PUBLIC_ENABLE_AUTH: false,
        TYPEORM_CONNECTION: process.env.TEST_DB_URL || "sqlite://:memory:",
        LOG_LEVEL: "error",
        STORAGE_PROVIDER: "local",
        STORAGE_LOCAL_DIR: "tests/fixtures/dicomFiles/temp",
        DICOM_STORAGE_FILEPATH:
            "/dicom/{workspaceId}/{0020000D,hash}/{0020000E,hash}/{00080018,hash}.dcm",
        JWT_SECRET: "test-jwt-secret-at-least-32-characters!!",
        ROUTING_CREDENTIAL_SECRET: "test-routing-secret-at-least-32-chars!",
        ROUTING_POLLER_INTERVAL_MS: 2000,
        ROUTING_POLLER_BATCH_SIZE: 10,
    },
}));

(global as any).setTestDataSource = (dataSource: DataSource) => {
    testDataSource = dataSource;
};
