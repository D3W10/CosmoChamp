import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import os from "os";
import Store from "electron-store";
import { autoUpdater } from "electron-updater";
import Logger from "./lib/logger";
import { IStore } from "./lib/Store.interface";

require("electron-reload")(__dirname);

var window: BrowserWindow, splash: BrowserWindow;
const winWidth = 1000, winHeight = 600, isProd: boolean = process.env.NODE_ENV == "production" && (process.env.DEBUG == undefined ? true : process.env.DEBUG.match(/true/gi) == null) && !process.argv.includes("DEBUG");
const logger = new Logger("Main", 34), pLogger = new Logger("Preload", 32), packageData = JSON.parse(fs.readFileSync(path.join(__dirname, "/../package.json"), "utf8"));

const appConfig = new Store<IStore>({
    defaults: {
        lastRunVersion: app.getVersion(),
        settings: {
            theme: 0
        }
    }
});

logger.log(`Starting ${packageData.displayName} ${packageData.version} on ${process.platform == "win32" ? "Windows" : "macOS"} ${os.release()}`);
logger.log("Running on Electron " + process.versions.electron + " and NodeJS " + process.versions.node);

if (!isProd)
    logger.log("\x1b[35mDEBUG mode enabled!\x1b[0m");

async function createWindow() {
    window = new BrowserWindow({
        title: packageData.displayName,
        width: winWidth,
        height: winHeight,
        frame: false,
        resizable: false,
        fullscreen: false,
        fullscreenable: false,
        maximizable: false,
        show: true,
        icon: path.join(__dirname, "./www/branding/logo.png"),
        webPreferences: {
            devTools: !isProd,
            preload: path.join(__dirname, "preload.js")
        }
    });

    window.loadURL(isProd ? "file:///" + path.join(__dirname, "www", "index.html") : "http://localhost:5173/");
    window.once("ready-to-show", () => window.show());
   //updaterInfo.initAutoUpdater(autoUpdater, mainWindow.window);
}

app.whenReady().then(() => createWindow());

app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
});

//#region Preload Events

ipcMain.on("LoggerInfo", (_, msg) => pLogger.log(msg));

ipcMain.on("LoggerWarn", (_, msg) => pLogger.warn(msg));

ipcMain.on("LoggerError", (_, msg) => pLogger.error(msg));

ipcMain.on("CloseWindow", () => BrowserWindow.getFocusedWindow()!.close());

ipcMain.on("MinimizeWindow", () => BrowserWindow.getFocusedWindow()!.minimize());

ipcMain.on("ResizeWindow", (_, width: number, height: number) => BrowserWindow.getFocusedWindow()!.setBounds({ width: width != -1 ? width : winWidth, height: height != -1 ? height : winHeight }));

ipcMain.on("GetSetting", (_event, key: string) => _event.returnValue = appConfig.get(key));

ipcMain.on("SetSetting", (_event, key: string, value: any) => appConfig.set(key, value));

ipcMain.on("ResetSettings", () => appConfig.clear());

ipcMain.on("GetAppInfo", (event) => {
    event.returnValue = {
        name: packageData.displayName,
        version: packageData.version
    }
});

//#endregion