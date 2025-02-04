import { createStore, createLogger } from 'vuex';

import filebrowser from './modules/filebrowser.js';

const debug = true;

export default createStore({
    modules: {
        filebrowser,
    },
    strict: debug,
    plugins: debug ? [createLogger()] : [],
});
