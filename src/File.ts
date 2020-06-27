export class File {
    public name: string;
    public content: Buffer;

    constructor(name: string, content: Buffer) {
        this.name = name;
        this.content = content
    }

}
