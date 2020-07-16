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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartFileWatcher = exports.FileWriteContent = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
const Path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const FileContent_1 = require("../FileContent");
let rootDir;
let callback;
let extList;
let ignoreList = [];
exports.FileWriteContent = (file) => {
    if (!rootDir) {
        return;
    }
    let fullPath = Path.join(rootDir, file.relativePath);
    ignoreList.push(fullPath);
    fs.writeFile(fullPath, file.content, () => {
        console.log(`[WATCHER][FILE]: ${file.relativePath} is synced!`);
        setTimeout(() => {
            ignoreList = ignoreList.filter((value) => value != fullPath);
        }, 5000);
    });
};
exports.StartFileWatcher = (dirPath, types, cb) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs.existsSync(dirPath)) {
        console.log("[WATCHER]: Provided path to the directory doesn't exists.");
        return false;
    }
    try {
        const watcher = chokidar_1.default.watch(dirPath);
        watcher.on('change', onChange);
        callback = cb;
        extList = types;
        rootDir = dirPath;
        console.log(`[WATCHER]: Watch file changes in ${dirPath}`);
        return true;
    }
    catch (e) {
        console.log("[WATCHER]: Error when loading watcher");
        return false;
    }
});
const onChange = (absPath) => {
    absPath = absPath.replace("\\", "/");
    let relPath = getRelativePath(rootDir, absPath);
    let fileName = getFileName(absPath);
    if (ignoreList.includes(absPath))
        return;
    if (matchExtension(fileName)) {
        setTimeout(generateFileContent, 100, [absPath, relPath, fileName]);
    }
    console.log("[WATCHER]: Modified", relPath);
};
const generateFileContent = (path, relPath, fileName) => {
    fs.readFile(path, (err, data) => {
        if (err) {
            console.log("[WATCHER]: Error when reading file,", relPath);
            return;
        }
        callback(new FileContent_1.FileContent(fileName, relPath, data));
    });
};
const matchExtension = (filename) => {
    let splitName = filename.split('.');
    let ext = splitName[splitName.length - 1];
    return extList.includes(ext.toLowerCase());
};
function getRelativePath(root, path) {
    return path.split(root, 2)[1];
}
function getFileName(path) {
    if (!path.includes("/")) {
        return path;
    }
    let splitParts = path.split(path);
    return splitParts[splitParts.length - 1];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZU1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpZW50L0ZpbGVNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx3REFBZ0M7QUFDaEMsMkNBQTRCO0FBQzVCLHVDQUF5QjtBQUN6QixnREFBNkM7QUFFN0MsSUFBSSxPQUFlLENBQUE7QUFDbkIsSUFBSSxRQUFxQyxDQUFDO0FBQzFDLElBQUksT0FBaUIsQ0FBQztBQUN0QixJQUFJLFVBQVUsR0FBYSxFQUFFLENBQUE7QUFFaEIsUUFBQSxnQkFBZ0IsR0FBRyxDQUFDLElBQWlCLEVBQUUsRUFBRTtJQUNsRCxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1YsT0FBTztLQUNWO0lBRUQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO0lBQ3BELFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDekIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLFlBQVksYUFBYSxDQUFDLENBQUE7UUFDL0QsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNaLFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLENBQUM7UUFDakUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRWIsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDLENBQUE7QUFFWSxRQUFBLGdCQUFnQixHQUFHLENBQU8sT0FBZSxFQUFFLEtBQWUsRUFBRSxFQUErQixFQUFFLEVBQUU7SUFDeEcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxV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