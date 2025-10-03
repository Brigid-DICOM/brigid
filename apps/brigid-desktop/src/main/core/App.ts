// ref: https://github.com/lobehub/lobe-chat/blob/96ae8034/apps/desktop/src/main/core/App.ts

import os from "node:os";
import { join } from "node:path";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, protocol, Session, shell } from "electron";
import { macOS, windows } from "electron-is";
import { nextStandaloneDir } from "@/const/dir";
import { isDev } from "@/const/env";
import { createLogger } from "@/utils/logger";
import type { CustomRequestHandler } from "@/utils/next-electron-rsc";
import { createHandler } from "@/utils/next-electron-rsc";

const logger = createLogger("core:App");

function createWindow(baseUrl: string): void {
    const mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 900,
        height: 670,
        minWidth: 400,
        webPreferences: {
            preload: join(__dirname, "../../preload/index.js"),
            contextIsolation: true,
            devTools: isDev
        }
    });

    mainWindow.on("ready-to-show", () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: "deny" };
    });

    mainWindow.loadURL(baseUrl);
}

export class App {
    nextServerUrl: string = "http://localhost:3119";
    chromeFlags: string[] = ['OverlayScrollbar', 'FluentOverlayScrollbar', 'FluentScrollbar'];
    constructor() {
        logger.info("-".repeat(36));
        logger.info(`  OS:${os.platform()} ${os.arch()}`);
        logger.info(` RAM: ${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB`);
        logger.info(`PATH: ${app.getAppPath()}`);
        logger.info(` lng: ${app.getLocale()}`);
        logger.info("-".repeat(36));
        logger.info("Starting Brigid...");

        logger.debug("Initializing App...");

        logger.info("App initialization completed");

        this.registerNextHandler();
    }

    bootstrap = async () => {
        console.log("Bootstrapping App...");
        logger.info("Bootstrapping App...");

        const isSingle = app.requestSingleInstanceLock();
        if (!isSingle) {
            logger.info("Another instance of the app is already running");
            app.quit();
        }

        await this.makeAppReady();
    }

    private makeAppReady = async () => {
        logger.debug("Preparing application ready state");
        // TODO: 之後可以在這裡運行所有 controller 的

        app.commandLine.appendSwitch("gtk-version", "3");

        app.commandLine.appendSwitch('enable-features', this.chromeFlags.join(','));

        logger.debug("Waiting for app to be ready");
        await app.whenReady();
        electronApp.setAppUserModelId("com.electron");
        app.on("browser-window-created", (_, window) => {
            optimizer.watchWindowShortcuts(window);
        });

        createWindow(this.nextServerUrl);

        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow(this.nextServerUrl);
        });

        app.on("window-all-closed", () => {
            if (process.platform !== "darwin") {
                app.quit();
            }
        });
        
        logger.debug("App is ready");

        logger.info("Application ready state completed");
    }

    // ======== helper ========

     /**
    * use in next router interceptor in prod browser renderer
    */
    nextInterceptor: (params: { session: Session }) => () => void;

    /**
    * Function to register custom request handler
    */
    private registerCustomHandlerFn?: (handler: CustomRequestHandler) => () => void;

    private registerNextHandler() {
        logger.debug("Registering Next.js handler");
        const handler = createHandler({
            debug: true,
            localhostUrl: 'http://localhost:3000',
            protocol: protocol,
            standaloneDir: nextStandaloneDir
        });

        if (isDev) {
            logger.info(
                "Development mode detected, skipping Next.js handler registration"
            );
        } else {
            logger.info(
                "Production mode detected, registering Next.js handler"
            );
        }

        this.nextInterceptor = handler.createInterceptor;

        if (handler.registerCustomHandler) {
            this.registerCustomHandlerFn = handler.registerCustomHandler;
            logger.debug("Custom request handler registration is available")
        } else {
            logger.warn("Custom request handler registration is not available");
        }
    }
}
