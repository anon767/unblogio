import Axios from 'axios';
import PostType from '@/types/PostType';


interface PostDTO {
    title: string;
    body: string;
    image: string;
    username: string;
    views: number;
    CreatedAt: string;
    DeletedAt: string;
    UpdatedAt: string;
    ID: number;
}

export class PostService {


    public static post(post: PostType, token: string, success: () => void, err: (error: string) => void) {
        const auth = {
            headers: {Authorization: 'Bearer ' + token},
        };
        Axios.post(this.POST_CREATE_ENDPOINT, JSON.stringify(post), auth)
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    success();
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    public static update(post: PostType, token: string, success: () => void, err: (error: string) => void) {
        const auth = {
            headers: {Authorization: 'Bearer ' + token},
        };
        Axios.put(`${this.USER_PROTECTED_ENDPOINT}/${post.username}/posts/${post.title}`, JSON.stringify(post), auth)
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    success();
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    public static getFeed(token: string, success: (posts: PostType[]) => void, err: (error: string) => void) {
        const auth = {
            headers: {Authorization: 'Bearer ' + token},
        };
        Axios.get(`${this.FEED_ENDPOINT}`, auth)
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    const posts: PostType[] = [];
                    data.data.forEach((post: PostDTO) => {
                        posts.push(this.fromDTO(post));
                    });
                    success(posts);
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    public static getAll(searchTerm: string, success: (posts: PostType[]) => void, err: (error: string) => void) {
        Axios.get(`${this.POST_SEARCH_ENDPOINT}/${searchTerm}`)
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    const posts: PostType[] = [];
                    data.data.forEach((post: PostDTO) => {
                        posts.push(this.fromDTO(post));
                    });
                    success(posts);
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    public static getAllNew(success: (posts: PostType[]) => void, err: (error: string) => void) {
        Axios.get(`${this.NEW_POST_ENDPOINT}`)
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    const posts: PostType[] = [];
                    data.data.forEach((post: PostDTO) => {
                        posts.push(this.fromDTO(post));
                    });
                    success(posts);
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    public static getPost(user: string, title: string, success: (post: PostType) => void, err: (error: string) => void) {
        Axios.get(`${this.USER_ENDPOINT}/${user}/posts/${title}`)
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    success(this.fromDTO(data.data as PostDTO));
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    public static getPostsByUser(user: string, success: (posts: PostType[]) => void, err: (error: string) => void) {
        Axios.get(`${this.USER_ENDPOINT}/${user}/posts`)
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    success(data.data.map((post: PostDTO) => this.fromDTO(post)));
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    private static USER_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/api/user`;
    private static POST_CREATE_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/protected/api/posts`;
    private static USER_PROTECTED_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/protected/api/user`;
    private static POST_SEARCH_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/api/posts/search/`;
    private static NEW_POST_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/api/posts/new/`;
    private static FEED_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/protected/api/feed`;

    private static fromDTO(post: PostDTO): PostType {
        const newPost = new PostType(post.image, post.body,
            post.title, post.username, post.views,
            post.CreatedAt);
        newPost.deletedAt = post.DeletedAt;
        newPost.updatedAt = post.UpdatedAt;
        newPost.ID = post.ID;
        return newPost;
    }

}
