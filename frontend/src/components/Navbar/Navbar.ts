import {Component, Vue} from 'vue-property-decorator';
import WithRender from './navbar.html';
import Card from '@/components/Card/Card';
import LoginModal from '@/components/LoginModal/LoginModal';
import RegisterModal from '@/components/RegisterModal/RegisterModal';
import Events, {EventBus} from '@/services/Eventbus';

@WithRender
@Component({
    components: {
        Card,
        LoginModal,
        RegisterModal,
    },
})export default class Navbar extends Vue {
    private searchString: string = '';

    protected openLoginModal() {
        EventBus.$emit(Events.LOGIN_MODAL_OPEN);
    }

    protected openRegisterModal() {
        EventBus.$emit(Events.REGISTER_MODAL_OPEN);
    }

    protected search() {
        if (this.searchString === '') {
            this.home();
            return;
        }
        this.$router.push('/home/' + encodeURI(this.searchString));
        EventBus.$emit(Events.SEARCH_USED, encodeURI(this.searchString));
        this.searchString = '';
    }

    protected home() {
        EventBus.$emit(Events.SEARCH_USED, '');
        this.$router.push('/home/');
    }

    protected logout() {
        this.$store.commit('setToken', '');
        this.$store.commit('setUsername', '');
    }


}
