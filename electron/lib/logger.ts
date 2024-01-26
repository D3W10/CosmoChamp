import * as logger from "electron-log";

class Logger {
    private readonly name: string;
    private readonly color: string;

    constructor(name: string, color: number) {
        this.name = name.toUpperCase();
        this.color = `\x1b[${color}m`;
    }

    info(msg: any) {
        this.log(msg);
    }

    log(msg: any) {
        logger.info(`${this.toString()} - ${msg}`);
    }

    warn(msg: any) {
        logger.warn(`${this.toString()} - ${msg}`);
    }

    error(msg: any) {
        logger.error(`${this.toString()} - ${msg}`);
    }

    toString() {
        return `${this.color}[${this.name}]\x1b[0m`;
    }
}

export default Logger;