"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppInfo = exports.compressWindow = exports.minimizeWindow = exports.closeWindow = exports.error = exports.warn = exports.log = void 0;
const electron_1 = require("electron");
let isCompressed = false;
function log(msg) {
    electron_1.ipcRenderer.send("LoggerInfo", msg);
}
exports.log = log;
function warn(msg) {
    electron_1.ipcRenderer.send("LoggerWarn", msg);
}
exports.warn = warn;
function error(msg) {
    electron_1.ipcRenderer.send("LoggerError", msg);
}
exports.error = error;
function closeWindow() {
    electron_1.ipcRenderer.send("CloseWindow");
    log("Window Closed");
}
exports.closeWindow = closeWindow;
function minimizeWindow() {
    electron_1.ipcRenderer.send("MinimizeWindow");
    log("Window Minimized");
}
exports.minimizeWindow = minimizeWindow;
function compressWindow() {
    electron_1.ipcRenderer.send("ResizeWindow", -1, !isCompressed ? 40 : -1);
    log("Window " + (!isCompressed ? "Compressed" : "Decompressed"));
    isCompressed = !isCompressed;
}
exports.compressWindow = compressWindow;
function getAppInfo() {
    return electron_1.ipcRenderer.sendSync("GetAppInfo");
}
exports.getAppInfo = getAppInfo;
electron_1.contextBridge.exposeInMainWorld("app", {
    log,
    warn,
    error,
    closeWindow,
    minimizeWindow,
    compressWindow,
    getAppInfo
});
