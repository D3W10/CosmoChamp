import { contextBridge, ipcRenderer } from "electron";

let isCompressed = false;

export interface AppInfo {
    name: string;
    version: string;
}

export function log(msg: string) {
    ipcRenderer.send("LoggerInfo", msg);
}

export function warn(msg: string) {
    ipcRenderer.send("LoggerWarn", msg);
}

export function error(msg: string) {
    ipcRenderer.send("LoggerError", msg);
}

export function closeWindow() {
    ipcRenderer.send("CloseWindow");
    log("Window Closed");
}

export function minimizeWindow() {
    ipcRenderer.send("MinimizeWindow");
    log("Window Minimized");
}

export function compressWindow() {
    ipcRenderer.send("ResizeWindow", -1, !isCompressed ? 40 : -1);
    log("Window " + (!isCompressed ? "Compressed" : "Decompressed"));
    isCompressed = !isCompressed;
}

export function getAppInfo() {
    return ipcRenderer.sendSync("GetAppInfo") as AppInfo;
}

contextBridge.exposeInMainWorld("app", {
    log,
    warn,
    error,
    closeWindow,
    minimizeWindow,
    compressWindow,
    getAppInfo
});