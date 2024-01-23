import * as logger from "electron-log";

class Logger {
    private readonly name: string;
    private readonly color: string;

    constructor(name: string, color: number) {
        this.name = name.toUpperCase();
        this.color = `\x1b[${color}m`;
    }

    log(msg: string) {
        logger.info(`${this.toString()} - ${msg}`);
    }

    warn(msg: string) {
        logger.warn(`${this.toString()} - ${msg}`);
    }

    error(msg: string) {
        logger.error(`${this.toString()} - ${msg}`);
    }

    toString() {
        return `${this.color}[${this.name}]\x1b[0m`;
    }
}

export default Logger;