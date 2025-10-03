import Logger from "electron-log/main";
import { App } from "./core/App";

process.env["ELECTRON_ENABLE_LOGGING"] = "true";

Logger.initialize();

const app = new App();

import("fix-path")
    .then((module) => {
        const fixPath = module.default;
        fixPath();
        app.bootstrap();
    })
    .catch((err) => {
        Logger.error("Failed to fix PATH:", err);
        app.bootstrap();
    });
