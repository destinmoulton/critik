import { socket } from '@/socket';

const state = () => ({
    is_loading: false,
    is_saving: false,
    current_prompt: {
        id: 0,
        type: 'user',
        content: 'test',
    },
    has_error: false,
    error: '',
});

const actions = {
    bindEvents: ({ commit }) => {
        socket.on('client:prompts:got:single', (res) => {
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
        socket.on('client:prompts:save_complete', (res) => {
            if (res.status === 'success') {
                commit('setPromptData', res);
            }
        });
    },

    /**
     * Get a prompt by id
     * @param context
     * @param prompt_id
     */
    getPromptById: (context, prompt_id) => {
        context.commit('setIsLoading', true);
        socket.emit('server:prompts:get:single_by_id', { prompt_id });
    },

    /**
     * Get the most recently used prompt
     * @param prompt_id
     */
    getRecentPrompt: (context) => {
        context.commit('setIsLoading', true);
        socket.emit('server:prompts:get:single_most_recent');
    },

    savePrompt: (context) => {
        context.commit('setIsSaving', true);

        let method = 'update';
        if (0 === context.state.current_prompt.id) {
            method = 'new';
        }

        socket.emit('server:prompts:save', {
            prompt: context.state.current_prompt,
            method: method,
        });
    },
    clonePrompt: (context) => {
        console.log('clonePrompt called');
        context.dispatch(
            'notifications/addNotification',
            {
                type: 'success',
                msg: 'Created copy of prompt.',
            },
            { root: true },
        );
    },
};
const mutations = {
    setPromptData(state, data) {
        console.log('store:fileviewer setFileData() mutation called', data);
        state.current_prompt = data.prompt;
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
