import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import os from "os";
import Store from "electron-store";
import { autoUpdater } from "electron-updater";
import Logger from "./lib/logger";
import Messenger from "./lib/messenger";
import { IStore } from "./lib/Store.interface";

require("electron-reload")(__dirname);

var window: BrowserWindow, splash: BrowserWindow;
const isDev: boolean = process.env.NODE_ENV != "production", isDebug = process.env.DEBUG == undefined ? true : process.env.DEBUG.match(/true/gi) == null && !process.argv.includes("DEBUG");
const packageData = JSON.parse(fs.readFileSync(path.join(__dirname, "/../package.json"), "utf8"));
const logger = new Logger("Main", 34), pLogger = new Logger("Preload", 32), rLogger = new Logger("Renderer", 36), messenger = new Messenger(logger);

const appConfig = new Store<IStore>({
    defaults: {
        lastRunVersion: app.getVersion(),
        settings: {
            theme: 0,
            playerName: "Guest"
        }
    },
    encryptionKey: "CosmoChamp"
});

logger.log(`Starting ${packageData.displayName} ${packageData.version} on ${process.platform == "win32" ? "Windows" : "macOS"} ${os.release()}`);
logger.log("Running on Electron " + process.versions.electron + " and NodeJS " + process.versions.node);

if (isDebug)
    logger.log("\x1b[35mDEBUG mode enabled!\x1b[0m");

async function createWindow() {
    window = new BrowserWindow({
        title: packageData.displayName,
        width: 1000,
        height: 600,
        frame: false,
        resizable: false,
        fullscreen: false,
        fullscreenable: false,
        maximizable: false,
        show: true,
        icon: !isDev ? path.join(__dirname, "./www/logo.png") : path.join(__dirname, "../svelte/static/logo.png"),
        webPreferences: {
            devTools: isDev,
            preload: path.join(__dirname, "preload.js")
        }
    });

    window.loadURL(!isDev ? "file:///" + path.join(__dirname, "www", "index.html") : "http://localhost:5173/");
    window.once("ready-to-show", () => window.show());
   //updaterInfo.initAutoUpdater(autoUpdater, mainWindow.window);
}

app.whenReady().then(() => createWindow());

app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
});

//#region Preload Events

ipcMain.on("LoggerPreload", (_, type: "info" | "warn" | "error", msg: string) => log(pLogger, type, msg));

ipcMain.on("LoggerRenderer", (_, type: "info" | "warn" | "error", msg: string) => log(rLogger, type, msg));

function log(logger: Logger, type: "info" | "warn" | "error", msg: string) {
    if (type == "info")
        logger.log(msg);
    else if (type == "warn")
        logger.warn(msg);
    else if (type == "error")
        logger.error(msg);
}

ipcMain.on("CloseWindow", () => BrowserWindow.getFocusedWindow()!.close());

ipcMain.on("MinimizeWindow", () => BrowserWindow.getFocusedWindow()!.minimize());

ipcMain.on("GetSetting", (event, key: string) => event.returnValue = appConfig.get(key));

ipcMain.on("SetSetting", (_event, key: string, value: any) => appConfig.set(key, value));

ipcMain.on("ResetSettings", () => appConfig.clear());

ipcMain.on("GetAppInfo", (event) => {
    event.returnValue = {
        name: packageData.displayName,
        version: packageData.version
    }
});

ipcMain.handle("CreateServer", async (_event, ip: string, port: any) => {
    try {
        return await messenger.createServer(ip, port, (message) => window.webContents.send("SendMessage", message));
    }
    catch (err) {
        return err;
    }
});

ipcMain.handle("ConnectClient", async (_event, ip: string, port: any) => {
    try {
        return await messenger.connectClient(ip, port, (message) => window.webContents.send("SendMessage", message));
    }
    catch (err) {
        return err;
    }
});

ipcMain.on("SendMessage", (_event, message: string) => messenger.send(message));

//#endregion