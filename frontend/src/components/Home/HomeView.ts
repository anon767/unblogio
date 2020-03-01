import {Component, Vue} from 'vue-property-decorator';
import WithRender from './homeView.html';
import Card from '@/components/Card/Card';
import PostType from '@/types/PostType';
import {PostService} from '@/services/PostService';
import Welcome from '@/components/Welcome/Welcome';
import Events, {EventBus} from '@/services/Eventbus';
import Post from '@/components/Post/Post';

@WithRender
@Component({
    components: {
        Card,
        Welcome,
    },
})export default class HomeView extends Vue {
    private posts: PostType[] = [];
    private error: string = '';
    private searchTerm: string = '';

    beforeDestroy(): void {
        EventBus.$off(Events.CHECK_UPDATES, this.useSearch);
    }

    mounted(): void {
        EventBus.$on(Events.CHECK_UPDATES, this.useSearch);
        EventBus.$on(Events.SEARCH_USED, this.useSearch);
        if (this.$route.params.searchTerm) {
            this.searchTerm = this.$route.params.searchTerm;
        }
        this.useSearch(this.searchTerm);

    }

    updatePosts(posts: PostType[]) {
        this.posts = posts;
    }

    useSearch(searchTerm: string) {
        if (searchTerm !== undefined) {
            this.searchTerm = searchTerm;
        }


        if (this.$store.getters.isLoggedIn && (searchTerm === '' || searchTerm === undefined)) {
            PostService.getFeed(this.$store.state.token, (posts: PostType[]) => {
                this.updatePosts(posts);
                if (this.posts.length <= 0) {
                    this.getAll();
                }
            }, (error: string) => {
                this.error = error;
            });
            return;
        }

        this.getAll();
    }

    protected getAll() {
        PostService.getAll(this.searchTerm, (posts: PostType[]) => {
            this.updatePosts(posts);
            if (this.posts.length <= 0) {
                this.error = 'Nothing found :(';
            }
        }, (error: string) => {
            this.error = error;
        });
    }

}
