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
    socket.on('file', onFile);
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
            res = hub.availableClients().join('\n');
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
            console.log("[Un-support]", from);
            client = hub.selectSocket(from);
            if (client && client.connected)
                sendNote(client, "ERROR", "Un-support command");
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
expressServer.use((req, res) => {
    res.send("Server is running..!");
});
// Start Server
httpServer.listen(PORT, () => console.log("Server is running..."));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZlci9TZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMERBQXVDO0FBQ3ZDLDJDQUE2QjtBQUM3QixzREFBOEI7QUFHOUIsMkNBQXdDO0FBR3hDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQztBQUM5QyxNQUFNLEdBQUcsR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztBQUU1QixVQUFVO0FBQ1YsTUFBTSxhQUFhLEdBQUcsaUJBQU8sRUFBRSxDQUFDO0FBQ2hDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDcEQsTUFBTSxZQUFZLEdBQUcsbUJBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFM0Msa0JBQWtCO0FBQ2xCLFlBQVksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBRXRDLG9DQUFvQztBQUNwQyxTQUFTLFNBQVMsQ0FBQyxNQUFjO0lBQzdCLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUM5QyxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDOUMsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0lBRXBELGtDQUFrQztJQUNsQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ3hCLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHVDQUF1QyxDQUFDLENBQUM7UUFDbkUsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BCLE9BQU8s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