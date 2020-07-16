import io, { Socket } from "socket.io";
import * as http from "http";
import express from "express";
import Path from 'path'

import { FileContent } from "../FileContent";
import { SocketHub } from "./SocketHub";
import { Command, FileSend, MsgToServer, NoteCode } from "../ComStruct";

const PORT = Number(process.env.PORT) || 8080;
const hub = new SocketHub();

// Servers
const expressServer = express();
const httpServer = http.createServer(expressServer);
const socketServer = io.listen(httpServer);

// Event : Binding
socketServer.on("connect", onConnect);

// Socket Client Handling : Handlers
function onConnect(socket: Socket) {
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
function onCommand({ from, command, args }: Command) {
    let res: string, client: Socket | undefined;
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
            console.log("[Un-support]", from);
            client = hub.selectSocket(from);
            if (client && client.connected)
                sendNote(client, "ERROR", "Un-support command");
            break;
    }
}

function onDisconnect(username: string, destination: string) {
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
function onMessage({ from, to, content }: MsgToServer) {
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

function onFile({ from, to, file }: FileSend) {
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
function sendMsg(socket: Socket, from: string, content: string) {
    try {
        socket.emit("msg", { from, content }); // MsgToClient
    } catch (e) {
        console.log("Un-handled 'message' event");
    }
}

function sendNote(socket: Socket, code: NoteCode, msg: string) {
    try {
        socket.emit("note", { code, msg }); // MsgNote
    } catch (e) {
        console.log("Un-handled 'note' event");
    }

}

function sendFile(socket: Socket, from: string, file: FileContent) {
    try {
        socket.emit("file", { from, file }); // FileReceive
    } catch (e) {
        console.log("Un-handled 'file' event");
    }
}

//--------------------------------------------------------------------------------------------------

// HTTP Client Handling
expressServer.use('/download', express.static('release'))

expressServer.get('/', (req, res) => {
    res.send(`Server is running..! <br> download client application (real-share-v0.2.6) <a href="/download/real-share-v0.2.6.zip">here</a>`);
});


// Start Server
httpServer.listen(PORT, () => console.log("Server is running..."));