import List from '../../pages/admin/order/Index.vue';
import Create from '../../pages/admin/order/Create.vue';
import Edit from '../../pages/admin/order/Edit.vue';
import View from '../../pages/admin/order/Show.vue';

export default [
    {
        path: '/admin/orders',
        component: List,
    },
    {
        path: '/admin/orders/:id',
        component: View,
    },
    {
        path: '/admin/orders/create',
        component: Create,
    },
    {
        path: '/admin/orders/:id/edit',
        component: Edit,
    },
];
