// copy from https://github.com/lobehub/lobe-chat/blob/96ae8034fb53549ae478c8e656a59d15817a4e7b/apps/desktop/src/main/const/env.ts

import os from "node:os";
import { dev, linux, macOS, windows } from "electron-is";

export const isDev = dev();

export const isMac = macOS();
export const isWindows = windows();
export const isLinux = linux();

function getIsWindows11() {
    if (!isWindows) return false;
    // 獲取操作系統版本（如 "10.0.22621"）
    const release = os.release();
    const parts = release.split(".");

    // 主版本和次版本
    const majorVersion = parseInt(parts[0], 10);
    const minorVersion = parseInt(parts[1], 10);

    // 構建號碼是第三部分
    const buildNumber = parseInt(parts[2], 10);

    // Windows 11 的構建號碼從 22000 開始
    return majorVersion === 10 && minorVersion === 0 && buildNumber >= 22_000;
}

export const isWindows11 = getIsWindows11();
