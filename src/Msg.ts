import { File } from "./File";

export class Msg {
    public static sText = 0;
    public static sFILE = 1;
    public static rPING = 2;
    public static rCONN = 3;
    public static rLIST = 4;

    public static Message(message: string) {
        return new Msg(Msg.sText, message);
    }

    public static File(file: File) {
        return new Msg(Msg.sFILE, file);
    }

    public static Ping() {
        return new Msg(Msg.rPING, null);
    }

    public readonly code: number;
    public readonly content: any;

    constructor(code: number, content: any) {
        this.code = code;
        this.content = content;
    }
}


