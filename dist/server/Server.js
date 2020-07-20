"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const http = __importStar(require("http"));
const express_1 = __importDefault(require("express"));
const SocketHub_1 = require("./SocketHub");
const PORT = Number(process.env.PORT) || 8080;
const hub = new SocketHub_1.SocketHub();
// Servers
const expressServer = express_1.default();
const httpServer = http.createServer(expressServer);
const socketServer = socket_io_1.default.listen(httpServer);
// Event : Binding
socketServer.on("connect", onConnect);
// Socket Client Handling : Handlers
function onConnect(socket) {
    let username = socket.request._query.username;
    let password = socket.request._query.password;
    let destination = socket.request._query.destination;
    // check for username and password
    if (!username || !password) {
        sendNote(socket, "ERROR", "Please specify username and password.");
        socket.disconnect();
        console.log("[REJECTED][REQUEST]:", username, socket.id);
        return;
    }
    // check correctness of password
    if (!hub.verify(username, password)) {
        sendNote(socket, "ERROR", "Incorrect password!");
        socket.disconnect();
        console.log("[REJECTED][PASSWORD]:", username, socket.id);
        return;
    }
    hub.setSocket(username, password, socket);
    // client specific binding.
    socket.on("disconnect", () => onDisconnect(username, destination));
    socket.on("message", onMessage);
    socket.on("command", onCommand);
    socket.on("file", onFile);
    // Notify about connection
    sendNote(socket, "DONE", `You are successfully connected as '${username}'.`);
    if (destination) {
        let to = hub.selectSocket(destination);
        if (to && to.connected) {
            sendNote(to, "DONE", `${username}(destination) is available now!`);
        }
    }
    console.log("[ACCEPT]:", username, socket.id);
}
//--------------------------------------------------------------------------------------------------
// Controlling Methods
function onCommand({ from, command, args }) {
    let res, client;
    switch (command) {
        case "LST":
            res = hub.availableClients().join("\n");
            client = hub.selectSocket(from);
            if (client && client.connected)
                sendNote(client, "DONE", res);
            break;
        case "CNT":
            res = hub.availableClients().length.toString();
            client = hub.selectSocket(from);
            if (client && client.connected)
                sendNote(client, "DONE", res);
            break;
        default:
            console.log("[CMD][UNKNOWN]", from);
            client = hub.selectSocket(from);
            if (client && client.connected)
                sendNote(client, "WARN", "Un-support command");
            break;
    }
}
function onDisconnect(username, destination) {
    console.log("[DISCONNECTED]", username);
    if (destination) {
        let to = hub.selectSocket(destination);
        if (to && to.connected) {
            sendNote(to, "DONE", `${username} is disconnected!`);
        }
    }
}
//--------------------------------------------------------------------------------------------------
// Forwarding Methods
function onMessage({ from, to, content }) {
    console.log("MSG", from, to, content);
    let dest = hub.selectSocket(to);
    if (dest && dest.connected) {
        sendMsg(dest, from, content);
        let sender = hub.selectSocket(from);
        if (sender)
            sendNote(sender, "TICK", "✓");
        return;
    }
    let sender = hub.selectSocket(from);
    if (sender && sender.connected) {
        sendNote(sender, "WARN", `${to}(destination) not available.`);
    }
}
function onFile({ from, to, file }) {
    console.log("FILE", from, to, file.name);
    let dest = hub.selectSocket(to);
    if (dest && dest.connected) {
        sendFile(dest, from, file);
        return;
    }
    let sender = hub.selectSocket(from);
    if (sender && sender.connected) {
        sendNote(sender, "WARN", `Can't sync file, ${to} not available.`);
    }
}
//--------------------------------------------------------------------------------------------------
// Client Communication Methods
function sendMsg(socket, from, content) {
    try {
        socket.emit("msg", { from, content }); // MsgToClient
    }
    catch (e) {
        console.log("Un-handled 'message' event");
    }
}
function sendNote(socket, code, msg) {
    try {
        socket.emit("note", { code, msg }); // MsgNote
    }
    catch (e) {
        console.log("Un-handled 'note' event");
    }
}
function sendFile(socket, from, file) {
    try {
        socket.emit("file", { from, file }); // FileReceive
    }
    catch (e) {
        console.log("Un-handled 'file' event");
    }
}
//--------------------------------------------------------------------------------------------------
// HTTP Client Handling
expressServer.use('/download', express_1.default.static('release'));
expressServer.set('view engine', 'ejs');
expressServer.get('/', (req, res) => {
    let clients = hub.availableClients();
    if (clients.length == 0)
        clients.push("No clients are online.");
    res.render('index', { clients });
});
// Start Server
httpServer.listen(PORT, () => console.log("Server is running..."));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZlci9TZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMERBQXVDO0FBQ3ZDLDJDQUE2QjtBQUM3QixzREFBOEI7QUFHOUIsMkNBQXdDO0FBR3hDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQztBQUM5QyxNQUFNLEdBQUcsR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztBQUU1QixVQUFVO0FBQ1YsTUFBTSxhQUFhLEdBQUcsaUJBQU8sRUFBRSxDQUFDO0FBQ2hDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDcEQsTUFBTSxZQUFZLEdBQUcsbUJBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFM0Msa0JBQWtCO0FBQ2xCLFlBQVksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBRXRDLG9DQUFvQztBQUNwQyxTQUFTLFNBQVMsQ0FBQyxNQUFjO0lBQzdCLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUM5QyxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDOUMsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0lBRXBELGtDQUFrQztJQUNsQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ3hCLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHVDQUF1QyxDQUFDLENBQUM7UUFDbkUsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6RCxPQUFPO0tBQ1Y7SUFFRCxnQ0FBZ0M7SUFDaEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUFFO1FBQ2pDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxRCxPQUFPO0tBQ1Y7SUFFRCxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFMUMsMkJBQTJCO0lBQzNCLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNuRSxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUUxQiwwQkFBMEI7SUFDMUIsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsc0NBQXNDLFFBQVEsSUFBSSxDQUFDLENBQUM7SUFDN0UsSUFBSSxXQUFXLEVBQUU7UUFDYixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDcEIsUUFBUSxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxRQUFRLGlDQUFpQyxDQUFDLENBQUM7U0FDdEU7S0FDSjtJQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQUVELG9HQUFvRztBQUVwRyxzQkFBc0I7QUFDdEIsU0FBUyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBVztJQUMvQyxJQUFJLEdBQVcsRUFBRSxNQUEwQixDQUFDO0lBQzVDLFFBQVEsT0FBTyxFQUFFO1FBQ2IsS0FBSyxLQUFLO1lBQ04sR0FBRyxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxNQUFNLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUztnQkFDMUIsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbEMsTUFBTTtRQUNWLEtBQUssS0FBSztZQUNOLEdBQUcsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDL0MsTUFBTSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVM7Z0JBQzFCLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2xDLE1BQU07UUFDVjtZQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVM7Z0JBQzFCLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLG9CQUFvQixDQUFDLENBQUM7WUFDbkQsTUFBTTtLQUNiO0FBQ0wsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLFFBQWdCLEVBQUUsV0FBbUI7SUFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN4QyxJQUFJLFdBQVcsRUFBRTtRQUNiLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdkMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRTtZQUNwQixRQUFRLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLFFBQVEsbUJBQW1CLENBQUMsQ0FBQztTQUN4RDtLQUNKO0FBQ0wsQ0FBQztBQUVELG9HQUFvRztBQUVwRyxxQkFBcUI7QUFDckIsU0FBUyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBZTtJQUNqRCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUN4QixPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM3QixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksTUFBTTtZQUNOLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLE9BQU87S0FDVjtJQUVELElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUM1QixRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsOEJBQThCLENBQUMsQ0FBQztLQUNqRTtBQUNMLENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFZO0lBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUN4QixRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzQixPQUFPO0tBQ1Y7SUFFRCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7UUFDNUIsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztLQUNyRTtBQUNMLENBQUM7QUFHRCxvR0FBb0c7QUFFcEcsK0JBQStCO0FBQy9CLFNBQVMsT0FBTyxDQUFDLE1BQWMsRUFBRSxJQUFZLEVBQUUsT0FBZTtJQUMxRCxJQUFJO1FBQ0EsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWM7S0FDeEQ7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztLQUM3QztBQUNMLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FBQyxNQUFjLEVBQUUsSUFBYyxFQUFFLEdBQVc7SUFDekQsSUFBSTtRQUNBLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVO0tBQ2pEO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7S0FDMUM7QUFFTCxDQUFDO0FBRUQsU0FBUyxRQUFRLENBQUMsTUFBYyxFQUFFLElBQVksRUFBRSxJQUFpQjtJQUM3RCxJQUFJO1FBQ0EsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWM7S0FDdEQ7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztLQUMxQztBQUNMLENBQUM7QUFFRCxvR0FBb0c7QUFFcEcsdUJBQXVCO0FBQ3ZCLGFBQWEsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLGlCQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7QUFDekQsYUFBYSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFFeEMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDaEMsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDckMsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUM7UUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUE7SUFDL0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBO0FBQ3BDLENBQUMsQ0FBQyxDQUFDO0FBR0gsZUFBZTtBQUNmLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDIn0=