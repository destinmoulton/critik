<template>
    <div class="row">
        <div class="col-6 h-100">
            <div v-show="is_loading">Loading file...</div>
            <div id="js-fv-html" class="ctk-fv-wrapper" v-html="file_html"></div>
        </div>
        <div class="col-6 h-100 ctk-fv-analysis-wrapper">
            <div class="container">
                <div class="row">
                    <PromptEditor></PromptEditor>
                </div>
            </div>
        </div>
    </div>
    <PromptBrowserModal></PromptBrowserModal>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { useRoute } from 'vue-router';
import PromptEditor from '@/components/FileViewer/PromptEditor.vue';
import PromptBrowserModal from '@/components/FileViewer/PromptBrowserModal.vue';

export default {
    components: { PromptBrowserModal, PromptEditor },
    computed: mapState({
        file_html: (state) => state.fileviewer.file_html,
        is_loading: (state) => state.fileviewer.is_loading,
    }),
    methods: {
        ...mapActions({}),
        initialize_viewer_actions() {
            this.$nextTick(() => {
                const viewerEl = document.querySelector('#js-fv-html');
                const els = viewerEl.querySelectorAll('p');

                console.log('initialize_viewer_actions', els);
                for (const el of els) {
                    el.classList.add('ctk-fv-paragraph');
                    el.addEventListener('mouseover', () => {
                        el.classList.add('ctk-fv-paragraph-hover');
                    });
                    el.addEventListener('mouseout', () => {
                        el.classList.remove('ctk-fv-paragraph-hover');
                    });
                }
            });
        },
    },
    watch: {
        file_html(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.initialize_viewer_actions();
            }
        },
    },
    created() {
        const route = useRoute();
        this.$store.dispatch('fileviewer/bindEvents');
        this.$store.dispatch('fileviewer/getFileToView', route.params.file);
    },
};
</script>
<style>
.ctk-fv-wrapper {
}

.ctk-fv-wrapper p {
    margin: 5px;
    padding: 5px;
    border: 1px solid white;
}

.ctk-fv-wrapper p.ctk-fv-paragraph-hover {
    border: 1px solid green;
}

.ctk-fv-wrapper p.ctk-fv-paragraph {
    cursor: pointer;
}

.ctk-ft-analysis-wrapper {
    padding: 10px;
}
</style>
