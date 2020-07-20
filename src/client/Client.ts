import io from "socket.io-client";
import readline from "readline";
import config from "../config.json";
import { FileReceive, MsgNote, MsgToClient } from "../ComStruct";
import { FileWriteContent, Initilize_FileManager, StartFileWatcher } from "./FileManager";
import { FileContent } from "../FileContent";

const input = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }
);


type Socket = SocketIOClient.Socket

const USERNAME = config.user.username || "client";
const PASSWORD = config.user.password || "12345";

const SERVER_URL = config.server || "ws://localhost:8080";
const DESTINATION = config.destination || "client2";

const DIRECTORY_PATH = config.watcher.dir || "";
const FILE_TYPES = config.watcher.types || [];
const ACCEPT_FILES = config.writer.accept || false;

// Server Rejection
let REJECTED = false;

// Socket Connection
const socket = io(SERVER_URL, {
    autoConnect: false,
    query: {
        username: USERNAME,
        password: PASSWORD
    },
    reconnection: true
});

// Binding Events
socket.on("connect", onConnect);
socket.on("disconnect", onDisconnect);
socket.on("note", onNote);
socket.on("msg", onMessage);
socket.on("file", onFile);

// File Manager
console.log("[LOCAL]: Initializing File Manager (FM)");
Initilize_FileManager(
    DIRECTORY_PATH,
    FILE_TYPES,
    (file: FileContent) => sendFile(socket, file),
    ACCEPT_FILES
);
StartFileWatcher();

// Initiate socket connection
console.log("[LOCAL]: Connecting...");
socket.connect();

// Event Handling Methods
function onConnect() {
    console.log("[LOCAL]: Authenticating...");
}

function onDisconnect() {
    console.log("[LOCAL]: Disconnected from the SERVER!");
    if (!REJECTED) {
        console.log("\n[LOCAL]: Reconnecting...");
    }
}

function onNote({ code, msg }: MsgNote) {
    switch (code) {
        case "TICK":
            console.log("|:.");
            break;

        case "ERROR":
            REJECTED = true;
            socket.io.opts.reconnection = false;
        case "DONE":
        case "WARN":
            console.log(`[SERVER][${code}]: ${msg}`);
            break;
    }
}

function onMessage({ from, content }: MsgToClient) {
    console.log(`[CHAT][${from}]: ${content}`);
}

function onFile({ from, file }: FileReceive) {
    console.log(`[FILE][RECEIVED]: from ${from}, name ${file.name}`);
    if (from == DESTINATION) {
        FileWriteContent(file);
    } else {
        console.log(`[FILE][WARN]: A file is received from unknown destination, ${from}`);
    }
}

// Communicating Methods
const sendMessage = (socket: Socket, content: string) => {
    socket.emit("message", { from: USERNAME, to: DESTINATION, content: content });
};

const sendFile = (socket: Socket, file: FileContent) => {
    socket.emit("file", { from: USERNAME, to: DESTINATION, file: file });
    console.log(`[LOCAL][FILE]: ${file.name} is uploaded.`);
};

// commandline input listener
const listener = () => {
    input.question("", (answer) => {
        if (answer.length > 0)
            sendMessage(socket, answer);
        setTimeout(listener, 0);
    });
};
listener();
