// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import EcommerceLayout from '../layouts/EcommerceLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import Home from '../pages/Index.vue';
import Cart from '../pages/Cart.vue';
import Login from '../components/Login.vue';
import AdminLogin from '../pages/admin/Login.vue';
import categoryRoutes from './admin/categoryRoutes.js';
import orderRoutes from './admin/orderRoutes.js';
import productRoutes from './admin/productRoutes.js';
import userRoutes from './admin/userRoutes.js';
import { useAuthStore } from '../stores/auth.js'
import BlankLayout from '../layouts/BlankLayout.vue';
import Index from '../pages/admin/Index.vue';
import fieldRoutes from './admin/fieldRoutes.js';

const routes = [
    {
        path: '/',
        component: EcommerceLayout,
        children: [
            {
                path: '',
                name: 'index',
                component: Home
            },
            {
                path: 'cart',
                name: 'cart',
                component: Cart
            },
        ],
    },
    {
        path: '/admin',
        component: BlankLayout,
        children: [
            {
                path: 'login',
                name: 'admin.login',
                component: AdminLogin,
            },
            {
                path: '',
                component: AdminLayout,
                meta: { requiresAuth: true },
                children: [
                    {
                        path: 'dashboard',
                        name: 'admin.index',
                        component: Index,
                    },
                    ...categoryRoutes,
                    ...orderRoutes,
                    ...productRoutes,
                    ...userRoutes,
                    ...fieldRoutes,
                ],
            },
        ],
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    authStore.checkAuth();

    const isAdminRoute = to.fullPath.startsWith('/admin');
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!authStore.isAuthenticated) {
            return next({ name: 'admin.login' });
        } else if (isAdminRoute && !authStore.user?.role_id) {
            return next({ name: 'index' });
        }
    }

    next();
});

export default router;