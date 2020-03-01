import {Component, Vue} from 'vue-property-decorator';
import WithRender from './post.html';
import Card from '@/components/Card/Card';
import PostType from '@/types/PostType';
import {PostService} from '@/services/PostService';
import Rating from '@/components/Rating/Rating';
import Comments from '@/components/Comments/Comments';
import DateService from '@/services/DateService';

@WithRender
@Component({
    components: {
        Card,
        Rating,
        Comments,
    },
})export default class Post extends Vue {

    protected post: PostType | null = null;
    protected error: string = '';

    protected parseDate(date: string): string {
        return DateService.pgresToJS(date).toLocaleDateString();
    }
    protected mounted(): void {
        PostService.getPost(this.$route.params.blogId, this.$route.params.postId, (post: PostType) => {
            this.post = post;
        }, (error) => {
            this.error = error;
        });
    }


}
