import * as logger from "electron-log";

class Logger {
    private readonly name: string;
    private readonly color: string;

    constructor(name: string, color: number) {
        this.name = name.toUpperCase();
        this.color = `\x1b[${color}m`;

        logger.transports.file.fileName = "logs.log";
        logger.transports.file.getFile().clear();
    }

    info(msg: any) {
        this.log(msg);
    }

    log(msg: any) {
        logger.info(`${this.toString()} - ${msg}`);
    }

    warn(msg: any) {
        logger.warn(`${this.toString()} - \x1b[33m${msg}\x1b[0m`);
    }

    error(msg: any) {
        logger.error(`${this.toString()} - \x1b[31m${msg}\x1b[0m`);
    }

    toString() {
        return `[${this.color}${this.name}\x1b[0m]`;
    }
}

export default Logger;