import Vue from 'vue';
import Router from 'vue-router';
import HomeView from '@/components/Home/HomeView';
import Mosaic from '@/components/Mosaik/Mosaic';
import Post from '@/components/Post/Post';
import Blog from '@/components/Blog/Blog';
import PostEdit from '@/components/PostEdit/PostEdit';

Vue.use(Router);

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {path: '/home', component: HomeView},
    {path: '/home/:searchTerm', component: HomeView},
    {path: '/mosaic', component: Mosaic},
    {path: '/blog/:id', component: Blog},
    {path: '/blog/:blogId/new', component: PostEdit},
    {path: '/blog/:blogId/:postId', component: Post},
    {path: '/blog/:blogId/:postId/edit', component: PostEdit},

];

export default new Router({
    routes,
});
