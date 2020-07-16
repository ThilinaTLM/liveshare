import nsfw, {ActionType, NSFW} from 'nsfw'
import * as Path from 'path'
import * as fs from "fs";
import { FileContent } from "../FileContent";

let rootDir: string
let callback: (file: FileContent) => void;
let extList: string[];
let ignoreList: string[] = []

export const FileWriteContent = (file: FileContent) => {
    if (!rootDir) {
        return;
    }

    let fullPath = Path.join(rootDir, file.relativePath)
    ignoreList.push(fullPath)
    fs.writeFile(fullPath, file.content, () => {
        console.log(`[WATCHER][FILE]: ${file.relativePath} is synced!`)
        setTimeout(() => {
            ignoreList = ignoreList.filter((value) => value != fullPath);
        }, 5000);

    })
}

export const StartFileWatcher = async (dirPath: string, types: string[], cb: (file: FileContent) => void) => {
    if (!fs.existsSync(dirPath)) {
        console.log("[WATCHER]: Provided path to the directory doesn't exists.")
        return false;
    }
    try {
        const watcher = await nsfw(dirPath, onEvent);
        await watcher.start();
        callback = cb;
        extList = types;
        rootDir = dirPath;
        return true
    } catch (e) {
        console.log("[WATCHER]: Error when loading watcher")
        return false;
    }
}

const onEvent = (events: any[]) => {
    let lastEvent = events[events.length - 1]
    let {action} = lastEvent;
    switch (action) {
        case nsfw.actions.MODIFIED:
            let path = Path.join(lastEvent.directory, lastEvent.file)
            if (ignoreList.includes(path)) return;
            if (matchExtension(lastEvent.file)) {
                onModified(path, lastEvent.file);
            }
            console.log("[WATCHER]: Modified", lastEvent.file);
            break;
        default:
            break;
    }
}

const onModified = (path: string, fileName: string) => {
    let relPath = relativePath(rootDir, path);
    fs.readFile(path, (err, data) => {
        if (err) {
            console.log("[WATCHER]: Error when reading file,", relPath)
            return;
        }
        callback(new FileContent(fileName, relPath, data));
    })
}

const matchExtension = (filename: string): boolean => {
    let splitName = filename.split('.')
    let ext = splitName[splitName.length - 1]
    return extList.includes(ext.toLowerCase());
}

function relativePath(root: string, path: string): string {
    return path.split(root, 2)[1];
}
