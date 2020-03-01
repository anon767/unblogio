import Axios from 'axios';
import PostType from '@/types/PostType';
import RatingType from '@/types/RatingType';
import FollowerType from '@/types/FollowerType';

interface FollowDTO {
    blogname: string;
    username: string;
}

export class FollowerService {

    public static getFollower(blogname: string, success: (follower: FollowerType) => void, err: (error: string) => void) {
        Axios.get(`${this.RATE_ENDPOINT}/${blogname}/follow`)
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    success(new FollowerType(data.following, data.count));
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    public static getFollowerPersonal(blogname: string, token: string, success: (follower: FollowerType) => void, err: (error: string) => void) {
        const auth = {
            headers: {Authorization: 'Bearer ' + token},
        };
        Axios.get(`${this.PROTECTED_RATE_ENDPOINT}/${blogname}/follow`, auth)
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    success(new FollowerType(data.following, data.count));
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    public static follow(blogname: string, username: string, token: string, success: (follower: FollowerType) => void, err: (error: string) => void) {
        const follower: FollowDTO = {blogname: blogname, username: username};
        const auth = {
            headers: {Authorization: 'Bearer ' + token},
        };
        Axios.put(`${this.PROTECTED_RATE_ENDPOINT}/${blogname}/follow`, JSON.stringify(follower), auth)
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    success(new FollowerType(data.following, data.count));
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    private static RATE_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/api/user`;
    private static PROTECTED_RATE_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/protected/api/user`;
}
