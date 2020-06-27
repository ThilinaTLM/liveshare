"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const SClient_1 = require("./SClient");
const Msg_1 = require("../Msg");
class Server {
    constructor() {
        this.onConnect = (clientSocket) => {
            let username = clientSocket.request._query.username;
            console.log(`(${username} | ${clientSocket.id}) is requesting to connect!`);
            if (this._clients.has(username)) {
                let sClient = this._clients.get(username);
                // @ts-ignore
                if (sClient.isConnected()) {
                    clientSocket.send(Msg_1.Msg.Message("[ERROR]: Provided username is already exist."));
                    clientSocket.disconnect();
                }
                else {
                    // @ts-ignore
                    sClient.updateSocket(clientSocket);
                    clientSocket.send(Msg_1.Msg.Message(`[NOTE]: Successfully update existing profile! (username is '${username}')`));
                    // @ts-ignore
                    if (sClient.isHasLiveConnection()) {
                        // @ts-ignore
                        clientSocket.send(Msg_1.Msg.Message(`[NOTE]: You had a connection with ${sClient.getClientName()}')`));
                    }
                }
            }
            else {
                let client = new SClient_1.SClient(this, username, clientSocket);
                this._clients.set(username, client);
                clientSocket.send(Msg_1.Msg.Message(`[NOTE]: Successfully connected! (username is '${username}')`));
            }
        };
        this.formattedClientList = (except) => {
            let listUsernames = Array.from(this._clients.keys())
                .filter((username) => username != except);
            if (listUsernames.length == 0) {
                return "[NOTE]: No Clients are online!";
            }
            else {
                return (`[NOTE]: Available Clients (${listUsernames.length}),\n\t${listUsernames.join("\n\t")}`);
            }
        };
        this.connectClients = (username1, username2, force = false) => {
            let client1 = this._clients.get(username1);
            let client2 = this._clients.get(username2);
            // @ts-ignore
            if (client1 && client1.isConnected()) {
                // @ts-ignore
                if (client2 && client2.isConnected()) {
                    if (force) {
                        client1.connectWithClient(client2);
                        client2.connectWithClient(client1);
                        client1.send(Msg_1.Msg.Message(`[CONNECTED]: Successfully reconnected with ${username2}`));
                        client2.send(Msg_1.Msg.Message(`[CONNECTED]: Successfully reconnected with ${username1}`));
                    }
                    else if (client2.isHasLiveConnection()) {
                        client1.send(Msg_1.Msg.Message("[ERROR]: Requested client has connected to someone!"));
                    }
                    else {
                        client1.connectWithClient(client2);
                        client2.connectWithClient(client1);
                        client1.send(Msg_1.Msg.Message(`[CONNECTED]: Successfully connected with ${username2}`));
                        client2.send(Msg_1.Msg.Message(`[CONNECTED]: Successfully connected with ${username1}`));
                    }
                }
                else {
                    client1.send(Msg_1.Msg.Message("[ERROR]: Requested client is disconnected!"));
                }
            }
        };
        this._clients = new Map();
        this._port = Number(process.env.PORT) || 8080;
        this._server = http_1.default.createServer(this.httpReqHandler);
        this._socketServer = socket_io_1.default.listen(this._server);
    }
    // Start Server and Register Socket Events
    startServer() {
        this._socketServer.on("connect", this.onConnect);
        this._server.listen(this._port);
        console.log(`Server is running at port ${this._port}`);
    }
    httpReqHandler(req, res) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("Server is running...!");
    }
}
// Start Server
const server = new Server();
server.startServer();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZlci9TZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwREFBMkI7QUFDM0IsZ0RBQXdCO0FBRXhCLHVDQUFvQztBQUNwQyxnQ0FBNkI7QUFHN0IsTUFBTSxNQUFNO0lBTVI7UUFtQlEsY0FBUyxHQUFHLENBQUMsWUFBdUIsRUFBRSxFQUFFO1lBQzVDLElBQUksUUFBUSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNwRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksUUFBUSxNQUFNLFlBQVksQ0FBQyxFQUFFLDZCQUE2QixDQUFDLENBQUM7WUFDNUUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDN0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzFDLGFBQWE7Z0JBQ2IsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUU7b0JBQ3ZCLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBRyxDQUFDLE9BQU8sQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDLENBQUM7b0JBQy9FLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQztpQkFDN0I7cUJBQU07b0JBQ0gsYUFBYTtvQkFDYixPQUFPLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUNuQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQUcsQ0FBQyxPQUFPLENBQUMsK0RBQStELFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDNUcsYUFBYTtvQkFDYixJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxFQUFFO3dCQUMvQixhQUFhO3dCQUNiLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBRyxDQUFDLE9BQU8sQ0FBQyxxQ0FBcUMsT0FBTyxDQUFD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