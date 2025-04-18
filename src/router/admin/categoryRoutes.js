import List from '../../pages/admin/category/Index.vue';
import Create from '../../pages/admin/category/Create.vue';
import Edit from '../../pages/admin/category/Edit.vue';
import View from '../../pages/admin/category/Show.vue';

export default [
    {
        path: '/admin/categories',
        name: 'category.index',
        component: List,
    },
    {
        path: '/admin/categories/:id',
        name: 'category.show',
        component: View,
    },
    {
        path: '/admin/categories/create',
        name: 'category.create',
        component: Create,
    },
    {
        path: '/admin/categories/:id/edit',
        name: 'category.edit',
        component: Edit,
    },
];
