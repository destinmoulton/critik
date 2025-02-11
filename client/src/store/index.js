import { createStore, createLogger } from 'vuex';

import filebrowser from './modules/filebrowser.js';
import fileviewer from './modules/fileviewer.js';
import prompts from './modules/prompts.js';
import notifications from './modules/notifications.js';
import ollama from './modules/ollama.js';

const debug = true;

export default createStore({
    modules: {
        filebrowser,
        fileviewer,
        notifications,
        prompts,
        ollama,
    },
    namespaced: true,
    strict: debug,
    plugins: debug ? [createLogger()] : [],
});
