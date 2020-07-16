"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketHub {
    constructor() {
        this._sockets = new Map();
    }
    availableClients() {
        let online = [];
        this._sockets.forEach((sw, username) => {
            if (sw.socket.connected)
                online.push(username);
        });
        return online;
    }
    selectSocket(username) {
        let sw = this._sockets.get(username);
        if (sw) {
            return sw.socket;
        }
        return;
    }
    verify(username, password) {
        let sw = this._sockets.get(username);
        if (sw && sw.password != password) {
            return false;
        }
        return true;
    }
    setSocket(username, password, socket) {
        this._sockets.set(username, { username, password, socket });
    }
    removeSocket(username) {
        this._sockets.delete(username);
    }
}
exports.SocketHub = SocketHub;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU29ja2V0SHViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZlci9Tb2NrZXRIdWIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFVQSxNQUFhLFNBQVM7SUFHbEI7UUFDSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUF5QixDQUFDO0lBQ3JELENBQUM7SUFFRCxnQkFBZ0I7UUFDWixJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUE7UUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUU7WUFDbkMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVM7Z0JBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNsRCxDQUFDLENBQUMsQ0FBQTtRQUNGLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxZQUFZLENBQUMsUUFBZ0I7UUFDekIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsSUFBSSxFQUFFLEVBQUU7WUFDSixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUE7U0FDbkI7UUFDRCxPQUFPO0lBQ1gsQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFnQixFQUFFLFFBQWdCO1FBQ3JDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLElBQUksUUFBUSxFQUFFO1lBQy9CLE9BQU8sS0FBSyxDQUFBO1NBQ2Y7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsU0FBUyxDQUFDLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxNQUFjO1FBQ3hELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsWUFBWSxDQUFDLFFBQWdCO1FBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLENBQUM7Q0FDSjtBQXRDRCw4QkFzQ0MifQ==