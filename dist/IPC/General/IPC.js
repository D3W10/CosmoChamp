"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IPC {
    constructor(channels) {
        this.nameAPI = "api";
        this.validSendChannel = {};
        this.validReceiveChannel = [];
        this.nameAPI = channels.nameAPI;
        this.validSendChannel = channels.validSendChannel;
        this.validReceiveChannel = channels.validReceiveChannel;
    }
    get channels() {
        return {
            nameAPI: this.nameAPI,
            validSendChannel: this.validSendChannel,
            validReceiveChannel: this.validReceiveChannel
        };
    }
    async initIpcMain(ipcMain, customWindow) {
        if (customWindow) {
            Object.keys(this.validSendChannel).forEach(key => {
                ipcMain.on(key, async (event, message) => {
                    //await toTryAsync(() => this.validSendChannel[key](customWindow, event, message), e => catchError(e));
                });
            });
        }
    }
}
exports.default = IPC;
const catchError = (e) => { if (e instanceof TypeError)
    console.log(e); };
