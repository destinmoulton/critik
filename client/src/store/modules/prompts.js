import { socket } from '@/socket';

const state = () => ({
    is_loading: false,
    is_saving: false,
    has_changed: false,
    current_prompt: {
        id: 0,
        type: 'user',
        text: 'test',
    },
    has_error: false,
    error: '',
    is_prompt_modal_visible: false,
    all_prompts: [],
    is_loading_all_prompts: false,
});

const actions = {
    bindEvents: ({ commit, dispatch }) => {
        socket.on('client:prompts:got:single', (res) => {
            console.log('client:prompts:got:single', res);
            commit('setIsLoading', false);
            if (res.status === 'success') {
                commit('setHasError', false);
                commit('setPromptData', res.prompt);
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
            console.log('client:prompts:save_complete', res);
            commit('setIsSaving', false);
            if (res.status === 'success') {
                commit('setHasChanged', false);
                commit('setPromptData', res.prompt);
            } else {
                commit('setHasError', true);
                commit('setError', res.error);
                dispatch('notifications/error', `Failed to save prompt. ${res.error}`, {
                    root: true,
                });
            }
        });

        socket.on('client:prompts:got:all_prompts', (res) => {
            console.log('client:prompts:got:all_prompts', res);
            commit('setAllPrompts', res.prompts);
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
        context.dispatch('notifications/success', 'Created copy of prompt.', { root: true });
    },
    getAllPrompts: (context) => {
        context.commit('setIsLoadingAllPrompts', true);
        socket.emit('server:prompts:get:all_prompts', { order_by: 'created', order: 'desc' });
    },
    togglePromptModalVisible: ({ commit, state }) => {
        commit('setIsPromptModalVisible', !state.is_prompt_modal_visible);
    },
};
const mutations = {
    setPromptData(state, data) {
        state.current_prompt = {
            id: data.id,
            type: data.prompt_type,
            text: data.prompt_text,
        };
    },
    setIsLoading(state, isLoading) {
        state.is_loading = isLoading;
    },
    setIsSaving(state, isSaving) {
        state.is_saving = isSaving;
    },
    setHasError(state, hasError) {
        state.has_error = hasError;
    },
    setError(state, error) {
        state.error = error;
    },
    setHasChanged(state, hasChanged) {
        state.has_changed = hasChanged;
    },
    setIsLoadingAllPrompts(state, isLoadingAllPrompts) {
        state.is_loading_all_prompts = isLoadingAllPrompts;
    },
    setAllPrompts(state, prompts) {
        state.all_prompts = prompts;
    },
    setIsPromptModalVisible(state, isModalVisible) {
        state.is_prompt_modal_visible = isModalVisible;
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
