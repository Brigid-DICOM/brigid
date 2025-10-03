// copy from https://github.com/lobehub/lobe-chat/blob/main/apps/desktop/src/main/utils/logger.ts

import debug from "debug";
import electronLog from "electron-log";

// 配置 electron-log
electronLog.transports.file.level = "info"; // 生產環境記錄 info 及以上級別
electronLog.transports.console.level =
    process.env.NODE_ENV === "development"
        ? "debug" // 開發環境顯示更多日誌
        : "warn"; // 生產環境只顯示警告和錯誤

// 創建命名空間調試器
export const createLogger = (namespace: string) => {
    const debugLogger = debug(namespace);

    return {
        debug: (message, ...args) => {
            debugLogger(message, ...args);
        },
        error: (message, ...args) => {
            if (process.env.NODE_ENV === "production") {
                electronLog.error(message, ...args);
            } else {
                console.error(message, ...args);
            }
        },
        info: (message, ...args) => {
            if (process.env.NODE_ENV === "production") {
                electronLog.info(`[${namespace}]`, message, ...args);
            }

            debugLogger(`INFO: ${message}`, ...args);
        },
        verbose: (message, ...args) => {
            electronLog.verbose(message, ...args);
            if (process.env.DEBUG_VERBOSE) {
                debugLogger(`VERBOSE: ${message}`, ...args);
            }
        },
        warn: (message, ...args) => {
            if (process.env.NODE_ENV === "production") {
                electronLog.warn(message, ...args);
            }
            debugLogger(`WARN: ${message}`, ...args);
        },
    };
};
