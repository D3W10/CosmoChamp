import { contextBridge, ipcRenderer } from "electron";

let receiveMessage: (message: string) => unknown;
const pLog = (msg: string) => ipcRenderer.send("LoggerPreload", "info", msg);
const pWarn = (msg: string) => ipcRenderer.send("LoggerPreload", "warn", msg);
const pError = (msg: string) => ipcRenderer.send("LoggerPreload", "error", msg);

export interface AppInfo {
    name: string;
    version: string;
}

/**
 * Logs a message to the console
 */
export function log(msg: string) {
    ipcRenderer.send("LoggerRenderer", "info", msg);
}

/**
 * Logs a warning message to the console
 */
export function warn(msg: string) {
    ipcRenderer.send("LoggerRenderer", "warn", msg);
}

/**
 * Logs an error message to the console
 */
export function error(msg: string) {
    ipcRenderer.send("LoggerRenderer", "error", msg);
}

/**
 * Closes the current window
 */
export function closeWindow() {
    ipcRenderer.send("CloseWindow");
    pLog("Window Closed");
}

/**
 * Minimizes the current window
 */
export function minimizeWindow() {
    ipcRenderer.send("MinimizeWindow");
    pLog("Window Minimized");
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
 * @returns The application info
 */
export function getAppInfo() {
    return ipcRenderer.sendSync("GetAppInfo") as AppInfo;
}

/**
 * Creates a server with the provided IP address and port number
 * 
 * @param ip The IP address to bind the server to
 * @param port The port number to listen on
 * @returns The success/error code
 */
export async function createServer(ip: string, port: number) {
    return await ipcRenderer.invoke("CreateServer", ip, port) as Promise<string>;
}

/**
 * Connects to a server with the provided IP address and port number
 * 
 * @param ip The IP address of the server to connect
 * @param port The port number of the server to connect
 * @returns The success/error code
 */
export async function connectClient(ip: string, port: number) {
    return await ipcRenderer.invoke("ConnectClient", ip, port) as Promise<string>;
}

/**
 * Sends a message to the server/client connected
 * 
 * @param message The message to send to the server/client
 */
export function sendMessage(message: string) {
    return ipcRenderer.send("SendMessage", message);
}

/**
 * Updates the callback function reference to where messages should be sent
 * 
 * @param callback The function to receive the messages
 */
export function updateReceiveCallback(callback: (message: string) => unknown) {
    receiveMessage = callback;
}

ipcRenderer.on("SendMessage", (_event, message: string) => {
    pLog(`Msg: ${message}`);
    receiveMessage(message);
});

contextBridge.exposeInMainWorld("app", {
    log,
    warn,
    error,
    closeWindow,
    minimizeWindow,
    getSetting,
    setSetting,
    resetSettings,
    getAppInfo,
    createServer,
    connectClient,
    sendMessage,
    updateReceiveCallback
});