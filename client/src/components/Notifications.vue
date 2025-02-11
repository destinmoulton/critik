<template>
    <div class="toast-container">
        <div
            class="toast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            v-for="notification in notifications"
            :key="notification.id"
            :data-ctk-notification-id="notification.id"
        >
            <div class="toast-header">
                <span class="ctk-notification-header-error" v-if="notification.type === 'error'"
                    >Error!</span
                >
                <span class="ctk-notification-header-success" v-if="notification.type === 'success'"
                    >Success!</span
                >
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                ></button>
            </div>
            <div class="toast-body">{{ notification.msg }}</div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { Toast } from 'bootstrap';

export default {
    components: {},
    computed: mapState({
        notifications: (state) => state.notifications.notifications,
    }),
    methods: {
        ...mapActions({}),
        displayToasts: function () {
            this.$nextTick(() => {
                var toastElList = [].slice.call(document.querySelectorAll('.toast'));
                console.log('displayToasts', toastElList);
                const config = {
                    autohide: true,
                    delay: 8000,
                };
                for (const toastEl of toastElList) {
                    let toast = Toast.getOrCreateInstance(toastEl, config);
                    if (!toastEl.classList.contains('show')) {
                        toast.show();
                    }

                    toastEl.addEventListener('hide.bs.toast', () => {
                        const id = toastEl.getAttribute('data-ctk-notification-id');
                        this.$store.dispatch('notifications/removeNotification', id);
                    });
                }
            });
        },
    },
    watch: {
        notifications: {
            handler: function () {
                this.displayToasts();
            },
            deep: true,
            immediate: true,
        },
    },
    created() {
        this.$store.dispatch('notifications/bindEvents');
    },
    mounted() {},
};
</script>
<style>
.toast-container {
    position: fixed !important;
    bottom: 10px;
    right: 10px;
}

.ctk-notification-header-error {
    color: maroon;
    font-size: 1.3rem;
    font-weight: bold;
}

.ctk-notification-header-success {
    color: seagreen;
    font-size: 1.3rem;
    font-weight: bold;
}
</style>
