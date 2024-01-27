import { contextBridge, ipcRenderer } from "electron";

let wReady = false, winReady: () => unknown, cfuProgress: (percent: number) => unknown, receiveMessage: (message: string) => unknown, socketClose: () => unknown;
const pLog = (msg: string) => ipcRenderer.send("LoggerPreload", "info", msg);

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
 * Checks if there's an update available for the app passing the result to the statusCallback, if there's an update available the progressCallback is called with the percentage of the download
 * 
 * @param statusCallback The function to receive the update status
 * @param progressCallback The function to receive the download progress
 */
export function checkForUpdates(statusCallback: (available: boolean) => unknown, progressCallback: (percent: number) => unknown) {
    ipcRenderer.send("CheckForUpdates");

    ipcRenderer.once("CFUStatus", (_, available: boolean) => statusCallback(available));
    cfuProgress = progressCallback;
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
 * Closes the splash window and reveals the main one
 */
export function openMain() {
    ipcRenderer.send("OpenMain");
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
 * Closes the currently open connection
 */
export function closeConnection() {
    return ipcRenderer.send("CloseConnection");
}

/**
 * Updates the callback function reference to where the main window status should be sent
 * 
 * @param callback The function to receive the window status
 */
export function updateReadyCallback(callback: () => unknown) {
    winReady = callback;
    if (wReady)
        callback();
}

/**
 * Updates the callback function reference to where the messages should be sent
 * 
 * @param callback The function to receive the messages
 */
export function updateReceiveCallback(callback: (message: string) => unknown) {
    receiveMessage = callback;
}

/**
 * Updates the callback function reference to where the connection close event should be sent
 * 
 * @param callback The function to call when the connection closes
 */
export function updateCloseCallback(callback: () => unknown) {
    socketClose = callback;
}

ipcRenderer.on("CFUProgress", (_, percent: number) => cfuProgress(percent));

ipcRenderer.on("WindowReady", () => {
    if (winReady)
        winReady();
    else
        wReady = true;
});

ipcRenderer.on("SendMessage", (_, message: string) => {
    pLog(`MESSAGE: ${message}`);
    receiveMessage(message);
});

ipcRenderer.on("CloseConnection", () => socketClose());

contextBridge.exposeInMainWorld("app", {
    log,
    warn,
    error,
    checkForUpdates,
    closeWindow,
    minimizeWindow,
    openMain,
    getSetting,
    setSetting,
    resetSettings,
    getAppInfo,
    createServer,
    connectClient,
    sendMessage,
    closeConnection,
    updateReadyCallback,
    updateReceiveCallback,
    updateCloseCallback
});