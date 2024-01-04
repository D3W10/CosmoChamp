"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const logger_1 = __importDefault(require("./logger"));
require("electron-reload")(__dirname);
var window, splash;
const winWidth = 1000, winHeight = 600, isProd = process.env.NODE_ENV == "production" && (process.env.DEBUG == undefined ? true : process.env.DEBUG.match(/true/gi) == null) && !process.argv.includes("DEBUG");
const logger = new logger_1.default("Main", 34), pLogger = new logger_1.default("Preload", 32), packageData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "/../package.json"), "utf8"));
logger.log(`Starting ${packageData.displayName} ${packageData.version} on ${process.platform == "win32" ? "Windows" : "macOS"} ${os_1.default.release()}`);
logger.log("Running on Electron " + process.versions.electron + " and NodeJS " + process.versions.node);
if (!isProd)
    logger.log("\x1b[35mDEBUG mode enabled!\x1b[0m");
async function createWindow() {
    window = new electron_1.BrowserWindow({
        title: packageData.displayName,
        width: winWidth,
        height: winHeight,
        frame: false,
        resizable: false,
        fullscreen: false,
        fullscreenable: false,
        maximizable: false,
        show: true,
        icon: path_1.default.join(__dirname, "./www/branding/logo.png"),
        webPreferences: {
            devTools: !isProd,
            preload: path_1.default.join(__dirname, "preload.js")
        }
    });
    window.loadURL(isProd ? "file:///" + path_1.default.join(__dirname, "www", "index.html") : "http://localhost:5173/");
    window.once("ready-to-show", () => window.show());
    //updaterInfo.initAutoUpdater(autoUpdater, mainWindow.window);
}
/* if (!app.requestSingleInstanceLock())
    app.quit(); */
//app.on("second-instance", (_, argv) => uriHandler(argv));
electron_1.app.whenReady().then(() => createWindow());
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
//#region Preload Events
electron_1.ipcMain.on("LoggerInfo", (_, msg) => pLogger.log(msg));
electron_1.ipcMain.on("LoggerWarn", (_, msg) => pLogger.warn(msg));
electron_1.ipcMain.on("LoggerError", (_, msg) => pLogger.error(msg));
electron_1.ipcMain.on("CloseWindow", () => electron_1.BrowserWindow.getFocusedWindow().close());
electron_1.ipcMain.on("MinimizeWindow", () => electron_1.BrowserWindow.getFocusedWindow().minimize());
electron_1.ipcMain.on("ResizeWindow", (_, width, height) => electron_1.BrowserWindow.getFocusedWindow().setBounds({ width: width != -1 ? width : winWidth, height: height != -1 ? height : winHeight }));
electron_1.ipcMain.on("GetAppInfo", (event) => {
    event.returnValue = {
        name: packageData.displayName,
        version: packageData.version
    };
});
//#endregion
