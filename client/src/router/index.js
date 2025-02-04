import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FileBrowserView from '../views/FileBrowserView.vue';
import FileViewerView from '../views/FileViewerView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue'),
        },
        {
            path: '/file_browser',
            name: 'file_browser',
            component: FileBrowserView,
        },
        {
            path: '/view/:file',
            name: 'view',
            component: FileViewerView,
        },
    ],
});

export default router;
