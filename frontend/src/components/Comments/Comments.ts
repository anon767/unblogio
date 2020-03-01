import {Component, Prop, Vue} from 'vue-property-decorator';
import WithRender from './Comments.html';
import PostType from '@/types/PostType';
import Comment from '@/components/Comment/Comment';
import CommentType from '@/types/CommentType';
import {CommentService} from '@/services/CommentService';
import Events, {EventBus} from '@/services/Eventbus';

@WithRender
@Component({
    components: {
        Comment,
    },
})
export default class Comments extends Vue {

    @Prop()
    public post!: PostType;

    public comments: CommentType | null = null;
    protected error: string = '';
    protected content: string = '';

    protected mounted(): void {
        this.getComments();
        EventBus.$on(Events.REFRESH_COMMENTS, this.getComments);
    }


    protected getComments() {
        CommentService.getComments(this.post, (comments: CommentType) => {
            this.comments = comments;
        }, (error: string) => {
            this.error = error;
        });
    }

    protected postComment() {
        CommentService.comment(new CommentType(this.post.ID, 0, 0, this.$store.state.username, this.content, ''), this.$store.state.token, () => {
            this.content = '';
            this.getComments();
        }, (error: string) => {
            this.error = error;
        });
    }

}
