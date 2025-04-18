<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">
                Stocks List
                <span v-if="product">({{ product.name }})</span>
            </h2>
            <div class="d-flex">
                <router-link :to="`/admin/products`" class="btn btn-light d-flex align-items-center me-1">
                    Back
                </router-link>
                <router-link :to="`/admin/products/${productId}/stocks/create`"
                    class="btn btn-primary d-flex align-items-center">
                    <i class="bi bi-plus-lg me-2"></i> Create Transaction
                </router-link>
            </div>
        </div>

        <table class="table table-bordered">
            <thead class="table-dark">
                <tr>
                    <th>Reference</th>
                    <th>Quantity</th>
                    <th>Source</th>
                    <th>Added By</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="stocks.length === 0">
                    <td colspan="4" class="text-center">No data found</td>
                </tr>
                <tr v-for="stock in stocks" :key="stock.id">
                    <td>{{ stock.reference }}</td>
                    <td>{{ stock.quantity }}</td>
                    <td>{{ stock.source }}</td>
                    <td>{{ stock.user ? stock.user.name : 'N/A' }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/services/axios'

const route = useRoute()
const productId = route.params.id || ''
const stocks = ref([])
const product = ref(null)

const fetchStockHistory = async () => {
    try {
        const response = await axios.get(`/api/products/${productId}/stocks`)
        stocks.value = response.data?.data ?? []
    } catch (error) {
        console.error('Error fetching stock history:', error)
    }
}

const fetchProduct = async () => {
    try {
        const response = await axios.get(`/api/products/${productId}`)
        product.value = response.data?.data ?? null
    } catch (error) {
        console.error('Failed to fetch product:', error.response?.data || error)
    }
}

onMounted(() => {
    fetchStockHistory()
    fetchProduct()
})
</script>

<style scoped>
.table td,
.table th {
    vertical-align: middle;
}
</style>
