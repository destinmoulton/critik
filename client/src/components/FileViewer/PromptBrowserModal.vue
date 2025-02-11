<template>
    <!-- Modal -->
    <div
        class="modal fade"
        id="js-prompt-browser-modal"
        tabindex="-1"
        aria-labelledby="js-prompt-browser-modal-label"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="js-prompt-browser-modal-label">Prompts</h5>
                    <button
                        type="button"
                        class="btn-close"
                        aria-label="Close"
                        @click="toggleIsPromptModalVisible"
                    ></button>
                </div>
                <div class="modal-body">
                    <div
                        class="card text-center"
                        v-if="all_prompts.length === 0"
                        :key="all_prompts.length"
                    >
                        No prompts found.
                    </div>
                    <div class="card col-4" v-for="prompt in all_prompts" :key="prompt.id">
                        <div class="card-body">
                            <p class="card-text">{{ prompt.prompt_text }}</p>
                            <button
                                class="btn btn-secondary btn-sm card-link"
                                :data-ctk-prompt-id="prompt.id"
                                @click="confirmDeletePrompt"
                            >
                                <FontAwesomeIcon :icon="faTrashCan" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { Modal } from 'bootstrap';

export default {
    components: { FontAwesomeIcon },
    computed: mapState({
        is_prompt_modal_visible: (state) => state.prompts.is_prompt_modal_visible,
        all_prompts: (state) => state.prompts.all_prompts,
        is_loading_all_prompts: (state) => state.prompts.is_loading_all_prompts,
    }),
    methods: {
        ...mapActions({
            toggleIsPromptModalVisible: 'prompts/togglePromptModalVisible',
            deletePrompt: 'prompts/deletePrompt',
        }),
        confirmDeletePrompt(e) {
            const prompt_id = e.target.getAttribute('data-ctk-prompt-id');

            const resp = confirm('Are you sure you want to delete this prompt?');
            if (resp) {
                this.deletePrompt(prompt_id);
            }
        },
    },
    watch: {
        is_prompt_modal_visible(newVal, oldVal) {
            console.log('watch:is_prompt_modal_visible', newVal);
            if (newVal !== oldVal) {
                let myModalEl = document.querySelector('#js-prompt-browser-modal');
                let modal = Modal.getOrCreateInstance(myModalEl); // Returns a Bootstrap modal instance
                if (true === newVal) {
                    this.$store.dispatch('prompts/getAllPrompts');
                    modal.show();
                } else {
                    modal.hide();
                }
            }
        },
    },
    created() {},
    setup() {
        return {
            faTrashCan,
        };
    },
};
</script>
