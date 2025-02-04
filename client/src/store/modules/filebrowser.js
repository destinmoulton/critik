import { socket } from '@/socket';

const state = () => ({
    path: '',
    files: [],
});

const actions = {
    bindEvents: ({ commit, state }) => {
        socket.on('connect', () => {
            socket.emit('server:filebrowser:list', { path: state.path }, () => {
                console.log('socket.io-client :: server:filebrowser:list emit()');
            });
        });

        socket.on('client:filebrowser:list', (res) => {
            commit('setFiles', res.files);
            commit('setPath', res.path);
        });
    },
};

const mutations = {
    setFiles(state, files) {
        console.log('store:filebrowser setFiles() called');
        state.files = files;
    },
    setPath(state, path) {
        state.path = path;
    },
};

const getters = {};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
