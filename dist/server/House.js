"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG91c2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmVyL0hvdXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBYUEsTUFBTSxRQUFRO0lBS1YsWUFBWSxJQUFZLEVBQUUsUUFBZ0I7UUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztJQUM5QyxDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQWdCO1FBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxJQUFJLENBQUMsUUFBZ0IsRUFBRSxNQUFjO1FBQ2pDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ2xELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBZ0I7UUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBRUQsTUFBTSxRQUFRO0lBR1YsZ0JBQXVCLENBQUM7SUFFeEIsSUFBSSxDQUFDLFFBQWdCLEVBQUUsTUFBYztRQUNqQyxPQUFPLEtBQUssQ0FBQTtJQUNoQixDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQWdCO1FBQ25CLE9BQU8sS0FBSyxDQUFBO0lBQ2hCLENBQUM7SUFDRCxNQUFNLENBQUMsUUFBZ0I7UUFDbkIsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7QUFaTSxpQkFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFlckMsTUFBYSxLQUFLO0lBR2Q7UUFDSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxFQUFnQixDQUFDO0lBQzFDLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtRQUNyQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDaEMsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUVELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN2QixPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsT0FBTyxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRCxXQUFXLENBQUMsUUFBZ0I7UUFDeEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsSUFBSSxJQUFJO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDdEIsT0FBTyxRQUFRLENBQUMsUUFBUSxDQUFBO0lBQzVCLENBQUM7Q0FFSjtBQTNCRCxzQkEyQkMifQ==