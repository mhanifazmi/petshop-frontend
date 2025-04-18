import List from '../../pages/admin/user/Index.vue';
import Form from '../../pages/admin/user/Form.vue';
import View from '../../pages/admin/user/Show.vue';

export default [
    {
        path: '/admin/users',
        component: List,
    },
    {
        path: '/admin/users/:id',
        component: View,
    },
    {
        path: '/admin/users/create',
        component: Form,
    },
    {
        path: '/admin/users/:id/edit',
        component: Form,
    },
];
