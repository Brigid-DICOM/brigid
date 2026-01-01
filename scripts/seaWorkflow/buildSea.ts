import { exec, spawn } from "node:child_process";
import { createWriteStream, existsSync } from "node:fs";
import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
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
    removeSignature: (exePath: string) => Promise<void>;
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
        removeSignature: async (exePath: string) => {
            const defaultSingTool = "signtool";
            const specificSigntool = `C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22621.0\\x64\\`;

            try {
                await runCommand(defaultSingTool, ["remove", "/s", `"${exePath}"`], process.cwd());
            } catch (error) {
                console.warn("⚠️ Warning: Failed to remove signature. Trying specific signtool path.", error);
                if (existsSync(specificSigntool)) {
                    await runCommand("signtool.exe", ["remove", "/s", `"${exePath}"`], specificSigntool);
                } else {
                    console.warn("⚠️ Warning: signtool not found. Skipping signature removal.");
                }
            }
        }
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
        removeSignature: async () => { /* Linux 下不需要移除簽名 */ }
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
        removeSignature: async (exePath: string) => {
            try {
                await runCommand("codesign", ["--remove-signature", `"${exePath}"`], process.cwd());
            } catch (error) {
                console.warn("⚠️ Warning: codesign failed. Skipping signature removal.", error);
            }
        }
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
        console.log("--- Step 1: Copying and flattening standalone output ---");
        const standaloneDir = path.join(appsWebDir, ".next/standalone");
        const standaloneAppDir = path.join(standaloneDir, "apps/web");
        // 複製 server.js 作為 SEA 進入點
        await cp(path.join(standaloneAppDir, "server.js"), path.join(seaTmpDir, "server.js"));
        // 依照要求複製 node_modules, .next, public
        await cp(path.join(standaloneDir, "node_modules"), path.join(seaTmpDir, "node_modules"), { recursive: true });
        await cp(path.join(standaloneAppDir, ".next"), path.join(seaTmpDir, ".next"), { recursive: true });
        await cp(path.join(standaloneAppDir, "public"), path.join(seaTmpDir, "public"), { recursive: true });
        // 複製並更名 .env
        await cp(path.join(appsWebDir, "env.example"), path.join(seaTmpDir, ".env"));

        // 2. 建立 SEA 設定檔
        console.log("--- Step 2: Generating sea-config.json ---");
        const seaConfig = {
            main: "./server.js",
            output: "sea-prep.blob"
        };
        await writeFile(path.join(seaTmpDir, "sea-config.json"), JSON.stringify(seaConfig, null, 2));

        // 3. 執行 Node.js 官方 SEA 流程
        console.log("--- Step 3: Running Node.js SEA workflow ---");
        const finalExePath = path.join(seaTmpDir, config.executableName);

        // 3.1 產生 blob
        await runCommand("node", ["--experimental-sea-config", "sea-config.json"], seaTmpDir);

        // 3.2 複製 node 執行檔
        const copyCmd = currentPlatform === "win32" 
            ? `node -e "require('fs').copyFileSync(process.execPath, '${config.executableName}')"`
            : `cp $(command -v node) ${config.executableName}`;
        await runCommand(copyCmd, [], seaTmpDir);

        // 3.3 移除簽名
        console.log("--- Step 3.3: Removing signature ---");
        await config.removeSignature(finalExePath);

        // 3.4 注入 blob (postject)
        console.log("--- Step 3.4: Injecting blob with postject ---");
        await runCommand("npx", [
            "postject",
            config.executableName,
            "NODE_SEA_BLOB",
            "sea-prep.blob",
            "--sentinel-fuse",
            "NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2"
        ], seaTmpDir);

        // 4. 處理 JRE
        const filesToArchive = [config.executableName, "node_modules", ".next", "public", ".env"];
        if (withJre) {
            console.log("--- Step 5.5: Including JRE ---");
            await ensureJre(seaTmpDir);
            filesToArchive.push("jre");
        }

        // 5. 打包成 ZIP
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
