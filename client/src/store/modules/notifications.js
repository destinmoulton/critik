import { socket } from '@/socket';

const state = () => ({
    notifications: [],
});

const actions = {
    bindEvents: ({ commit }) => {
        socket.on('client:notifications:receive', (res) => {
            commit('addNotification', res.notification);
        });
    },

    addNotification: (context, notification) => {
        context.commit('addNotification', notification);
    },

    removeNotification: (context, id) => {
        context.commit('removeNotification', id);
    },
};
const mutations = {
    addNotification(state, data) {
        console.log('addNotification', data);
        const notification = {
            id: crypto.randomUUID(),
            msg: data.msg,
            type: data.type,
        };
        state.notifications.push(notification);
    },

    removeNotification(state, id) {
        state.notifications = state.notifications.filter((obj) => {
            return obj.id !== id;
        });
    },
};

const getters = {};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
