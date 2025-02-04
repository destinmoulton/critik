<template>
    <div class="w-100 h-100">{file_html}</div>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
    components: {},
    computed: mapState({
        file_html: (state) => state.fileviewer.file_html,
    }),
    methods: {
        ...mapActions({}),
    },
    created() {
        this.$store.dispatch('fileviewer/bindEvents');
    },
};
</script>
<style></style>
