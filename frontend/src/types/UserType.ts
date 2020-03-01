export default class UserType {

    public username: string;
    public email: string;
    public password: string;
    public image: string | null;

    constructor(username: string, email: string, password: string, image: string | null) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.image = image;
    }


}
