"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileWriteContent = exports.StartFileWatcher = exports.Initilize_FileManager = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
const Path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const FileContent_1 = require("../FileContent");
let ROOT_DIR;
let CALLBACK_CHANGE;
let FILE_TYPES;
let ENABLE_WATCHER;
let ACCEPT_FILES;
let IGNORE_LIST = [];
exports.Initilize_FileManager = (root_directory, file_types, callback, accept_files) => {
    // use back-slash instead of forward-slash
    root_directory = root_directory.split("\\").join('/');
    // check root dir exist or not
    if (!fs.existsSync(root_directory)) {
        console.log("[FM]: Provided path to the directory doesn't exists.");
        ENABLE_WATCHER = false;
    }
    else {
        ROOT_DIR = root_directory;
        ENABLE_WATCHER = true;
    }
    CALLBACK_CHANGE = callback;
    FILE_TYPES = file_types;
    ACCEPT_FILES = accept_files;
};
exports.StartFileWatcher = () => {
    if (!ENABLE_WATCHER) {
        // console.log("[WATCHER]: Provided path to the directory doesn't exists.");
        return;
    }
    try {
        const watcher = chokidar_1.default.watch(ROOT_DIR);
        watcher.on("change", onChange);
        console.log(`[FM][WATCH]: Watch file changes in ${ROOT_DIR}`);
    }
    catch (e) {
        console.log("[FM][WATCH]: Error when loading watcher");
    }
};
exports.FileWriteContent = (file) => {
    if (!ROOT_DIR) {
        console.log("[FM][WRITE][WARN]: Cannot save received file, error on root dir");
        return;
    }
    if (!ACCEPT_FILES) {
        console.log("[FM][WRITE][WARN]: File saving is disabled.");
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
const resolveParentDir = (fullPath) => {
    let parts = fullPath.split("/");
    let parentPath = parts.slice(0, parts.length - 1).join("/");
    if (!fs.existsSync(parentPath)) {
        fs.mkdirSync(parentPath, { recursive: true });
        console.log("[FM][WRITE][DIR]: New directory created!", parentPath);
    }
};
const onChange = (absPath) => {
    absPath = absPath.split("\\").join('/');
    let relPath = getRelativePath(ROOT_DIR, absPath);
    let fileName = getFileName(absPath);
    if (IGNORE_LIST.includes(absPath))
        return;
    if (matchExtension(fileName)) {
        setTimeout(generateFileContent, 100, absPath, relPath, fileName);
    }
    console.log("[FM][WATCH]: Modified", relPath);
};
const generateFileContent = (path, relPath, fileName) => {
    fs.readFile(path, (err, data) => {
        if (err) {
            console.log("[FM][FILE]: Error when reading file,", relPath);
            return;
        }
        if (data.length > 5) {
            CALLBACK_CHANGE(new FileContent_1.FileContent(fileName, relPath, data));
        }
    });
};
const matchExtension = (filename) => {
    let splitName = filename.split(".");
    let ext = splitName[splitName.length - 1];
    return FILE_TYPES.includes(ext.toLowerCase());
};
function getRelativePath(root, path) {
    return path.split(root, 2)[1];
}
function getFileName(path) {
    if (!path.includes("/")) {
        return path;
    }
    let splitParts = path.split("/");
    return splitParts[splitParts.length - 1];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZU1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpZW50L0ZpbGVNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx3REFBZ0M7QUFDaEMsMkNBQTZCO0FBQzdCLHVDQUF5QjtBQUN6QixnREFBNkM7QUFFN0MsSUFBSSxRQUFnQixDQUFDO0FBQ3JCLElBQUksZUFBNEMsQ0FBQztBQUNqRCxJQUFJLFVBQW9CLENBQUM7QUFDekIsSUFBSSxjQUF1QixDQUFDO0FBQzVCLElBQUksWUFBcUIsQ0FBQztBQUUxQixJQUFJLFdBQVcsR0FBYSxFQUFFLENBQUM7QUFFbEIsUUFBQSxxQkFBcUIsR0FBRyxDQUNqQyxjQUFzQixFQUN0QixVQUFvQixFQUNwQixRQUFxQyxFQUNyQyxZQUFxQixFQUN2QixFQUFFO0lBQ0EsMENBQTBDO0lBQzFDLGNBQWMsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUV0RCw4QkFBOEI7SUFDOUIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEVBQUU7UUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO1FBQ3BFLGNBQWMsR0FBRyxLQUFLLENBQUM7S0FDMUI7U0FBTTtRQUNILFFBQVEsR0FBRyxjQUFjLENBQUM7UUFDMUIsY0FBYyxHQUFHLElBQUksQ0FBQTtLQUN4QjtJQUVELGVBQWUsR0FBRyxRQUFRLENBQUM7SUFDM0IsVUFBVSxHQUFHLFVBQVUsQ0FBQztJQUN4QixZQUFZLEdBQUcsWUFBWSxDQUFDO0FBQ2hDLENBQUMsQ0FBQTtBQUVZLFFBQUEsZ0JBQWdCLEdBQUcsR0FBRyxFQUFFO0lBQ2pDLElBQUksQ0FBQyxjQUFjLEVBQUU7UUFDakIsNEVBQTRFO1FBQzVFLE9BQU87S0FDVjtJQUVELElBQUk7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