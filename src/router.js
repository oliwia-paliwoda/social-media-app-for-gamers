import Vue from 'vue';
import Router from 'vue-router';
import { store } from '../store.js';

import Dashboard from './components/Dashboard.vue';
import MyProfile from './components/MyProfile.vue';
import UserProfile from './components/UserProfile.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Settings from './components/Settings.vue';
import FriendsSearch from './components/FriendsSearch.vue';
import NotificationsBoard from './components/NotificationsBoard.vue';

Vue.use(Router);

const routes = [
    { path: '/profile/my', component: MyProfile, meta: { requiresAuth: true } },
    { path: '/profile/:userId', component: UserProfile, meta: { requiresAuth: true } },
    { path: '/', component: Login },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/register', component: Register },
    { path: '/settings', component: Settings, meta: { requiresAuth: true } },
    { path: '/friends-search', component: FriendsSearch, meta: { requiresAuth: true } },
    { path: '/notifications', component: NotificationsBoard, meta: { requiresAuth: true } }
];

const router = new Router({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    const isLoggedIn = !!store.state.currentUser;

    if (to.meta.requiresAuth && !isLoggedIn) {
        next('/');
    } else {
        next();
    }
});

export default router;
