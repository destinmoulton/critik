<template>
    <div class="spinner-border text-primary" role="status" v-if="is_chatting"></div>
    <div class="m-3 ctk-chat-response" v-html="chat_response_html"></div>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
    components: {},
    computed: mapState({
        is_chatting: (state) => state.ollama.is_chatting,
        full_chat_response: (state) => state.ollama.full_chat_response,
        chat_response_html: (state) => state.ollama.chat_response_html,
    }),
    methods: {
        ...mapActions({}),
    },
    watch: {},
    created() {
        this.$store.dispatch('ollama/bindEvents');
        this.$store.dispatch('ollama/getModels');
    },
    setup() {
        return {};
    },
};
</script>
<style>
.ctk-chat-response {
}
</style>
