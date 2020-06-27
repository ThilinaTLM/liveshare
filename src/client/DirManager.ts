import * as fs from "fs";
import * as path from "path";
import { File } from "../File";
import { FileObserver } from "./FileObserver";

export class DirManager {
    private _path?: string;
    private _fileWatcher?: fs.FSWatcher;
    private _fileExtensions: string[];
    private _observer: FileObserver;
    private _lastModifiedTime: Map<string, number>;

    constructor(observer: FileObserver, fileExtensions: string[] = []) {
        this._observer = observer;
        this._fileExtensions = fileExtensions;
        this._lastModifiedTime = new Map<string, number>();
    }

    public set path(path: string) {
        try {
            let stats = fs.lstatSync(path);
            if (stats.isDirectory()) {
                this._path = path;
            } else {
                this._path = undefined;
            }
        } catch (e) {
            this._path = undefined;
        }

    }


    public get path(): string {
        if (this._path)
            return this._path;
        else
            return "";
    }

    //public startListener(): boolean;
    public startListener(path?: string): boolean;
    public startListener(path: string | undefined): boolean {
        if (path) {
            this.path = path;
        }

        if (!this._path) {
            return false;
        }

        if (this._fileWatcher) {
            this.stopListening();
        }
        this._fileWatcher = fs.watch(this._path, this.fileListener);
        return true;
    }

    public stopListening() {
        this._fileWatcher?.close();
        this._fileWatcher = undefined;
    }

    public addFileType(ext: string) {
        this._fileExtensions.push(ext);
    }

    public removeFileType(ext: string) {
        this._fileExtensions = this._fileExtensions.filter((s) => s != ext);
    }

    public clearFileTypes() {
        this._fileExtensions = [];
    }

    public writeFile(file: File): boolean {
        if (!this._path) {
            return false;
        }
        let filePath = path.join(this._path, file.name);
        fs.writeFileSync(filePath, file.content);
        return true;
    }

    private checkExtensionAllowed(ext: string): boolean {
        for (let i in this._fileExtensions) {
            if (ext == this._fileExtensions[i]) {
                return true;
            }
        }
        return false;
    }

    private checkModifiedTime(filename: string, filepath: string) {
        let modifiedTime = fs.statSync(filepath).mtimeMs;
        let lastModifiedTime = this._lastModifiedTime.get(filename);
        this._lastModifiedTime.set(filename, modifiedTime);
        if (!lastModifiedTime) {
            return true;
        } else {
            return (lastModifiedTime + 2000 < modifiedTime);
        }

    }

    private fileListener = (event: string, filename: string) => {
        if (event == "change" && this._observer.sendFileState()) {
            // @ts-ignore
            let filepath = path.join(this._path, filename);
            let ext = filename.split(".").pop();

            if (ext && this.checkExtensionAllowed(ext) && this.checkModifiedTime(filename, filepath)) {
                let data = fs.readFileSync(filepath);
                this._observer.notifyFileChange(new File(filename, data));
            }
        }
    };
}