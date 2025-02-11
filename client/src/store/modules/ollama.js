import { socket } from '@/socket';

const state = () => ({
    text: '',
});

const actions = {
    bindEvents: ({ commit, state }) => {
        socket.on('client:ollama:got:response', (res) => {
            // TODO
        });
    },
    setText: ({ commit }, text) => {
        commit('setText', text);
    },
};

const mutations = {
    setText(state, text) {
        state.text = text;
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
