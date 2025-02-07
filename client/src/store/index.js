import { createStore, createLogger } from 'vuex';

import filebrowser from './modules/filebrowser.js';
import fileviewer from './modules/fileviewer.js';
import prompts from './modules/prompts.js';

const debug = true;

export default createStore({
    modules: {
        filebrowser,
        fileviewer,
        prompts,
    },
    strict: debug,
    plugins: debug ? [createLogger()] : [],
});
