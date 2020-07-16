import io, { Socket } from "socket.io";
import { Socket as ClientSocket } from "socket.io-client";

interface SocketWrapper {
    readonly username: string;
    readonly password: string;
    readonly socket: Socket;
}


export class SocketHub {
    private _sockets: Map<string, SocketWrapper>;

    constructor() {
        this._sockets = new Map<string, SocketWrapper>();
    }

    availableClients(): string[] {
        let online: string[] = []
        this._sockets.forEach((sw, username) => {
            if (sw.socket.connected) online.push(username)
        })
        return online;
    }

    selectSocket(username: string): Socket | undefined {
        let sw = this._sockets.get(username);
        if (sw) {
            return sw.socket
        }
        return;
    }

    verify(username: string, password: string): boolean {
        let sw = this._sockets.get(username);
        if (sw && sw.password != password) {
            return false
        }
        return true;
    }

    setSocket(username: string, password: string, socket: Socket) {
        this._sockets.set(username, {username, password, socket});
    }

    removeSocket(username: string) {
        this._sockets.delete(username);
    }
}
