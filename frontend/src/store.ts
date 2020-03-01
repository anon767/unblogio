import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';


Vue.use(Vuex);
const vuexPersist = new VuexPersist({
    key: 'my-app',
    storage: window.localStorage
});

export default new Vuex.Store({
    state: {
        token: '',
        username: '',
    },
    getters: {
        isLoggedIn: (state: any) => {
            return state.token.length >= 5 && state.username.length >= 3;
        },
    },
    mutations: {
        setToken(state: any, token: string) {
            state.token = token;
        },
        setUsername(state: any, username: string) {
            state.username = username;
        },
    },
    actions: {},
    plugins: [vuexPersist.plugin],
});
