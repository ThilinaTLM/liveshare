import { Socket } from "socket.io";

export interface Member {
    username: string
    socket: Socket
}

export interface Room {
    verify(password: string): boolean;
    join(username: string, socket: Socket): boolean;
    remove(username: string): boolean;
}

class RealRoom implements Room {
    private readonly _name: string;
    private readonly _password: string;
    private readonly _members: Map<string, Member>;

    constructor(name: string, password: string) {
        this._name = name;
        this._password = password;
        this._members = new Map<string, Member>();
    }

    verify(password: string): boolean {
        return (this._password == password);
    }

    join(username: string, socket: Socket): boolean {
        this._members.set(username, { username, socket });
        return true;
    }

    remove(username: string): boolean {
        this._members.delete(username);
        return true;
    }
}

class FakeRoom implements Room {
    static instance = new FakeRoom();

    private constructor() {}

    join(username: string, socket: Socket): boolean {
        return false
    }
    remove(username: string): boolean {
        return false
    }
    verify(password: string): boolean {
        return false;
    }
}

export class House {
    private _rooms: Map<string, Room>;

    constructor() {
        this._rooms = new Map<string, Room>();
    }

    select(roomName: string, password: string): Room {
        let room = this._rooms.get(roomName);
        if (!room) {
            room = new RealRoom(roomName, password);
            this._rooms.set(roomName, room);
            return room;
        }

        if (room.verify(password)) {
            return room;
        }
        return FakeRoom.instance;
    }

    forceSelect(roomName: string): Room {
        let room = this._rooms.get(roomName);
        if (room) return room;
        return FakeRoom.instance
    }

}