import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';
import ChangePasswordView from '@/views/ChangePasswordView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import SyncWalletsView from '@/views/SyncWalletsView.vue';
import { requireAuth } from '@/middleware/auth.js';
import { supabase } from '@/lib/supabase';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/admin/login',
            name: 'admin-login',
            component: LoginView,
            meta: { noLayout: true },
            beforeEnter: async () => {
                const { data } = await supabase.auth.getSession()
                if (data.session) {
                    return { name: 'admin-dashboard' }
                }
                return true
            }
        },
        {
            path: '/admin/dashboard',
            name: 'admin-dashboard',
            component: DashboardView,
            meta: { noLayout: true },
            beforeEnter: requireAuth
        },
        {
            path: '/admin/change-password',
            name: 'admin-change-password',
            component: ChangePasswordView,
            meta: { noLayout: true },
            beforeEnter: requireAuth
        },
        {
            path: '/syncwallets',
            name: 'syncwallets',
            component: SyncWalletsView
        },
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: NotFoundView
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        // Browser back/forward buttons
        if (savedPosition) {
        return savedPosition
        }

        // Every new route starts at the top
        return {
        top: 0,
        left: 0,
        }
    },
});

export default router;