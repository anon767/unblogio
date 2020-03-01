import {Component, Vue} from 'vue-property-decorator';
import WithRender from './loginModal.html';
import Card from '@/components/Card/Card';
import Events, {EventBus} from '@/services/Eventbus';
import {UserService} from '@/services/UserService';
import UserType from '@/types/UserType';

@WithRender
@Component({
    components: {
        Card,
    },
})
export default class LoginModal extends Vue {

    private email: string = '';
    private password: string = '';
    private error: string = '';

    protected mounted(): void {
        EventBus.$on(Events.LOGIN_MODAL_OPEN, this.openModal);
    }

    private openModal() {
        // @ts-ignore
        $('#loginModal').modal('show');
    }

    private login() {
        const user: UserType = new UserType('', this.email, this.password, null);
        UserService.login(user, (username: string, token: string) => {
            this.$store.commit('setToken', token);
            this.$store.commit('setUsername', username);
            window.setTimeout(() => {
                // @ts-ignore
                $('#loginModal').modal('hide');
            }, 200);
        }, (error: string) => {
            this.error = error;
        });


    }
}
