import { FileContent } from "./FileContent";

export type NoteCode = "WARN" | "DONE" | "ERROR" | "TICK"

export interface Command {
    from: string,
    command: string,
    args: string[]
}

export interface MsgNote {
    code: NoteCode,
    msg: string
}

export interface MsgToServer {
    from: string,
    to: string,
    content: string
}
export interface MsgToClient {
    from: string,
    content: string
}

export interface FileSend {
    from: string,
    to: string,
    file: FileContent
}
export interface FileReceive {
    from: string,
    file: FileContent
}