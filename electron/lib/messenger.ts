import net from "net";
import Logger from "./logger";

class Messenger {
    private readonly logger: Logger;
    socket: net.Socket | null;
    server: net.Server | null;
    messageQueue: string[] = [];
    isSending: boolean = false;

    constructor(logger: Logger) {
        this.logger = logger;
        this.socket = null;
        this.server = null;
    }

    public createServer(ip: string, port: number, dataCallback: (data: string) => unknown, closeCallback: () => unknown) {
        return new Promise<string>((resolve, reject) => {
            this.server = net.createServer();
    
            this.server.listen(port, ip, () => {
                this.logger.log("Server started");
                resolve("CONNECTED");
            });

            this.server.on("connection", (s) => {
                this.logger.log("Client joined");
                this.socket = s;

                this.socket.on("data", (data: Buffer) => dataCallback(data.toString("utf-8")));

                this.socket.on("close", () => {
                    this.logger.log("Client left");
                    closeCallback();
                });
            });
            
            this.server.on("error", (e: any) => reject(e.code));

            this.server.on("close", () => this.logger.log("Server closed"));
        });
    }
    
    public connectClient(ip: string, port: number, dataCallback: (data: string) => unknown, closeCallback: () => unknown) {
        return new Promise<string>((resolve, reject) => {
            this.socket = net.createConnection({ host: ip, port: port }, () => {
                this.logger.log("Client connected");
                resolve("CONNECTED");
            });
    
            this.socket.on("data", (data: Buffer) => dataCallback(data.toString("utf-8")));

            this.socket.on("error", (e: any) => reject(e.code));

            this.socket.on("close", () => {
                this.logger.log("Client disconnected");
                closeCallback();
            });
        });
    }
    
    public send(message: string) {
        if(!this.isSending)
            this.sendImmediately(message);
        else
            this.messageQueue.push(message);
    }

    private sendImmediately(message: string) {
        this.isSending = true;
        this.socket?.write(message);
        this.sendNextInQueue();
    }

    private sendNextInQueue() {
        if(this.messageQueue.length > 0) {
            const nextMessage = this.messageQueue.shift();

            setTimeout(() => {
                this.socket?.write(nextMessage!);
                this.sendNextInQueue();
            }, 50);
        }
        else
            this.isSending = false;
    }

    public close() {
        this.socket?.destroy();
        this.server?.close();
    }
}

export default Messenger;