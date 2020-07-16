export class FileContent {
    public name: string;
    public path: string;
    public content: Buffer;

    constructor(name: string, path:string, content: Buffer) {
        this.name = name;
        this.path = path;
        this.content = content
    }

}
