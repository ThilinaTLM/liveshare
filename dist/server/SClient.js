"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SClient = void 0;
const Msg_1 = require("../Msg");
class SClient {
    // private _files: Map<string, File>;
    constructor(server, username, socket) {
        this.onMessage = (msg) => {
            switch (msg.code) {
                case Msg_1.Msg.sText:
                    if (msg.content) {
                        console.log(`[${this._username}]: ${msg.content}`);
                        if (this._client) {
                            this._client.send(Msg_1.Msg.Message(`[${this._username}]: ${msg.content}`));
                        }
                        else {
                            this.send(Msg_1.Msg.Message("[WARNING]: No one has connected with you!"));
                        }
                    }
                    break;
                case Msg_1.Msg.rLIST:
                    this.send(Msg_1.Msg.Message(this._server.formattedClientList(this._username)));
                    break;
                case Msg_1.Msg.rCONN:
                    this._server.connectClients(this._username, msg.content);
                    break;
                case Msg_1.Msg.sFILE:
                    if (this._client) {
                        this._client.send(msg);
                    }
                    else {
                        this.send(Msg_1.Msg.Message("[WARNING]: No one has connected with you!"));
                    }
                    break;
                default:
                    console.log(msg);
            }
        };
        this._server = server;
        this._username = username;
        this._sock = socket;
        // this._files = new Map<string, File>();
        this._sock.on("message", this.onMessage);
    }
    isDisconnected() {
        return this._sock.disconnected;
    }
    isConnected() {
        return this._sock.connected;
    }
    isHasLiveConnection() {
        if (this._client)
            return this._client.isConnected();
        else
            return false;
    }
    connectWithClient(client) {
        this._client = client;
    }
    send(msg) {
        this._sock.send(msg);
    }
    getClientName() {
        if (this._client)
            return this._client._username;
        else {
            return "";
        }
    }
    updateSocket(socket) {
        this._sock = socket;
        this._sock.on("message", this.onMessage);
    }
}
exports.SClient = SClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU0NsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvU0NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxnQ0FBNkI7QUFHN0IsTUFBYSxPQUFPO0lBS2hCLHFDQUFxQztJQUVyQyxZQUFZLE1BQXNCLEVBQUUsUUFBZ0IsRUFBRSxNQUFjO1FBUzVELGNBQVMsR0FBRyxDQUFDLEdBQVEsRUFBRSxFQUFFO1lBQzdCLFFBQVEsR0FBRyxDQUFDLElBQUksRUFBRTtnQkFDZCxLQUFLLFNBQUcsQ0FBQyxLQUFLO29CQUNWLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTt3QkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsTUFBTSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQzt3QkFDbkQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFOzRCQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxNQUFNLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQ3pFOzZCQUFNOzRCQUNILElBQUksQ0FBQyxJQUFJLENBQUMsU0FBRyxDQUFDLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLENBQUM7eUJBQ3ZFO3FCQUNKO29CQUNELE1BQU07Z0JBQ1YsS0FBSyxTQUFHLENBQUMsS0FBSztvQkFDVixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6RSxNQUFNO2dCQUNWLEtBQUssU0FBRyxDQUFDLEtBQUs7b0JBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3pELE1BQU07Z0JBQ1YsS0FBSyxTQUFHLENBQUMsS0FBSztvQkFDVixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7d0JBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQzFCO3lCQUFNO3dCQUNILElBQUksQ0FBQyxJQUFJLENBQUMsU0FBRyxDQUFDLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZFO29CQUNELE1BQU07Z0JBQ1Y7b0JBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN4QjtRQUNMLENBQUMsQ0FBQztRQXBDRSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUNwQix5Q0FBeUM7UUFFekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBZ0NNLGNBQWM7UUFDakIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztJQUNuQyxDQUFDO0lBRU0sV0FBVztRQUNkLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUVNLG1CQUFtQjtRQUN0QixJQUFJLElBQUksQ0FBQyxPQUFPO1lBQ1osT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDOztZQUVsQyxPQUFPLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRU0saUJBQWlCLENBQUMsTUFBZTtRQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRU0sSUFBSSxDQUFDLEdBQVE7UUFDaEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUdNLGFBQWE7UUFDaEIsSUFBSSxJQUFJLENBQUMsT0FBTztZQUNaLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7YUFDN0I7WUFDRCxPQUFPLEVBQUUsQ0FBQztTQUNiO0lBQ0wsQ0FBQztJQUVNLFlBQVksQ0FBQyxNQUFjO1FBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0MsQ0FBQztDQUNKO0FBbEZELDBCQWtGQyJ9