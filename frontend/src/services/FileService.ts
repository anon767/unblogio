import Axios from 'axios';
import FileType from '@/types/FileType';

export class FileService {

    public static upload(image: any, token: string, success: (file: FileType) => void, err: (error: string) => void) {
        const auth = {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        };
        Axios.post(`${this.FILE_ENDPOINT}`, image, auth)
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    success(data.file as FileType);
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }


    private static FILE_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/protected/api/files`;
    public static FILE_SERVING_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/api/files`;
    public static NO_IMAGE_AVAILABLE: string = 'https://semantic-ui.com/images/wireframe/image.png';
}
