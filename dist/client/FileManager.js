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
const nsfw_1 = __importDefault(require("nsfw"));
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
        const watcher = yield nsfw_1.default(dirPath, onEvent);
        yield watcher.start();
        callback = cb;
        extList = types;
        rootDir = dirPath;
        return true;
    }
    catch (e) {
        console.log("[WATCHER]: Error when loading watcher");
        return false;
    }
});
const onEvent = (events) => {
    let lastEvent = events[events.length - 1];
    let { action } = lastEvent;
    switch (action) {
        case 2 /* MODIFIED */:
            let path = Path.join(lastEvent.directory, lastEvent.file);
            if (ignoreList.includes(path))
                return;
            if (matchExtension(lastEvent.file)) {
                onModified(path, lastEvent.file);
            }
            console.log("[WATCHER]: Modified", lastEvent.file);
            break;
        default:
            break;
    }
};
const onModified = (path, fileName) => {
    let relPath = relativePath(rootDir, path);
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
function relativePath(root, path) {
    return path.split(root, 2)[1];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZU1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpZW50L0ZpbGVNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBMkM7QUFDM0MsMkNBQTRCO0FBQzVCLHVDQUF5QjtBQUN6QixnREFBNkM7QUFFN0MsSUFBSSxPQUFlLENBQUE7QUFDbkIsSUFBSSxRQUFxQyxDQUFDO0FBQzFDLElBQUksT0FBaUIsQ0FBQztBQUN0QixJQUFJLFVBQVUsR0FBYSxFQUFFLENBQUE7QUFFaEIsUUFBQSxnQkFBZ0IsR0FBRyxDQUFDLElBQWlCLEVBQUUsRUFBRTtJQUNsRCxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1YsT0FBTztLQUNWO0lBRUQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO0lBQ3BELFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDekIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLFlBQVksYUFBYSxDQUFDLENBQUE7UUFDL0QsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNaLFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLENBQUM7UUFDakUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRWIsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDLENBQUE7QUFFWSxRQUFBLGdCQUFnQixHQUFHLENBQU8sT0FBZSxFQUFFLEtBQWUsRUFBRSxFQUErQixFQUFFLEVBQUU7SUFDeEcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxV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