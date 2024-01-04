"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IPC_1 = __importDefault(require("./IPC"));
const nameAPI = "windowControls";
// to main
const validSendChannel = {
    "minimize": minimize,
    "maximize": maximize,
    "unmaximize": unmaximize,
    "close": close
};
// from Main
const validReceiveChannel = [];
const windowControls = new IPC_1.default({
    nameAPI,
    validSendChannel,
    validReceiveChannel
});
exports.default = windowControls;
// Enter here the functions for ElectronJS
function minimize(customWindow, event, message) {
    customWindow.minimize();
}
function maximize(customWindow, event, message) {
    customWindow.maximize();
}
function close(customWindow, event, message) {
    customWindow.destroy();
}
function unmaximize(customWindow, event, message) {
    customWindow.unmaximize();
}
