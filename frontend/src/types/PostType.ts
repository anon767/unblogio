export default class PostType {


    // @ts-ignore
    public ID: number;
    public image: string;
    public body: string;
    public title: string;
    public username: string;
    public views: number;
    public CreatedAt: string;
    private _updatedAt: string | null = null;
    private _deletedAt: string | null = null;

    constructor(image: string, body: string, title: string, username: string, views: number, date: string) {
        this.image = image;
        this.body = body;
        this.title = title;
        this.views = views;
        this.username = username;
        this.CreatedAt = date;
    }

    public createURL(): string {
        return `/blog/${this.username}/${encodeURI(this.title)}`;
    }

    get deletedAt(): string | null {
        return this._deletedAt;
    }

    set deletedAt(value: string | null) {
        this._deletedAt = value;
    }

    get updatedAt(): string | null {
        return this._updatedAt;
    }

    set updatedAt(value: string | null) {
        this._updatedAt = value;
    }
}


