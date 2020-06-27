import { Socket } from "socket.io";
import { Msg } from "../Msg";
import { IClientManager } from "./IClientManager";

export class SClient {
    private _server: IClientManager;
    public readonly _username: string;
    private _sock: Socket;
    private _client?: SClient;
    // private _files: Map<string, File>;

    constructor(server: IClientManager, username: string, socket: Socket) {
        this._server = server;
        this._username = username;
        this._sock = socket;
        // this._files = new Map<string, File>();

        this._sock.on("message", this.onMessage);
    }

    private onMessage = (msg: Msg) => {
        switch (msg.code) {
            case Msg.sText:
                if (msg.content) {
                    console.log(`[${this._username}]: ${msg.content}`);
                    if (this._client) {
                        this._client.send(Msg.Message(`[${this._username}]: ${msg.content}`));
                    } else {
                        this.send(Msg.Message("[WARNING]: No one has connected with you!"));
                    }
                }
                break;
            case Msg.rLIST:
                this.send(Msg.Message(this._server.formattedClientList(this._username)));
                break;
            case Msg.rCONN:
                this._server.connectClients(this._username, msg.content);
                break;
            case Msg.sFILE:
                if (this._client) {
                    this._client.send(msg);
                } else {
                    this.send(Msg.Message("[WARNING]: No one has connected with you!"));
                }
                break;
            default:
                console.log(msg);
        }
    };

    public isDisconnected(): boolean {
        return this._sock.disconnected;
    }

    public isConnected(): boolean {
        return this._sock.connected;
    }

    public isHasLiveConnection(): boolean {
        if (this._client)
            return this._client.isConnected();
        else
            return false;
    }

    public connectWithClient(client: SClient) {
        this._client = client;
    }

    public send(msg: Msg) {
        this._sock.send(msg);
    }


    public getClientName(): string {
        if (this._client)
            return this._client._username;
        else {
            return "";
        }
    }

    public updateSocket(socket: Socket) {
        this._sock = socket;
        this._sock.on("message", this.onMessage);
    }
}
