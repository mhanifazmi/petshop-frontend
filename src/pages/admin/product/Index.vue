<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Product List</h2>
            <router-link to="/admin/products/create" class="btn btn-primary d-flex align-items-center">
                <i class="bi bi-plus-lg me-2"></i> Create Product
            </router-link>
        </div>

        <table class="table table-bordered">
            <thead class="table-dark">
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Price</th>
                    <th>Current Stock</th>
                    <th style="width: 200px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="products.length === 0">
                    <td colspan="6" class="text-center">No data found</td>
                </tr>
                <tr v-for="product in products" :key="product.id">
                    <td>
                        <img :src="product.image_url" alt="Preview" style="max-height: 150px;" />
                    </td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.code }}</td>
                    <td>${{ Number(product.price).toFixed(2) }}</td>
                    <td>{{ product.current_stock }}</td>
                    <td>
                        <router-link :to="`/admin/products/${product.id}/stocks`" class="btn btn-sm btn-secondary me-1"
                            title="Stock">
                            <i class="bi bi-box-seam"></i>
                        </router-link>
                        <router-link :to="`/admin/products/${product.id}`" class="btn btn-sm btn-info me-1"
                            title="View">
                            <i class="bi bi-eye"></i>
                        </router-link>
                        <router-link :to="`/admin/products/${product.id}/edit`" class="btn btn-sm btn-warning me-1"
                            title="Edit">
                            <i class="bi bi-pencil"></i>
                        </router-link>
                        <button @click="deleteProduct(product.id)" class="btn btn-sm btn-danger" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/services/axios'
import Swal from 'sweetalert2'

const products = ref([])

// Fetch products from the API
const fetchProducts = async () => {
    try {
        const response = await axios.get('/api/products')
        products.value = response.data.data
    } catch (error) {
        console.error('Error fetching products:', error)
    }
}

const deleteProduct = async (productId) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        try {
            await axios.delete(`/api/products/${productId}`);
            fetchCategories();
            Swal.fire(
                'Deleted!',
                'The product has been deleted.',
                'success'
            );
        } catch (error) {
            console.error('Error deleting product:', error);
            Swal.fire(
                'Error!',
                'There was an error deleting the product.',
                'error'
            );
        }
    }
}

onMounted(() => {
    fetchProducts();
})
</script>

<style scoped>
.btn+.btn {
    margin-left: 0.5rem;
}
</style>
