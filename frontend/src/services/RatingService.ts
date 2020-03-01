import Axios from 'axios';
import PostType from '@/types/PostType';
import RatingType from '@/types/RatingType';

interface RatingDTO {
    username: string;
    blogname: string;
    title: string;
}

export class RatingService {

    public static getRating(post: PostType, success: (rating: RatingType) => void, err: (error: string) => void) {
        Axios.get(`${this.RATE_ENDPOINT}/${post.username}/posts/${post.title}`)
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    success(new RatingType(data.rated, data.rating));
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    public static getRatingPersonal(post: PostType, token: string, success: (rating: RatingType) => void, err: (error: string) => void) {
        const auth = {
            headers: {Authorization: 'Bearer ' + token},
        };
        Axios.get(`${this.PROTECTED_RATE_ENDPOINT}/${post.username}/posts/${post.title}`, auth)
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    success(new RatingType(data.rated, data.rating));
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    public static rate(post: PostType, username: string, token: string, success: (rating: RatingType) => void, err: (error: string) => void) {
        const rating: RatingDTO = {username: username, blogname: post.username, title: post.title};
        const auth = {
            headers: {Authorization: 'Bearer ' + token},
        };
        Axios.post(this.PROTECTED_RATE_ENDPOINT, JSON.stringify(rating), auth)
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    success(new RatingType(data.rated, data.rating));
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    private static RATE_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/api/rating`;
    private static PROTECTED_RATE_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/protected/api/rating`;
}
