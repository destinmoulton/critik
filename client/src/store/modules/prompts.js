import { socket } from '@/socket';

const NEW_PROMPT = {
    id: 0,
    prompt_role: 'user',
    prompt_text: '',
};
const state = () => ({
    is_loading_single: false,
    is_saving: false,
    has_changed: false,
    current_prompt: { ...NEW_PROMPT }, // clone object
    has_error: false,
    error: '',
    is_prompt_modal_visible: false,
    all_prompts: [],
    is_loading_all_prompts: false,
});

const actions = {
    bindEvents: ({ commit, dispatch, state }) => {
        socket.on('client:prompts:got:single', (res) => {
            console.log('client:prompts:got:single', res);
            commit('setIsLoadingSingle', false);
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
            commit('setIsLoadingAllPrompts', false);
            commit('setAllPrompts', res.prompts);
        });

        socket.on('client:prompts:delete_complete', (res) => {
            console.log('client:prompts:delete_complete', res);
            if (res.status === 'success') {
                if (parseInt(res.prompt_id) === state.current_prompt.id) {
                    // Deleted active prompt
                    dispatch('newPrompt');
                }

                dispatch('getAllPrompts');
                dispatch('notifications/success', 'Prompt deleted.', { root: true });
            } else {
                dispatch('notifications/error', 'Failed to delete prompt.', { root: true });
            }
        });
    },

    /**
     * Get a prompt by id
     * @param context
     * @param prompt_id
     */
    loadPromptById: (context, prompt_id) => {
        context.commit('setIsLoadingSingle', true);
        socket.emit('server:prompts:get:single_by_id', { prompt_id });
    },

    /**
     * Get the most recently used prompt
     * @param prompt_id
     */
    getRecentPrompt: (context) => {
        context.commit('setIsLoadingSingle', true);
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
    clonePrompt: ({ commit, dispatch, state }) => {
        commit('setPromptData', {
            id: 0,
            prompt_text: state.current_prompt.prompt_text,
            prompt_role: state.current_prompt.prompt_role,
        });
        dispatch('notifications/success', 'Created copy of prompt.', { root: true });
    },
    getAllPrompts: (context) => {
        context.commit('setIsLoadingAllPrompts', true);
        socket.emit('server:prompts:get:all_prompts', { order_by: 'created', order: 'desc' });
    },
    togglePromptModalVisible: ({ commit, state }) => {
        commit('setIsPromptModalVisible', !state.is_prompt_modal_visible);
    },
    deletePrompt(context, prompt_id) {
        socket.emit('server:prompts:delete:single_by_id', { prompt_id });
    },
    newPrompt({ commit }) {
        commit('setPromptData', { ...NEW_PROMPT });
    },
};
const mutations = {
    setPromptData(state, data) {
        state.current_prompt = {
            id: data.id,
            prompt_role: data.prompt_role,
            prompt_text: data.prompt_text,
        };
    },
    setIsLoadingSingle(state, isLoading) {
        state.is_loading_single = isLoading;
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
        if (null === prompts) {
            state.all_prompts = [];
        } else {
            state.all_prompts = prompts;
        }
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
