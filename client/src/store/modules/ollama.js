import { socket } from '@/socket';

const state = () => ({
    text: '',
    full_chat_response: {},
    chat_response_html: '',
    is_chatting: false,
    models: [],
    active_model: '',
});

const actions = {
    bindEvents: ({ commit, state }) => {
        socket.on('client:llm:got:response', (res) => {
            commit('setFullChatResponse', res.full_response);
            commit('setChatResponseHTML', res.chat_html);

            commit('setIsChatting', false);
        });
        socket.on('client:llm:got:models', (res) => {
            // Set the first model as the active one
            commit('setActiveModel', res.models[0].name);
            commit('setModels', res.models);
        });
    },
    setText: ({ commit }, text) => {
        commit('setText', text);
    },
    chat: ({ commit, rootState, state, dispatch }) => {
        if ('' === state.text) {
            dispatch('notifications/error', `Select a paragraph!`, {
                root: true,
            });
            return;
        }
        let content = rootState.prompts.current_prompt.prompt_text;
        if (content.includes('{text}')) {
            content = content.replace('{text}', state.text);
        }
        const args = {
            role: rootState.prompts.current_prompt.prompt_role,
            content: content,
            model: state.active_model,
        };

        commit('setIsChatting', true);
        socket.emit('server:llm:get:chat', args);
    },
    getModels: () => {
        socket.emit('server:llm:get:list_models');
    },
    changeModel: ({ commit }, model) => {
        commit('setActiveModel', model);
    },
};

const mutations = {
    setText(state, text) {
        state.text = text;
    },
    setFullChatResponse(state, chatResponse) {
        state.full_chat_response = chatResponse;
    },
    setChatResponseHTML(state, chatResponseHTML) {
        state.chat_response_html = chatResponseHTML;
    },
    setIsChatting(state, isChatting) {
        state.is_chatting = isChatting;
    },
    setModels(state, models) {
        state.models = models;
    },
    setActiveModel(state, activeModel) {
        state.active_model = activeModel;
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
