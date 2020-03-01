import {Component, Vue} from 'vue-property-decorator';
import WithRender from './postEdit.html';
import Card from '@/components/Card/Card';
import PostType from '@/types/PostType';
import {PostService} from '@/services/PostService';
import {FileService} from '@/services/FileService';
import FileType from '@/types/FileType';

@WithRender
@Component({
    components: {
        Card,
    },
})export default class PostEdit extends Vue {
    protected title: string = '';
    protected image: string = FileService.NO_IMAGE_AVAILABLE;
    protected editor: any;
    protected error: string = '';
    protected success: string = '';
    protected info: string = '';
    private exists: boolean = false;
    private ID: number = 0;
    protected mounted(): void {
        const postId = this.$route.params.postId;
        const blogId = this.$route.params.blogId;

        if (postId && blogId) {
            PostService.getPost(blogId, postId, (post: PostType) => {
                this.title = post.title;
                this.editor.root.innerHTML = post.body;
                this.image = post.image;
                this.exists = true;
                this.ID = post.ID;
            }, (error: string) => {
                this.error = error;
            });
        }
        const toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            [{'color': []}, {'background': []}],          // dropdown with defaults from theme
            [{'font': []}],
            [{'align': []}],
            ['link', 'image', 'video', 'formula'],
            ['clean'],                                     // remove formatting button
        ];
        // @ts-ignore
        this.editor = new Quill('.editor', {
            modules: {
                syntax: true,              // Include syntax module
                toolbar: toolbarOptions,  // Include button in toolbar
                imageResize: {
                    displaySize: true
                },
            },
            theme: 'snow',
        }); // First matching element will be used

    }

    protected onFileChange(event: Event) {
        const formData = new FormData();
        this.info = 'Image is beeging uploaded';
        // @ts-ignore
        formData.append('file', event.target.files[0]);
        FileService.upload(formData, this.$store.state.token, (file: FileType) => {
            this.info = '';
            this.success = 'image has been uploaded';
            this.image = FileService.FILE_SERVING_ENDPOINT + '/' + file.path;
            this.error = '';
        }, (error: string) => {
            this.info = '';
            this.error = error;
        });
    }

    protected post() {
        const post: PostType = new PostType(this.image,
            this.editor.root.innerHTML,
            this.title, this.$store.state.username, 0, new Date().toISOString());
        post.ID = this.ID;
        if (this.exists) {
            this.update(post);
        } else {
            this.create(post);
        }
    }

    protected create(post: PostType) {
        PostService.post(post, this.$store.state.token, () => {
            this.success = 'Yay you just published a new Post!';
            this.error = '';
        }, (error: string) => {
            this.error = error;
        });
    }

    protected update(post: PostType) {
        PostService.update(post, this.$store.state.token, () => {
            this.success = 'You successfuly updated this Post!';
        }, (error: string) => {
            this.error = error;
        });
    }

    protected back() {
        const post: PostType = new PostType(this.image,
            this.editor.root.innerHTML,
            this.title, this.$store.state.username, 0, new Date().toISOString());
        this.$router.push(post.createURL());
    }

    protected imgUpload() {
        // @ts-ignore
        $('#imgupload').trigger('click');
    }


}
