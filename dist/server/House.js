"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.House = void 0;
class RealRoom {
    constructor(name, password) {
        this._name = name;
        this._password = password;
        this._members = new Map();
    }
    verify(password) {
        return (this._password == password);
    }
    join(username, socket) {
        this._members.set(username, { username, socket });
        return true;
    }
    remove(username) {
        this._members.delete(username);
        return true;
    }
}
class FakeRoom {
    constructor() { }
    join(username, socket) {
        return false;
    }
    remove(username) {
        return false;
    }
    verify(password) {
        return false;
    }
}
FakeRoom.instance = new FakeRoom();
class House {
    constructor() {
        this._rooms = new Map();
    }
    select(roomName, password) {
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
    forceSelect(roomName) {
        let room = this._rooms.get(roomName);
        if (room)
            return room;
        return FakeRoom.instance;
    }
}
exports.House = House;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG91c2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmVyL0hvdXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQWFBLE1BQU0sUUFBUTtJQUtWLFlBQVksSUFBWSxFQUFFLFFBQWdCO1FBQ3RDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7SUFDOUMsQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFnQjtRQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxRQUFRLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsSUFBSSxDQUFDLFFBQWdCLEVBQUUsTUFBYztRQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNsRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQWdCO1FBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQUVELE1BQU0sUUFBUTtJQUdWLGdCQUF1QixDQUFDO0lBRXhCLElBQUksQ0FBQyxRQUFnQixFQUFFLE1BQWM7UUFDakMsT0FBTyxLQUFLLENBQUE7SUFDaEIsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFnQjtRQUNuQixPQUFPLEtBQUssQ0FBQTtJQUNoQixDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQWdCO1FBQ25CLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7O0FBWk0saUJBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBZXJDLE1BQWEsS0FBSztJQUdkO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBZ0IsQ0FBQztJQUMxQyxDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7UUFDckMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDdkIsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUM3QixDQUFDO0lBRUQsV0FBVyxDQUFDLFFBQWdCO1FBQ3hCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLElBQUksSUFBSTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ3RCLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQTtJQUM1QixDQUFDO0NBRUo7QUEzQkQsc0JBMkJDIn0=