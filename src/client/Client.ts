import io from "socket.io-client";
import prompt from "prompt-sync";
import { Msg } from "../Msg";
import { createInterface } from "readline";
import { DirManager } from "./DirManager";
import { FileObserver } from "./FileObserver";
import { File } from "../File";

const syncScanner = prompt();
const asyncScanner = createInterface(process.stdin, process.stdout);

class Client implements FileObserver {
    private readonly _serverUrl: string;
    private _username: string;
    private _sock: SocketIOClient.Socket;
    private _acceptFiles: boolean;
    private _sendFiles: boolean;
    private _dirManager: DirManager;

    public constructor() {
        this._serverUrl = "ws://" + this.inputAskUrl("localhost:8080");
        this._username = this.inputAskUsername("client");
        this._sock = io(this._serverUrl, {
            autoConnect: false,
            query: { username: this._username }
        });

        this._acceptFiles = false;
        this._sendFiles = false;
        this._dirManager = new DirManager(this);
    }

    public startClient() {
        // configure socket event handlers
        this._sock.on("message", this.onMessage);
        this._sock.on("disconnect", this.onDisconnect);
        this._sock.on("connect", this.onConnect);
        this._sock.open();
    }

    // socket handling
    private onDisconnect = () => {
        this.interactiveShellInterrupt()
        console.log("[ERROR]: Server is Disconnected!");
        this._username = this.inputAskUsername(this._username);
        this._sock.io.opts.query = { username: this._username };
        this._sock.open();
    };

    private onMessage = (msg: Msg) => {
        switch (msg.code) {
            case Msg.sText:
                this.interactiveShellInterrupt()
                console.log("[SERVER]" + msg.content);
                break;
            case Msg.sFILE:
                if (this._acceptFiles) {
                    this._dirManager.writeFile(msg.content);
                    this.interactiveShellInterrupt();
                    console.log(`[FILE]: ${(msg.content as File).name} is updated!`)
                }
                break;
            default:
                this.interactiveShellInterrupt()
                console.log(msg);
        }
    };

    private onConnect = () => {
        setTimeout(this.interactiveShell, 100);
    };

    // User Interacting Methods
    private inputAskUrl(defaultUrl: string) {
        let serverUrl = syncScanner(`[Input]: Host Url (${defaultUrl}): `);
        return (serverUrl == "") ? defaultUrl : serverUrl;
    }

    private inputAskUsername(defaultName: string) {
        let username = syncScanner(`[Input]: Username (${defaultName}): `);
        return (username == "") ? defaultName : username;
    }

    // private inputAskDirectory(currentDir: string) {
    //     this.interactiveShellInterrupt();
    //     let dir = syncScanner(`[Input]: Folder (${currentDir}): `);
    //     return (dir == "") ? currentDir : dir;
    // }

    private interactiveShell = () => {
        asyncScanner.question("[INPUT]: ", (answer: string) => {
            if (answer[0] == "-") {
                let parsedAnswer = answer.split(" ");
                switch (parsedAnswer[0].toLocaleLowerCase()) {
                    case "-l":
                    case "-list":
                        this._sock.send(new Msg(Msg.rLIST, null));
                        break;
                    case "-c":
                    case "-connect":
                        this._sock.send(new Msg(Msg.rCONN, parsedAnswer[1]))
                        break;
                    case "-d":
                    case "-dir":
                        this._dirManager.path = parsedAnswer[1];
                        if (this._dirManager.path != "") {
                            console.log(`[WATCHER]: Start listening at ${this._dirManager.path}`)
                        } else {
                            console.log(`[WATCHER][ERROR]: Something wrong provided path '${this._dirManager.path}'`)
                        }
                        break;
                    case "-t":
                    case "-toggle":
                        if (parsedAnswer[1] == "accept"){
                            this._acceptFiles = !this._acceptFiles;
                            console.log(`[NOTE]: Incoming files will${this._acceptFiles? '': ' not'} be accepted!`)
                        } else if (parsedAnswer[1] == "send") {
                            this._sendFiles = !this._sendFiles;
                            if (this._sendFiles) {
                                this._dirManager.startListener();
                            } else {
                                this._dirManager.stopListening();
                            }
                            console.log(`[NOTE]: Sending files changes is ${this._sendFiles? 'enable': 'disable'}.`)
                        }
                        break;
                    case "-add":
                        this._dirManager.addFileType(parsedAnswer[1]);
                        console.log(`[WATCH]: new file type added. '${parsedAnswer[1]}'`)
                        break;
                    case "-remove":
                        this._dirManager.removeFileType(parsedAnswer[1]);
                        console.log(`[WATCH]: '${parsedAnswer[1]}' file type removed`)
                        break;
                    case "-clear":
                        this._dirManager.clearFileTypes();
                        console.log(`[WATCH]: clear the file type list.`)
                        break;
                    default:
                        console.log("[ERROR]: Invalid Command!");
                }
            } else {
                this._sock.send(Msg.Message(answer));
            }
            setTimeout(this.interactiveShell, 500);
        });

    };

    private interactiveShellInterrupt() {
        asyncScanner.emit('line');
        console.log();
    }

    public notifyFileChange(file: File): void {
        if (this._sendFiles) {
            this._sock.send(Msg.File(file));
            this.interactiveShellInterrupt();
            console.log(`[FILE]: ${file.name} is sent!`)
        }

    }

    public sendFileState(): boolean {
        return this._sendFiles;
    }
}

// Start Client
const client = new Client();
client.startClient();