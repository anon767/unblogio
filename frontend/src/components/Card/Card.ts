import {Component, Prop, Vue} from 'vue-property-decorator';
import WithRender from './Card.html';
import PostType from '@/types/PostType';

@WithRender
@Component
export default class Card extends Vue {
    public MAX_TEASER_LENGTH: number = 250;

    @Prop()
    public post!: PostType;


}
