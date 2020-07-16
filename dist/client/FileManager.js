"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    dirPath = dirPath.split("\\").join('/');
    if (!fs.existsSync(dirPath)) {
        console.log("[WATCHER]: Provided path to the directory doesn't exists.");
        return false;
    }
    try {
        const watcher = chokidar_1.default.watch(dirPath);
        watcher.on("change", onChange);
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
    absPath = absPath.split("\\").join('/');
    let relPath = getRelativePath(rootDir, absPath);
    let fileName = getFileName(absPath);
    if (ignoreList.includes(absPath))
        return;
    if (matchExtension(fileName)) {
        setTimeout(generateFileContent, 100, absPath, relPath, fileName);
    }
    console.log("[WATCHER]: Modified", relPath);
};
const generateFileContent = (path, relPath, fileName) => {
    fs.readFile(path, (err, data) => {
        if (err) {
            console.log("[WATCHER]: Error when reading file,", relPath);
            return;
        }
        if (data.length > 5) {
            callback(new FileContent_1.FileContent(fileName, relPath, data));
        }
    });
};
const matchExtension = (filename) => {
    let splitName = filename.split(".");
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
    let splitParts = path.split("/");
    return splitParts[splitParts.length - 1];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZU1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpZW50L0ZpbGVNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdEQUFnQztBQUNoQywyQ0FBNkI7QUFDN0IsdUNBQXlCO0FBQ3pCLGdEQUE2QztBQUU3QyxJQUFJLE9BQWUsQ0FBQztBQUNwQixJQUFJLFFBQXFDLENBQUM7QUFDMUMsSUFBSSxPQUFpQixDQUFDO0FBQ3RCLElBQUksVUFBVSxHQUFhLEVBQUUsQ0FBQztBQUVqQixRQUFBLGdCQUFnQixHQUFHLENBQUMsSUFBaUIsRUFBRSxFQUFFO0lBQ2xELElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDVixPQUFPO0tBQ1Y7SUFFRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDckQsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxQixFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixJQUFJLENBQUMsWUFBWSxhQUFhLENBQUMsQ0FBQztRQUNoRSxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ1osVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQztRQUNqRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFYixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQUVXLFFBQUEsZ0JBQWdCLEdBQUcsQ0FBTyxPQUFlLEVBQUUsS0FBZSxFQUFFLEVBQStCLEVBQUUsRUFBRTtJQUN4RyxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJ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