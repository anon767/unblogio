import {Component, Vue} from 'vue-property-decorator';
import WithRender from './blog.html';
import Card from '@/components/Card/Card';
import PostType from '@/types/PostType';
import {PostService} from '@/services/PostService';
import FollowerType from '@/types/FollowerType';
import {FollowerService} from '@/services/FollowerService';

@WithRender
@Component({
    components: {
        Card,
    },
})export default class Blog extends Vue {
    protected posts: PostType[] = [];
    protected sortedByMonth: Map<number, PostType[]> = new Map<number, PostType[]>();
    protected error: string = '';
    protected follower: FollowerType = new FollowerType(false, 0);

    protected mounted(): void {
        PostService.getPostsByUser(this.$route.params.id, (posts: PostType[]) => {
            this.posts = posts;
            this.sortedByMonth = this.sortByMonth(this.posts);
        }, (error: string) => {
            this.error = error;
        });

        this.getFollower();
        // @ts-ignore
        window.setTimeout(() => {
            // @ts-ignore
            $('.previewImage')
                .transition({
                    animation: 'jiggle',
                    duration: 800,
                    interval: 200,
                });
        }, 1000);

    }

    private follow() {
        FollowerService.follow(this.$route.params.id, this.$store.state.username, this.$store.state.token,
            (follower: FollowerType) => {
                this.follower = follower;
            }, (error: string) => {
                this.error = error;
            });
    }

    private getFollower() {
        if (this.$store.getters.isLoggedIn) {
            FollowerService.getFollowerPersonal(this.$route.params.id, this.$store.state.token,
                (follower: FollowerType) => {
                    this.follower = follower;
                    // @ts-ignore
                    $('.follow').rating({
                        initialRating: Number(follower.following),
                    });
                }, (error: string) => {
                    this.error = error;
                });
        } else {
            FollowerService.getFollower(this.$route.params.id,
                (follower: FollowerType) => {
                    this.follower = follower;
                    // @ts-ignore
                    $('.follow').rating();
                }, (error: string) => {
                    this.error = error;
                });
        }

    }

    private sortByMonth(posts: PostType[]): Map<number, PostType[]> {
        const months = new Map<number, PostType[]>();
        posts.forEach((post) => {
            const month = (new Date(post.CreatedAt.replace(' ', 'T'))).getMonth();
            if (!months.has(month)) {
                months.set(month, [post]);
            } else {
                const newMonthSet: PostType[] = months.get(month)!;
                newMonthSet.push(post);
                months.set(month, newMonthSet);
            }
        });
        return months;
    }

    private getMonthByIndex(index: number) {
        const date = new Date();
        date.setMonth(index);
        return date.toLocaleString('default', {month: 'long'});
    }
}
