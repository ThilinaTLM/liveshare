import { File } from "../File";

export interface FileObserver {
    notifyFileChange(file: File): void;
    sendFileState(): boolean;
}