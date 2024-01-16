import net from "net";
import Logger from "./logger";

class Messenger {
    private readonly logger: Logger;
    socket: net.Socket | null;

    constructor(logger: Logger) {
        this.logger = logger;
        this.socket = null;
    }

    public createServer(ip: string, port: number, dataCallback: (data: string) => unknown) {
        return new Promise<string>((resolve, reject) => {
            const server = net.createServer();
    
            server.listen(port, ip, () => {
                this.logger.log("Server started");
                resolve("CONNECTED");
            });

            server.on("connection", (s) => {
                this.logger.log("Client joined");
                this.socket = s;
                this.socket.on("data", (data: Buffer) => dataCallback(data.toString("utf-8")));
            });
            
            server.on("error", (e: any) => reject(e.code));
            
            server.on("close", () => {}/*app.subscribe(($app) => $app?.log("Server closed"))*/);
        });
    }
    
    public connectClient(ip: string, port: number, dataCallback: (data: string) => unknown) {
        return new Promise<string>((resolve, reject) => {
            this.socket = net.createConnection({ host: ip, port: port }, () => {
                this.logger.log("Client connected");
                resolve("CONNECTED");
            });
    
            this.socket.on("data", (data: Buffer) => dataCallback(data.toString("utf-8")));
        
            this.socket.on("error", (e: any) => reject(e.code));
        });
    }
    
    public send(message: string) {
        this.socket?.write(message);
    }
}

export default Messenger;