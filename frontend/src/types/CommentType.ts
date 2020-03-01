export default class CommentType {

    public ID!: number;
    public postid: number;
    public parentid: number;
    public likes: number;
    public username: string;
    public content: string;
    public created_at: string;

    public children: CommentType[] = [];

    constructor(postid: number, parentid: number, likes: number, username: string, content: string, created_at: string) {
        this.postid = postid;
        this.parentid = parentid;
        this.likes = likes;
        this.username = username;
        this.content = content;
        this.created_at = created_at;
    }


}
