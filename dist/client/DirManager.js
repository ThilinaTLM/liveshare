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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const File_1 = require("../File");
class DirManager {
    constructor(observer, fileExtensions = []) {
        this.fileListener = (event, filename) => {
            if (event == "change" && this._observer.sendFileState()) {
                // @ts-ignore
                let filepath = path.join(this._path, filename);
                let ext = filename.split(".").pop();
                if (ext && this.checkExtensionAllowed(ext) && this.checkModifiedTime(filename, filepath)) {
                    let data = fs.readFileSync(filepath);
                    this._observer.notifyFileChange(new File_1.File(filename, data));
                }
            }
        };
        this._observer = observer;
        this._fileExtensions = fileExtensions;
        this._lastModifiedTime = new Map();
    }
    set path(path) {
        try {
            let stats = fs.lstatSync(path);
            if (stats.isDirectory()) {
                this._path = path;
            }
            else {
                this._path = undefined;
            }
        }
        catch (e) {
            this._path = undefined;
        }
    }
    get path() {
        if (this._path)
            return this._path;
        else
            return "";
    }
    startListener(path) {
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
    stopListening() {
        var _a;
        (_a = this._fileWatcher) === null || _a === void 0 ? void 0 : _a.close();
        this._fileWatcher = undefined;
    }
    addFileType(ext) {
        this._fileExtensions.push(ext);
    }
    removeFileType(ext) {
        this._fileExtensions = this._fileExtensions.filter((s) => s != ext);
    }
    clearFileTypes() {
        this._fileExtensions = [];
    }
    writeFile(file) {
        if (!this._path) {
            return false;
        }
        let filePath = path.join(this._path, file.name);
        fs.writeFileSync(filePath, file.content);
        return true;
    }
    checkExtensionAllowed(ext) {
        for (let i in this._fileExtensions) {
            if (ext == this._fileExtensions[i]) {
                return true;
            }
        }
        return false;
    }
    checkModifiedTime(filename, filepath) {
        let modifiedTime = fs.statSync(filepath).mtimeMs;
        let lastModifiedTime = this._lastModifiedTime.get(filename);
        this._lastModifiedTime.set(filename, modifiedTime);
        if (!lastModifiedTime) {
            return true;
        }
        else {
            return (lastModifiedTime + 2000 < modifiedTime);
        }
    }
}
exports.DirManager = DirManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlyTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvRGlyTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQXlCO0FBQ3pCLDJDQUE2QjtBQUM3QixrQ0FBK0I7QUFHL0IsTUFBYSxVQUFVO0lBT25CLFlBQVksUUFBc0IsRUFBRSxpQkFBMkIsRUFBRTtRQTZGekQsaUJBQVksR0FBRyxDQUFDLEtBQWEsRUFBRSxRQUFnQixFQUFFLEVBQUU7WUFDdkQsSUFBSSxLQUFLLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQ3JELGFBQWE7Z0JBQ2IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUVwQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRTtvQkFDdEYsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLFdBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDN0Q7YUFDSjtRQUNMLENBQUMsQ0FBQztRQXZHRSxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztRQUN0QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7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