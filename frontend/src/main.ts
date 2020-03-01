import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Navbar from '@/components/Navbar/Navbar';
import ClockService from '@/services/ClockService.vue';

Vue.config.productionTip = false;
Vue.component('navbar', Navbar);
Vue.component('clockService', ClockService);

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
