export class FileContent {
    public name: string;
    public relativePath: string;
    public content: Buffer;

    constructor(name: string, relativePath:string, content: Buffer) {
        this.name = name;
        this.relativePath = relativePath;
        this.content = content
    }

}
