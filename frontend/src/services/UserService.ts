import UserType from '@/types/UserType';
import Axios from 'axios';

export class UserService {

    public static login(user: UserType, success: (username: string, token: string) => void, err: (error: string) => void) {
        Axios.post(this.LOGIN_ENDPOINT, JSON.stringify(user))
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    success(data.account.username, data.account.token);
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    public static register(user: UserType, success: (username: string, token: string) => void, err: (error: string) => void) {
        Axios.post(this.REGISTER_ENDPOINT, JSON.stringify(user))
            .then((response) => {
                const data = response.data;
                if (data.status === true) {
                    success(data.account.username, data.account.token);
                } else {
                    err(data.message);
                }
            })
            .catch((error) => {
                err(error.toString());
            });
    }

    private static LOGIN_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/api/user/login`;
    private static REGISTER_ENDPOINT: string = `${process.env.VUE_APP_SERVER_URL}/api/user`;
}
