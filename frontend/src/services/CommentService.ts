import Axios from 'axios';
import PostType from '@/types/PostType';
import CommentType from '@/types/CommentType';

interface SendCommentDTO {
    postid: number;
    parentid: number;
    likes: number;
    username: string;
    content: string;
}

interface ReceivedCommentDTO {
    ID: number;
    postid: number;
    parentid: number;
    likes: number;
    username: string;
    content: string;
    CreatedAt: string;
}

export class CommentService {


    public static getComments(post: PostType, success: (comments: CommentType) => void, err: (error: string) => void) {
        Axios.get(`${this.COMMENT_ENDPOINT}/${post.username}/posts/${post.title}`)
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    const root: CommentType = new CommentType(0, 0, 0, '', '', '');
                    root.ID = 0;
                    const received: ReceivedCommentDTO[] = data.data as ReceivedCommentDTO[];
                    const tempList: CommentType[] = [];
                    received.forEach((dto) => {
                        const current: CommentType = new CommentType(dto.postid, dto.parentid,
                            dto.likes, dto.username, dto.content, dto.CreatedAt);
                        current.ID = dto.ID;
                        tempList.push(current);
                    });

                    for (let i = 0; i < tempList.length; i++) {
                        if (tempList[i].parentid === 0) {
                            root.children.push(tempList[i]);
                        }
                        for (let j = 0; j < tempList.length; j++) {
                            if (i !== j) {
                                if (tempList[j].parentid === tempList[i].ID) {
                                    tempList[i].children.push(tempList[j]);
                                }
                            }
                        }
                    }
                    success(root);
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    public static comment(comment: CommentType, token: string, success: () => void, err: (error: string) => void) {
        const commentDTO: SendCommentDTO = {
            postid: comment.postid,
            parentid: comment.parentid,
            likes: comment.likes,
            username: comment.username,
            content: comment.content,
        };
        const auth = {
            headers: {Authorization: 'Bearer ' + token},
        };
        Axios.post(this.PROTECTED_COMMENT_ENDPOINT, JSON.stringify(commentDTO), auth)
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

    public static like(comment: CommentType, token: string, success: () => void, err: (error: string) => void) {
        const auth = {
            headers: {Authorization: 'Bearer ' + token},
        };
        Axios.put(`this.PROTECTED_COMMENT_ENDPOINT/${comment.ID}/like`, '', auth)
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

    private static COMMENT_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/api/comment`;
    private static PROTECTED_COMMENT_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/protected/api/comment`;

}
