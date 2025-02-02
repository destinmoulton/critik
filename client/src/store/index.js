import {createStore, createLogger} from 'vuex';

import files from './modules/files.js';
const debug = true;

export default createStore({
  modules: {
    files
  },
  strict:debug,
  plugins:debug?[createLogger()]:[]
})
