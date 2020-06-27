import io from "socket.io";
import http from "http";

import { SClient } from "./SClient";
import { Msg } from "../Msg";
import { IClientManager } from "./IClientManager";

class Server implements IClientManager {
    private readonly _port: number;
    private readonly _server: http.Server;
    private readonly _socketServer: io.Server;
    private readonly _clients: Map<string, SClient>;

    constructor() {
        this._clients = new Map<string, SClient>();
        this._port = Number(process.env.PORT) || 8080;
        this._server = http.createServer(this.httpReqHandler);
        this._socketServer = io.listen(this._server);
    }

    // Start Server and Register Socket Events
    public startServer() {
        this._socketServer.on("connect", this.onConnect);
        this._server.listen(this._port);
        console.log(`Server is running at port ${this._port}`);
    }

    private httpReqHandler(req: http.IncomingMessage, res: http.ServerResponse) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("Server is running...!");
    }

    private onConnect = (clientSocket: io.Socket) => {
        let username = clientSocket.request._query.username;
        console.log(`(${username} | ${clientSocket.id}) is requesting to connect!`);
        if (this._clients.has(username)) {
            let sClient = this._clients.get(username);
            // @ts-ignore
            if (sClient.isConnected()) {
                clientSocket.send(Msg.Message("[ERROR]: Provided username is already exist."));
                clientSocket.disconnect();
            } else {
                // @ts-ignore
                sClient.updateSocket(clientSocket);
                clientSocket.send(Msg.Message(`[NOTE]: Successfully update existing profile! (username is '${username}')`));
                // @ts-ignore
                if (sClient.isHasLiveConnection()) {
                    // @ts-ignore
                    clientSocket.send(Msg.Message(`[NOTE]: You had a connection with ${sClient.getClientName()}')`));
                }
            }

        } else {
            let client = new SClient(this, username, clientSocket);
            this._clients.set(username, client);
            clientSocket.send(Msg.Message(`[NOTE]: Successfully connected! (username is '${username}')`));
        }
    };

    public formattedClientList = (except: string): string => {
        let listUsernames = Array.from(this._clients.keys())
            .filter((username) => username != except);
        if (listUsernames.length == 0) {
            return "[NOTE]: No Clients are online!";
        } else {
            return (`[NOTE]: Available Clients (${listUsernames.length}),\n\t${listUsernames.join("\n\t")}`);
        }
    };

    public connectClients = (username1: string, username2: string, force: boolean = false): void => {
        let client1 = this._clients.get(username1);
        let client2 = this._clients.get(username2);
        // @ts-ignore
        if (client1 && client1.isConnected()) {
            // @ts-ignore
            if (client2 && client2.isConnected()) {
                if (force) {
                    client1.connectWithClient(client2);
                    client2.connectWithClient(client1);
                    client1.send(Msg.Message(`[CONNECTED]: Successfully reconnected with ${username2}`));
                    client2.send(Msg.Message(`[CONNECTED]: Successfully reconnected with ${username1}`));
                } else if (client2.isHasLiveConnection()) {
                    client1.send(Msg.Message("[ERROR]: Requested client has connected to someone!"));
                } else {
                    client1.connectWithClient(client2);
                    client2.connectWithClient(client1);
                    client1.send(Msg.Message(`[CONNECTED]: Successfully connected with ${username2}`));
                    client2.send(Msg.Message(`[CONNECTED]: Successfully connected with ${username1}`));
                }
            } else {
                client1.send(Msg.Message("[ERROR]: Requested client is disconnected!"));
            }
        }
    };
}

// Start Server
const server = new Server();
server.startServer();