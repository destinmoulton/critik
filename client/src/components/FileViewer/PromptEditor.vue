<template>
    <div class="">
        <button class="btn btn-secondary m-1">
            <FontAwesomeIcon :icon="faFolderOpen" />
            Browse
        </button>
        <button class="btn btn-secondary m-1" @click="clonePrompt">
            <FontAwesomeIcon :icon="faClone" />
            Copy Prompt
        </button>
        <button class="btn btn-secondary m-1">
            <FontAwesomeIcon :icon="faPlus" />
            New Prompt
        </button>
    </div>
    <div>
        <textarea
            class="form-control"
            id="js-fv-prompt"
            v-model="current_prompt.text"
            :disabled="is_saving"
        ></textarea>
    </div>
    <div>
        <button class="btn btn-secondary m-1" @click="savePrompt">
            <FontAwesomeIcon :icon="faFloppyDisk" />
        </button>
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
    }),
    methods: {
        ...mapActions({
            savePrompt: 'prompts/savePrompt',
            clonePrompt: 'prompts/clonePrompt',
        }),
    },
    watch: {},
    created() {
        this.$store.dispatch('prompts/bindEvents');
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
