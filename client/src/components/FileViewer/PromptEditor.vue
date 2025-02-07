<template>
    <div class="">
        <button class="btn btn-secondary m-1">
            <FontAwesomeIcon :icon="faFolderOpen" />
            Browse
        </button>
        <button class="btn btn-secondary m-1">
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
            v-model="current_prompt.content"
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
    }),
    methods: {
        ...mapActions({
            savePrompt: 'prompts/savePrompt',
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
