import List from '../../pages/admin/product/Index.vue';
import Form from '../../pages/admin/product/Form.vue';
import Show from '../../pages/admin/product/Show.vue';
import Stock from '../../pages/admin/product/Stock/Index.vue';
import StockCreate from '../../pages/admin/product/Stock/Create.vue';

export default [
    {
        path: '/admin/products',
        component: List,
    },
    {
        path: '/admin/products/:id',
        component: Show,
    },
    {
        path: '/admin/products/create',
        component: Form,
    },
    {
        path: '/admin/products/:id/edit',
        component: Form,
    },
    {
        path: '/admin/products/:id/stocks',
        component: Stock,
        props: true
    },
    {
        path: '/admin/products/:id/stocks/create',
        component: StockCreate,
        props: true
    }
];
