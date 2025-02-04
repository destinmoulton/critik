import { socket } from '@/socket';

const state = () => ({
    is_loading: false,
    file_path: '',
    file_original_contents: '',
    file_html: '',
    has_error: false,
    error: '',
});

const actions = {
    bindEvents: ({ commit }) => {
        socket.on('client:fileviewer:gotfile', (res) => {
            commit('setIsLoading', false);
            if (res.status === 'success') {
                commit('setHasError', false);
                commit('setFileData', res);
            } else {
                commit('setHasError', true);
                if (Object.hasOwn(res, 'error')) {
                    commit('setError', res.error);
                } else {
                    commit('setError', 'Unknown error occurred.');
                }
            }
        });
    },

    getFileToView: (context, file_path) => {
        context.commit('setIsLoading', true);
        console.log('store::getFileToView()', file_path);
        socket.emit('server:fileviewer:getfile', { file_path });
    },
};
const mutations = {
    setFileData(state, data) {
        console.log('store:fileviewer setFileData() mutation called', data);
        state.file_path = data.file_path;
        state.file_original_contents = data.file_original_contents;
        state.file_html = data.file_html;
    },
    setIsLoading(state, isLoading) {
        state.is_loading = isLoading;
    },
    setHasError(state, hasError) {
        state.has_error = hasError;
    },
    setError(state, error) {
        state.error = error;
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
