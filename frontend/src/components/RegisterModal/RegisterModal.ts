import {Component, Vue} from 'vue-property-decorator';
import WithRender from './registerModal.html';
import Card from '@/components/Card/Card';
import Events, {EventBus} from '@/services/Eventbus';
import UserType from '@/types/UserType';
import {UserService} from '@/services/UserService';

@WithRender
@Component({
    components: {
        Card,
    },
})
export default class RegisterModal extends Vue {
    private username: string = '';
    private email: string = '';
    private password: string = '';
    private passwordRepeat: string = '';
    private error: string = '';

    protected mounted(): void {
        EventBus.$on(Events.REGISTER_MODAL_OPEN, this.openModal);
    }

    private openModal(): void {
        // @ts-ignore
        $('#registerModal').modal('show');
    }

    private register() {
        const user: UserType = new UserType(this.username, this.email, this.password, `https://avatars.dicebear.com/v2/avataaars/${this.username}.svg`);
        if (this.password !== this.passwordRepeat) {
            this.error = 'password fields do not match!';
            return;
        }
        UserService.register(user, (username: string, token: string) => {
            this.$store.commit('setToken', token);
            this.$store.commit('setUsername', username);
            // @ts-ignore
            $('#registerModal').modal('hide');
        }, (error: string) => {
            this.error = error;
        });
    }
}
