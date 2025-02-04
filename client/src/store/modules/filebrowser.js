import { socket } from '@/socket';

const state = () => ({
    path: '',
    parent_path: '',
    files: [],
});

function requestFiles(state) {
    socket.emit('server:filebrowser:list', { path: state.path }, () => {
        console.log('socket.io-client :: server:filebrowser:list emit()');
    });
}

const actions = {
    bindEvents: ({ commit, state }) => {
        socket.on('connect', () => {
            requestFiles(state);
        });

        socket.on('client:filebrowser:list', (res) => {
            commit('setFiles', res.files);
            commit('setPath', res.path);
            commit('setParentPath', res.parent_path);
        });
    },
    changePath: ({ commit, state }, path) => {
        console.log('changePath called', path);
        commit('setPath', path);
        requestFiles(state);
    },
};

const mutations = {
    setFiles(state, files) {
        console.log('store:filebrowser setFiles() called', files);
        state.files = files;
    },
    setPath(state, path) {
        console.log('store:filebrowser setPath called', path);
        state.path = path;
    },
    setParentPath(state, parentPath) {
        console.log('store:filebrowser setParentPath called', parentPath);
        state.parent_path = parentPath;
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
