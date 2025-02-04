import { createStore, createLogger } from 'vuex';

import filebrowser from './modules/filebrowser.js';
import fileviewer from './modules/fileviewer.js';

const debug = true;

export default createStore({
    modules: {
        filebrowser,
        fileviewer,
    },
    strict: debug,
    plugins: debug ? [createLogger()] : [],
});
