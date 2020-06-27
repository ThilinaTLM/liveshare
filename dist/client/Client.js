"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const Msg_1 = require("../Msg");
const readline_1 = require("readline");
const DirManager_1 = require("./DirManager");
const syncScanner = prompt_sync_1.default();
const asyncScanner = readline_1.createInterface(process.stdin, process.stdout);
class Client {
    constructor() {
        // socket handling
        this.onDisconnect = () => {
            this.interactiveShellInterrupt();
            console.log("[ERROR]: Server is Disconnected!");
            this._username = this.inputAskUsername(this._username);
            this._sock.io.opts.query = { username: this._username };
            this._sock.open();
        };
        this.onMessage = (msg) => {
            switch (msg.code) {
                case Msg_1.Msg.sText:
                    this.interactiveShellInterrupt();
                    console.log("[SERVER]" + msg.content);
                    break;
                case Msg_1.Msg.sFILE:
                    if (this._acceptFiles) {
                        this._dirManager.writeFile(msg.content);
                        this.interactiveShellInterrupt();
                        console.log(`[FILE]: ${msg.content.name} is updated!`);
                    }
                    break;
                default:
                    this.interactiveShellInterrupt();
                    console.log(msg);
            }
        };
        this.onConnect = () => {
            setTimeout(this.interactiveShell, 100);
        };
        // private inputAskDirectory(currentDir: string) {
        //     this.interactiveShellInterrupt();
        //     let dir = syncScanner(`[Input]: Folder (${currentDir}): `);
        //     return (dir == "") ? currentDir : dir;
        // }
        this.interactiveShell = () => {
            asyncScanner.question("[INPUT]: ", (answer) => {
                if (answer[0] == "-") {
                    let parsedAnswer = answer.split(" ");
                    switch (parsedAnswer[0].toLocaleLowerCase()) {
                        case "-l":
                        case "-list":
                            this._sock.send(new Msg_1.Msg(Msg_1.Msg.rLIST, null));
                            break;
                        case "-c":
                        case "-connect":
                            this._sock.send(new Msg_1.Msg(Msg_1.Msg.rCONN, parsedAnswer[1]));
                            break;
                        case "-d":
                        case "-dir":
                            this._dirManager.path = parsedAnswer[1];
                            if (this._dirManager.path != "") {
                                console.log(`[WATCHER]: Start listening at ${this._dirManager.path}`);
                            }
                            else {
                                console.log(`[WATCHER][ERROR]: Something wrong provided path '${this._dirManager.path}'`);
                            }
                            break;
                        case "-t":
                        case "-toggle":
                            if (parsedAnswer[1] == "accept") {
                                this._acceptFiles = !this._acceptFiles;
                                console.log(`[NOTE]: Incoming files will${this._acceptFiles ? '' : ' not'} be accepted!`);
                            }
                            else if (parsedAnswer[1] == "send") {
                                this._sendFiles = !this._sendFiles;
                                if (this._sendFiles) {
                                    this._dirManager.startListener();
                                }
                                else {
                                    this._dirManager.stopListening();
                                }
                                console.log(`[NOTE]: Sending files changes is ${this._sendFiles ? 'enable' : 'disable'}.`);
                            }
                            break;
                        case "-add":
                            this._dirManager.addFileType(parsedAnswer[1]);
                            console.log(`[WATCH]: new file type added. '${parsedAnswer[1]}'`);
                            break;
                        case "-remove":
                            this._dirManager.removeFileType(parsedAnswer[1]);
                            console.log(`[WATCH]: '${parsedAnswer[1]}' file type removed`);
                            break;
                        case "-clear":
                            this._dirManager.clearFileTypes();
                            console.log(`[WATCH]: clear the file type list.`);
                            break;
                        default:
                            console.log("[ERROR]: Invalid Command!");
                    }
                }
                else {
                    this._sock.send(Msg_1.Msg.Message(answer));
                }
                setTimeout(this.interactiveShell, 500);
            });
        };
        this._serverUrl = "ws://" + this.inputAskUrl("localhost:8080");
        this._username = this.inputAskUsername("client");
        this._sock = socket_io_client_1.default(this._serverUrl, {
            autoConnect: false,
            query: { username: this._username }
        });
        this._acceptFiles = false;
        this._sendFiles = false;
        this._dirManager = new DirManager_1.DirManager(this);
    }
    startClient() {
        // configure socket event handlers
        this._sock.on("message", this.onMessage);
        this._sock.on("disconnect", this.onDisconnect);
        this._sock.on("connect", this.onConnect);
        this._sock.open();
    }
    // User Interacting Methods
    inputAskUrl(defaultUrl) {
        let serverUrl = syncScanner(`[Input]: Host Url (${defaultUrl}): `);
        return (serverUrl == "") ? defaultUrl : serverUrl;
    }
    inputAskUsername(defaultName) {
        let username = syncScanner(`[Input]: Username (${defaultName}): `);
        return (username == "") ? defaultName : username;
    }
    interactiveShellInterrupt() {
        asyncScanner.emit('line');
        console.log();
    }
    notifyFileChange(file) {
        if (this._sendFiles) {
            this._sock.send(Msg_1.Msg.File(file));
            this.interactiveShellInterrupt();
            console.log(`[FILE]: ${file.name} is sent!`);
        }
    }
    sendFileState() {
        return this._sendFiles;
    }
}
// Start Client
const client = new Client();
client.startClient();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsaWVudC9DbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3RUFBa0M7QUFDbEMsOERBQWlDO0FBQ2pDLGdDQUE2QjtBQUM3Qix1Q0FBMkM7QUFDM0MsNkNBQTBDO0FBSTFDLE1BQU0sV0FBVyxHQUFHLHFCQUFNLEVBQUUsQ0FBQztBQUM3QixNQUFNLFlBQVksR0FBRywwQkFBZSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRXBFLE1BQU0sTUFBTTtJQVFSO1FBcUJBLGtCQUFrQjtRQUNWLGlCQUFZLEdBQUcsR0FBRyxFQUFFO1lBQ3hCLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFBO1lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDeEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0QixDQUFDLENBQUM7UUFFTSxjQUFTLEdBQUcsQ0FBQyxHQUFRLEVBQUUsRUFBRTtZQUM3QixRQUFRLEdBQUcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2QsS0FBSyxTQUFHLENBQUMsS0FBSztvQkFDVixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQTtvQkFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN0QyxNQUFNO2dCQUNWLEtBQUssU0FBRyxDQUFDLEtBQUs7b0JBQ1YsSUFBSSxJQUFJLENB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