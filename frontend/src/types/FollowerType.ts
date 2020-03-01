export default class RatingType {
    public following: boolean;
    public count: number;

    constructor(following: boolean, count: number) {
        this.following = following;
        this.count = count;
    }
}
