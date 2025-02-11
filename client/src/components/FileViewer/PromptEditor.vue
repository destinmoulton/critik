<template>
    <div class="ctk-prompt-editor-top-loading" v-if="is_loading_single">Loading...</div>
    <div class="ctk-prompt-editor-top-wrapper" v-if="!is_loading_single">
        <div class="">
            <button class="btn btn-secondary m-1" @click="toggleIsPromptModalVisible">
                <FontAwesomeIcon :icon="faFolderOpen" />
                Browse
            </button>
            <button class="btn btn-secondary m-1" @click="clonePrompt">
                <FontAwesomeIcon :icon="faClone" />
                Copy Prompt
            </button>
            <button class="btn btn-secondary m-1" @click="newPrompt">
                <FontAwesomeIcon :icon="faPlus" />
                New Prompt
            </button>
        </div>
        <div>
            <textarea
                class="form-control"
                id="js-fv-prompt"
                v-model="current_prompt.prompt_text"
                :disabled="is_saving"
            ></textarea>
        </div>
        <div>
            <button class="btn btn-secondary m-1" @click="savePrompt">
                <FontAwesomeIcon :icon="faFloppyDisk" />
            </button>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClone } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faFolderOpen, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

export default {
    components: { FontAwesomeIcon },
    computed: mapState({
        current_prompt: (state) => state.prompts.current_prompt,
        is_saving: (state) => state.prompts.is_saving,
        is_loading_single: (state) => state.prompts.is_loading_single,
    }),
    methods: {
        ...mapActions({
            savePrompt: 'prompts/savePrompt',
            clonePrompt: 'prompts/clonePrompt',
            toggleIsPromptModalVisible: 'prompts/togglePromptModalVisible',
            newPrompt: 'prompts/newPrompt',
        }),
    },
    watch: {},
    created() {
        this.$store.dispatch('prompts/bindEvents');
        // Try to load the most recent prompt
        this.$store.dispatch('prompts/getRecentPrompt');
    },
    setup() {
        return {
            faClone,
            faPlus,
            faFolderOpen,
            faFloppyDisk,
        };
    },
};
</script>
