import {Component, Vue} from 'vue-property-decorator';
import WithRender from './welcome.html';
import Card from '@/components/Card/Card';
import Events, {EventBus} from '@/services/Eventbus';

@WithRender
@Component({
    components: {
        Card,
    },
})
export default class Welcome extends Vue {

    protected mounted(): void {
    }

}
