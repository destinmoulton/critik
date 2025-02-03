import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueSocketIO from 'vue-socket.io';

const app = createApp(App);

app.use(
    new VueSocketIO({
        debug: true,
        connection: window.location.hostname + ':3000',
        vuex: {
            store,
        },
    }),
);
app.use(router);
app.use(store);

app.mount('#app');
