<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Order List</h2>
        </div>

        <table class="table table-bordered">
            <thead class="table-dark">
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Source</th>
                    <th style="width: 200px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="stocks.length === 0">
                    <td colspan="4" class="text-center">No data found</td>
                </tr>
                <tr v-for="stock in stocks" :key="stock.id">
                    <td>{{ stock.product?.name || '-' }}</td>
                    <td>{{ stock.quantity }}</td>
                    <td>{{ stock.source }}</td>
                    <td>
                        <router-link :to="`/admin/orders/${stock.id}`" class="btn btn-sm btn-info me-1" title="View">
                            <i class="bi bi-eye"></i>
                        </router-link>
                        <router-link :to="`/admin/orders/${stock.id}/edit`" class="btn btn-sm btn-warning me-1"
                            title="Edit">
                            <i class="bi bi-pencil"></i>
                        </router-link>
                        <button @click="deleteStock(stock.id)" class="btn btn-sm btn-danger" title="Delete">
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

const stocks = ref([])

const fetchStocks = async () => {
    try {
        const res = await axios.get('/api/stocks')
        stocks.value = res.data.data
    } catch (error) {
        console.error('Error fetching stocks:', error)
    }
}

const deleteStock = async (id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This will permanently delete the stock record.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
        try {
            await axios.delete(`/api/stocks/${id}`)
            fetchStocks()
            Swal.fire('Deleted!', 'The stock has been deleted.', 'success')
        } catch (err) {
            console.error('Error deleting stock:', err)
            Swal.fire('Error!', 'Failed to delete the stock.', 'error')
        }
    }
}

onMounted(fetchStocks)
</script>

<style scoped>
.btn+.btn {
    margin-left: 0.5rem;
}
</style>
