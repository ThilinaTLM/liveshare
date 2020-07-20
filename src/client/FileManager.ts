import chokidar from "chokidar";
import * as Path from "path";
import * as fs from "fs";
import { FileContent } from "../FileContent";

let ROOT_DIR: string;
let CALLBACK_CHANGE: (file: FileContent) => void;
let FILE_TYPES: string[];
let ENABLE_WATCHER: boolean;
let ACCEPT_FILES: boolean;

let IGNORE_LIST: string[] = [];

export const Initilize_FileManager = (
    root_directory: string,
    file_types: string[],
    callback: (file: FileContent) => void,
    accept_files: boolean
) => {
    // use back-slash instead of forward-slash
    root_directory = root_directory.split("\\").join('/');

    // check root dir exist or not
    if (!fs.existsSync(root_directory)) {
        console.log("[FM]: Provided path to the directory doesn't exists.");
        ENABLE_WATCHER = false;
    } else {
        ROOT_DIR = root_directory;
        ENABLE_WATCHER = true
    }

    CALLBACK_CHANGE = callback;
    FILE_TYPES = file_types;
    ACCEPT_FILES = accept_files;
}

export const StartFileWatcher = () => {
    if (!ENABLE_WATCHER) {
        // console.log("[WATCHER]: Provided path to the directory doesn't exists.");
        return;
    }

    try {
        const watcher = chokidar.watch(ROOT_DIR);
        watcher.on("change", onChange);
        console.log(`[FM][WATCH]: Watch file changes in ${ROOT_DIR}`);
    } catch (e) {
        console.log("[FM][WATCH]: Error when loading watcher");
    }
};

export const FileWriteContent = (file: FileContent) => {
    if (!ROOT_DIR) {
        console.log("[FM][WRITE][WARN]: Cannot save received file, error on root dir")
        return;
    }

    if (!ACCEPT_FILES) {
        console.log("[FM][WRITE][WARN]: File saving is disabled.")
        return;
    }

    let fullPath = Path.join(ROOT_DIR, file.relativePath);
    IGNORE_LIST.push(fullPath);

    resolveParentDir(fullPath);

    fs.writeFile(fullPath, file.content, () => {
        console.log(`[FM][WRITE][FILE]: ${file.relativePath} is saved!`);
        setTimeout(() => {
            IGNORE_LIST = IGNORE_LIST.filter((value) => value != fullPath);
        }, 5000);
    });
};

const resolveParentDir = (fullPath: string) => {
    let parts = fullPath.split("/")
    let parentPath = parts.slice(0, parts.length - 1).join("/")

    if (!fs.existsSync(parentPath)) {
        fs.mkdirSync(parentPath, {recursive: true});
        console.log("[FM][WRITE][DIR]: New directory created!", parentPath);
    }

}

const onChange = (absPath: string) => {
    absPath = absPath.split("\\").join('/');
    let relPath = getRelativePath(ROOT_DIR, absPath);
    let fileName = getFileName(absPath);

    if (IGNORE_LIST.includes(absPath)) return;
    if (matchExtension(fileName)) {
        setTimeout(generateFileContent, 100, absPath, relPath, fileName);
    }
    console.log("[FM][WATCH]: Modified", relPath);
};

const generateFileContent = (path: string, relPath: string, fileName: string) => {
    fs.readFile(path, (err, data) => {
        if (err) {
            console.log("[FM][FILE]: Error when reading file,", relPath);
            return;
        }
        if (data.length > 5) {
            CALLBACK_CHANGE(new FileContent(fileName, relPath, data));
        }
    });
};

const matchExtension = (filename: string): boolean => {

    let splitName = filename.split(".");
    let ext = splitName[splitName.length - 1];
    return FILE_TYPES.includes(ext.toLowerCase());
};

function getRelativePath(root: string, path: string): string {
    return path.split(root, 2)[1];
}

function getFileName(path: string): string {
    if (!path.includes("/")) {
        return path;
    }
    let splitParts = path.split("/");
    return splitParts[splitParts.length - 1];
}