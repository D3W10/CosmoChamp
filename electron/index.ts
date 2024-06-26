import { app, BrowserWindow, ipcMain, shell } from "electron";
import fs from "fs";
import path from "path";
import os from "os";
import Store from "electron-store";
import { autoUpdater } from "electron-updater";
import Logger from "./lib/logger";
import Messenger from "./lib/messenger";
import { IStore } from "./lib/Store.interface";

require("electron-reload")(__dirname);

var window: BrowserWindow, splash: BrowserWindow, closeLock: boolean = true;
const isDev: boolean = !app.isPackaged, isDebug = isDev || process.env.DEBUG != undefined && process.env.DEBUG.match(/true/gi) != null || process.argv.includes("-debug");
const packageData = JSON.parse(fs.readFileSync(path.join(__dirname, "/../package.json"), "utf8"));
const logger = new Logger("Main", "blue"), pLogger = new Logger("Prld", "cyan"), rLogger = new Logger("Rndr", "green"), messenger = new Messenger(logger);

const appConfig = new Store<IStore>({
    defaults: {
        changelog: null,
        firstTimeSpecial: true,
        settings: {
            theme: 0,
            reduceMotion: false,
            playerName: "Guest",
            volume: 100,
            sfxVolume: 100
        }
    },
    encryptionKey: "CosmoChamp"
});

logger.log(`Starting ${packageData.productName} ${packageData.version} on ${process.platform == "win32" ? "Windows" : "macOS"} ${os.release()}`);
logger.log(`Running on Electron ${process.versions.electron} and NodeJS ${process.versions.node}`);
autoUpdater.logger = logger;
autoUpdater.disableWebInstaller = true;

if (isDev)
    logger.log("%cDevelopment mode enabled", "magenta");
else if (isDebug)
    logger.log("%cDebug mode enabled", "cyan");

async function createWindow() {
    window = new BrowserWindow({
        title: packageData.productName,
        width: 1000,
        height: 600,
        frame: false,
        resizable: false,
        fullscreen: false,
        fullscreenable: false,
        maximizable: false,
        show: false,
        icon: !isDev ? path.join(__dirname, "./dist/www/logo.png") : path.join(__dirname, "../svelte/static/logo.png"),
        titleBarStyle: "hiddenInset",
        trafficLightPosition: { x: 12, y: 12 },
        webPreferences: {
            devTools: isDebug,
            preload: path.join(__dirname, "preload.js")
        }
    });

    window.loadURL(!isDev ? `file:///${path.join(__dirname, "www", "index.html")}` : "http://localhost:5173/");
    window.once("ready-to-show", () => splash.webContents.send("WindowReady"));
    if (process.platform == "darwin") {
        window.on("close", (e) => {
            if (closeLock) {
                e.preventDefault();
                window.webContents.send("WindowClose");
            }
        });
    }

    window.webContents.setWindowOpenHandler(({ url }) => {
        try {
            let { protocol } = new URL(url);

            if (protocol == "http:" || protocol == "https:") {
                logger.log(`Opening ${url}`);
                shell.openExternal(url);
                return { action: "deny" };
            }
            else
                return { action: "allow" };
        }
        catch {
            return { action: "deny" };
        }
    });

    splash = new BrowserWindow({
        title: packageData.productName,
        width: 450,
        height: 300,
        frame: false,
        resizable: false,
        fullscreen: false,
        fullscreenable: false,
        maximizable: false,
        show: false,
        icon: !isDev ? path.join(__dirname, "./dist/www/logo.png") : path.join(__dirname, "../svelte/static/logo.png"),
        webPreferences: {
            devTools: isDebug,
            preload: path.join(__dirname, "preload.js")
        }
    });

    splash.loadURL(!isDev ? `file:///${path.join(__dirname, "www", "splash.html")}` : "http://localhost:5173/splash/");
    splash.once("ready-to-show", () => splash.show());
}

app.whenReady().then(() => createWindow());

app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
});

//#region Updater

autoUpdater.on("download-progress", (info) => splash.webContents.send("CFUProgress", info.percent));

autoUpdater.on("update-downloaded", () => autoUpdater.quitAndInstall());

//#endregion

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

ipcMain.on("CheckForUpdates", () => {
    autoUpdater.checkForUpdates();

    if (isDev)
        splash.webContents.send("CFUStatus", false);
    
    autoUpdater.once("update-available", (e) => {
        appConfig.set("changelog", e.releaseNotes);
        splash.webContents.send("CFUStatus", true);
    });
    autoUpdater.once("update-not-available", () => splash.webContents.send("CFUStatus", false));
    autoUpdater.once("update-cancelled", () => splash.webContents.send("CFUStatus", false));
    autoUpdater.once("error", (error) => {
        logger.error(error.message);
        splash.webContents.send("CFUStatus", false);
    });
});

ipcMain.on("CloseWindow", () => {
    closeLock = false;
    BrowserWindow.getFocusedWindow()!.close();
});

ipcMain.on("MinimizeWindow", () => BrowserWindow.getFocusedWindow()!.minimize());

ipcMain.on("OpenMain", () => {
    splash.close();
    window.show();
});

ipcMain.on("GetSetting", (event, key: string) => event.returnValue = appConfig.get(key));

ipcMain.on("SetSetting", (_event, key: string, value: any) => appConfig.set(key, value));

ipcMain.on("ResetSettings", () => appConfig.clear());

ipcMain.on("GetAppInfo", (event) => {
    event.returnValue = {
        name: packageData.productName,
        version: packageData.version
    }
});

ipcMain.on("GetPlatform", (event) => event.returnValue = process.platform);

ipcMain.handle("CreateServer", async (_event, ip: string, port: any) => {
    try {
        return await messenger.createServer(ip, port, (message) => window.webContents.send("SendMessage", message), () => window.webContents.send("CloseConnection"));
    }
    catch (err) {
        return err;
    }
});

ipcMain.handle("ConnectClient", async (_event, ip: string, port: any) => {
    try {
        return await messenger.connectClient(ip, port, (message) => window.webContents.send("SendMessage", message), () => window.webContents.send("CloseConnection"));
    }
    catch (err) {
        return err;
    }
});

ipcMain.on("SendMessage", (_event, message: string) => messenger.send(message));

ipcMain.on("CloseConnection", () => messenger.close());

//#endregion