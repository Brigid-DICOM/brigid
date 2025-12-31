import { exec, spawn } from "node:child_process";
import { createWriteStream, existsSync } from "node:fs";
import { cp, mkdir, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execAsync = promisify(exec);
// 取得目前檔案路徑與專案根目錄
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../../");
const seaTmpDir = path.join(rootDir, "seaTmp");
const appsWebDir = path.join(rootDir, "apps/web");
const outputDir = path.join(rootDir, "build");

interface PlatformConfig {
    target: string;
    executableName: string;
    archiveAction: (
        zipPath: string,
        files: string[],
        cwd: string,
    ) => Promise<void>;
}

const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
    win32: {
        target: "windows",
        executableName: "brigid-server.exe",
        archiveAction: async (
            zipPath: string,
            files: string[],
            cwd: string,
        ) => {
            const fileString = files.map((f) => `"${f}"`).join(", ");

            const powerShellCmd = `Compress-Archive -Path ${fileString} -DestinationPath "${zipPath}" -Force`;
            await runCommand("powershell", ["-Command", powerShellCmd], cwd);
        },
    },
    linux: {
        target: "linux",
        executableName: "brigid-server",
        archiveAction: async (
            zipPath: string,
            files: string[],
            cwd: string,
        ) => {
            // linux 下使用 zip (請確保系統有安裝 zip)
            await runCommand("zip", ["-r", zipPath, ...files], cwd);
        },
    },
    darwin: {
        target: "macos",
        executableName: "brigid-server",
        archiveAction: async (
            zipPath: string,
            files: string[],
            cwd: string,
        ) => {
            // macos 同樣使用 zip
            await runCommand("zip", ["-r", zipPath, ...files], cwd);
        },
    },
};

/**
 * 執行外部指令的封裝函數
 */
async function runCommand(command: string, args: string[], cwd: string) {
    return new Promise<void>((resolve, reject) => {
        console.log(`> [${cwd}] ${command} ${args.join(" ")}`);
        const proc = spawn(command, args, {
            stdio: "inherit",
            shell: true,
            cwd,
        });
        proc.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Command failed with code ${code}`));
        });
    });
}

/**
 * 取得 Temurin JRE 21 的下載連結
 */
function getJreDownloadUrl() {
    const arch = process.arch === "x64" ? "x64" : "aarch64";
    const platform = process.platform === "win32" ? "windows" : 
                    process.platform === "darwin" ? "mac" : "linux";
    
    // 使用 Adoptium API 取得最新 JRE 21 GA 版本
    return `https://api.adoptium.net/v3/binary/latest/21/ga/${platform}/${arch}/jre/hotspot/normal/eclipse?project=jdk`;
}

async function ensureJre(targetDir: string) {
    const url = getJreDownloadUrl();
    const isWin = process.platform === "win32";
    const archiveName = isWin ? "jre.zip" : "jre.tar.gz";
    const archivePath = path.join(targetDir, archiveName);
    const jreExtractDir = path.join(targetDir, "jre_temp");
    const finalJreDir = path.join(targetDir, "jre");

    console.log(`--- Downloading JRE from ${url} ---`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download JRE: ${response.statusText}`);

    await pipeline(response.body as any, createWriteStream(archivePath));
    
    console.log(`--- Extracting JRE ---`);
    await mkdir(jreExtractDir, { recursive: true });

    if (isWin) {
        await execAsync(`powershell -Command "Expand-Archive -Path '${archivePath}' -DestinationPath '${jreExtractDir}'"`);
    } else {
        await execAsync(`tar -xzf "${archivePath}" -C "${jreExtractDir}"`);
    }

    // Adoptium 的壓縮檔通常包含一個子目錄 (如 jdk-21.0.x+11-jre)
    // 我們需要將其內容移動到 targetDir/jre
    const subDirs = await readdir(jreExtractDir);
    const actualJreDir = path.join(jreExtractDir, subDirs[0]);
    await cp(actualJreDir, finalJreDir, { recursive: true });

    if (!isWin) {
        console.log(`--- Setting executable permissions for JRE binaries ---`);
        try {
            const jreBinDir = path.join(finalJreDir, "bin");
            await execAsync(`chmod -R +x "${jreBinDir}"`);

            if (process.platform === "darwin") {
                const jliPath = path.join(finalJreDir, "lib", "jli", "libjli.dylib");
                if (existsSync(jliPath)) {
                    await execAsync(`chmod +x "${jliPath}"`);
                }
            }
            console.log("✅ JRE permissions set successfully.");
        } catch (error) {
            console.warn("⚠️ Warning: Failed to set JRE permissions. This might cause issues on Linux/macOS.", error);
        }
    }

    // 清理臨時檔案
    await rm(archivePath);
    await rm(jreExtractDir, { recursive: true });
}

async function buildSea(withJre: boolean = false) {
    const currentPlatform = os.platform();
    const config = PLATFORM_CONFIGS[currentPlatform];

    if (!config) {
        console.error(`Unsupported platform: ${currentPlatform}`);
        process.exit(1);
    }

    try {
        // 0. 初始化目錄
        console.log("--- Step 0: Preparing directories ---");
        await mkdir(outputDir, { recursive: true });
        await rm(seaTmpDir, { recursive: true, force: true });
        await mkdir(seaTmpDir, { recursive: true });
        // 1. 複製 standalone 資料
        console.log("--- Step 1: Copying standalone output ---");
        const standaloneDir = path.join(appsWebDir, ".next/standalone");
        await cp(standaloneDir, seaTmpDir, { recursive: true });

        // 2. 複製 favicon.ico
        console.log("--- Step 2: Copying favicon.ico ---");
        const iconSrc = path.join(appsWebDir, "src/app/favicon.ico");
        const iconDest = path.join(seaTmpDir, "apps/web/favicon.ico");
        await cp(iconSrc, iconDest);

        // 3. 執行 nexe
        console.log(`--- Step 3: Running nexe for ${currentPlatform} ---`);
        const nexeCwd = path.join(seaTmpDir, "apps/web");
        const nexeArgs = [
            "server.js",
            "-r",
            '"./public/**/*"',
            "-r",
            '"./.next/**/*"',
            "-o",
            "brigid-server",
            "--build",
            "-t",
            config.target,
        ];
        if (currentPlatform === "win32") {
            nexeArgs.push("--ico", "favicon.ico");
        }
        await runCommand("npx", ["nexe", ...nexeArgs], nexeCwd);

        // 4. 移動執行檔至 seaTmp 根目錄準備打包
        console.log("--- Step 4: Moving executable to seaTmp root ---");
        const generatedExePath = path.join(nexeCwd, config.executableName);
        const finalExePath = path.join(seaTmpDir, config.executableName);
        await cp(generatedExePath, finalExePath);

        // 5. 複製 .env.example
        console.log("--- Step 5: Copying .env.example ---");
        const envExampleSrc = path.join(appsWebDir, "env.example");
        const envExampleDest = path.join(seaTmpDir, ".env");
        await cp(envExampleSrc, envExampleDest);

        // 5.5 處理 JRE
        const filesToArchive = [config.executableName, "node_modules", ".env"];
        if (withJre) {
            console.log("--- Step 5.5: Including JRE ---");
            await ensureJre(seaTmpDir);
            filesToArchive.push("jre");
        }

        // 6. 打包成 ZIP
        console.log("--- Step 6: Packaging into zip ---");
        const suffix = withJre ? "-with-jre" : "";
        const zipName = `brigid-server-${currentPlatform}${suffix}.zip`;
        const zipDest = path.join(outputDir, zipName);
        // 移除現有的 zip 檔案
        await rm(zipDest, { force: true });

        // 呼叫平台特定的壓縮函數，打包執行檔與 node_modules
        await config.archiveAction(
            zipDest,
            filesToArchive,
            seaTmpDir,
        );

        console.log(`\n✅ Build successful! Package located at: ${zipDest}`);
    } catch (error) {
        console.error("Build failed:", error);
        process.exit(1);
    } finally {
        console.log("--- Cleanup: Removing seaTmp ---");
        await rm(seaTmpDir, { recursive: true, force: true });
    }
}

if (process.argv.includes("--with-jre")) {
    buildSea(true);
} else {
    buildSea(false);
}
