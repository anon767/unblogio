import {Component, Prop, Vue} from 'vue-property-decorator';
import WithRender from './rating.html';
import Card from '@/components/Card/Card';
import PostType from '@/types/PostType';
import {PostService} from '@/services/PostService';
import {RatingService} from '@/services/RatingService';
import RatingType from '@/types/RatingType';

@WithRender
@Component({
    components: {
        Card,
    },
})export default class Rating extends Vue {

    @Prop()
    protected post!: PostType;
    protected rating: RatingType = new RatingType(false, 0);

    protected mounted(): void {
        if (this.$store.getters.isLoggedIn) {
            RatingService.getRatingPersonal(this.post, this.$store.state.token, (rating: RatingType) => {
                this.rating = rating;
                // @ts-ignore
                $('.ui.rating').rating({
                    initialRating: Number(rating.rated),
                });
            }, (error: string) => {
                console.log(error);
            });
        } else {
            RatingService.getRating(this.post, (rating: RatingType) => {
                this.rating = rating;
            }, (error: string) => {
                console.log(error);
            });
        }

    }

    protected rate() {
        RatingService.rate(this.post, this.$store.state.username, this.$store.state.token, (rating: RatingType) => {
            this.rating = rating;
        }, (error: string) => {
            console.log(error);
        });
    }


}
