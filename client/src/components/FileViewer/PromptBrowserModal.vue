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
                    <div class="card col-4" v-for="prompt in all_prompts" :key="prompt.id">
                        <div class="card-body">
                            <p class="card-text">{{ prompt.prompt_text }}</p>
                            <button class="btn btn-secondary btn-sm card-link">
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
        }),
    },
    watch: {
        is_prompt_modal_visible(newVal, oldVal) {
            console.log('watch:is_prompt_modal_visible', newVal);
            if (newVal !== oldVal) {
                var myModalEl = document.querySelector('#js-prompt-browser-modal');
                var modal = Modal.getOrCreateInstance(myModalEl); // Returns a Bootstrap modal instance
                if (true === newVal) {
                    modal.show();
                } else {
                    modal.hide();
                }
            }
        },
    },
    created() {
        this.$store.dispatch('prompts/getAllPrompts');
    },
    setup() {
        return {
            faTrashCan,
        };
    },
};
</script>
