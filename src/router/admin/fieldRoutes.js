import List from '../../pages/admin/field/Index.vue';
import Create from '../../pages/admin/field/Create.vue';
import Edit from '../../pages/admin/field/Edit.vue';
import View from '../../pages/admin/field/Show.vue';

export default [
    {
        path: '/admin/fields',
        component: List,
    },
    {
        path: '/admin/fields/:id',
        component: View,
    },
    {
        path: '/admin/fields/create',
        component: Create,
    },
    {
        path: '/admin/fields/:id/edit',
        component: Edit,
    },
];
