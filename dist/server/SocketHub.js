"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketHub = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU29ja2V0SHViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZlci9Tb2NrZXRIdWIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBVUEsTUFBYSxTQUFTO0lBR2xCO1FBQ0ksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBeUIsQ0FBQztJQUNyRCxDQUFDO0lBRUQsZ0JBQWdCO1FBQ1osSUFBSSxNQUFNLEdBQWEsRUFBRSxDQUFBO1FBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQ25DLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTO2dCQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDbEQsQ0FBQyxDQUFDLENBQUE7UUFDRixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsWUFBWSxDQUFDLFFBQWdCO1FBQ3pCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLElBQUksRUFBRSxFQUFFO1lBQ0osT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFBO1NBQ25CO1FBQ0QsT0FBTztJQUNYLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtRQUNyQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsUUFBUSxJQUFJLFFBQVEsRUFBRTtZQUMvQixPQUFPLEtBQUssQ0FBQTtTQUNmO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELFNBQVMsQ0FBQyxRQUFnQixFQUFFLFFBQWdCLEVBQUUsTUFBYztRQUN4RCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELFlBQVksQ0FBQyxRQUFnQjtRQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0NBQ0o7QUF0Q0QsOEJBc0NDIn0=