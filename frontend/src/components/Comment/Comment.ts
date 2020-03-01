import {Component, Prop, Vue} from 'vue-property-decorator';
import WithRender from './Comment.html';
import CommentType from '@/types/CommentType';
import {CommentService} from '@/services/CommentService';
import Events, {EventBus} from '@/services/Eventbus';
import DateService from '@/services/DateService';

@WithRender
@Component
export default class Comment extends Vue {

    @Prop()
    public comment!: CommentType;

    public reply: boolean = false;
    protected error: string = '';
    protected content: string = '';

    protected mounted(): void {
        EventBus.$on(Events.COMMENT_REPLY_OPEN, (id: number) => {
            if (this.comment.ID !== id) {
                this.reply = false;
            }
        });

    }

    protected parseDate(date: string): string {
        return DateService.getRelativeTime(DateService.pgresToJS(date));
    }

    protected like() {
        CommentService.like(this.comment, this.$store.state.token, () => {
                this.comment.likes++;
            }, (error: string) => {
                this.error = error;
            },
        );
    }

    protected propagateButtonClick() {
        if (!this.reply) {
            EventBus.$emit(Events.COMMENT_REPLY_OPEN, this.comment.ID);
            this.reply = true;
        } else {
            this.reply = false;
        }
    }

    protected postComment() {
        CommentService.comment(new CommentType(this.comment.postid, this.comment.ID, 0, this.$store.state.username, this.content, ''), this.$store.state.token, () => {
            EventBus.$emit(Events.REFRESH_COMMENTS);
            this.reply = false;
            this.content = '';
        }, (error: string) => {
            this.error = error;
        });
    }
}
