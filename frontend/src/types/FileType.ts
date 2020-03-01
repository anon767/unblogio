export default class FileType {

    public username: string;
    public path: string;
    public name: string;
    public mimetype: string;


    constructor(username: string, path: string, name: string, mimetype: string) {
        this.username = username;
        this.path = path;
        this.name = name;
        this.mimetype = mimetype;
    }
}
