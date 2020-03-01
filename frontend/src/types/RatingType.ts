export default class RatingType {
    public rated: boolean;
    public rating: number;

    constructor(rated: boolean, rating: number) {
        this.rated = rated;
        this.rating = rating;
    }
}
