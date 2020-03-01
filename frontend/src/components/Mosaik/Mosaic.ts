import {Component, Vue} from 'vue-property-decorator';
import WithRender from './mosaic.html';
import Card from '@/components/Card/Card';
import PostType from '@/types/PostType';
import {PostService} from '@/services/PostService';
import Welcome from '@/components/Welcome/Welcome';
import Events, {EventBus} from '@/services/Eventbus';

@WithRender
@Component({
    components: {
        Card,
        Welcome,
    },
})export default class Mosaic extends Vue {
    private posts: PostType[] = [];
    private imagesLoaded: number = 0;
    private error: string = '';

    beforeDestroy(): void {
        EventBus.$off(Events.CHECK_UPDATES, this.fetch);
    }

    mounted(): void {
        EventBus.$on(Events.CHECK_UPDATES, this.fetch);
        this.fetch();
    }

    protected fetch() {
        PostService.getAllNew((posts: PostType[]) => {
            this.posts = posts;
        }, (error: string) => {
            this.error = error;
        });
    }

    protected handleLoad() {
        this.imagesLoaded++;
        if (this.imagesLoaded >= this.posts.length) {
            // @ts-ignore
            $('.grid').masonry({
                itemSelector: '.grid-item',
            });
        }
    }
}
