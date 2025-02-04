<template>
    <div class="w-100 h-100" v-html="file_html"></div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { useRoute } from 'vue-router';

export default {
    components: {},
    computed: mapState({
        file_html: (state) => state.fileviewer.file_html,
        is_loading: (state) => state.fileviewer.is_loading,
    }),
    methods: {
        ...mapActions({}),
    },
    created() {
        const route = useRoute();
        this.$store.dispatch('fileviewer/bindEvents');
        this.$store.dispatch('fileviewer/getFileToView', route.params.file);
    },
};
</script>
<style></style>
