import { contextBridge, ipcRenderer } from "electron";

let isCompressed = false;

export interface AppInfo {
    name: string;
    version: string;
}

/**
 * Logs a message to the console
 */
export function log(msg: string) {
    ipcRenderer.send("LoggerInfo", msg);
}

/**
 * Logs a warning message to the console
 */
export function warn(msg: string) {
    ipcRenderer.send("LoggerWarn", msg);
}

/**
 * Logs an error message to the console
 */
export function error(msg: string) {
    ipcRenderer.send("LoggerError", msg);
}

/**
 * Closes the current window
 */
export function closeWindow() {
    ipcRenderer.send("CloseWindow");
    log("Window Closed");
}

/**
 * Minimizes the current window
 */
export function minimizeWindow() {
    ipcRenderer.send("MinimizeWindow");
    log("Window Minimized");
}

/**
 * Toggle the window compression
 */
export function compressWindow() {
    ipcRenderer.send("ResizeWindow", -1, !isCompressed ? 40 : -1);
    log("Window " + (!isCompressed ? "Compressed" : "Decompressed"));
    isCompressed = !isCompressed;
}

/**
 * Obtains a setting by it's key from the settings file
 * @param key The key of the setting you want to get
 * @returns The setting value
 */
export function getSetting(key: string) {
    return ipcRenderer.sendSync("GetSetting", key);
}

/**
 * Defines a new value for a specific setting
 * @param key The key of the setting you want to set
 * @param value The new value of the setting
 */
export function setSetting(key: string, value: any) {
    return ipcRenderer.send("SetSetting", key, value);
}

/**
 * Resets all settings to their default values
 */
export function resetSettings() {
    return ipcRenderer.send("ResetSettings");
}

/**
 * Obtains the application info
 */
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
    getSetting,
    setSetting,
    resetSettings,
    getAppInfo
});