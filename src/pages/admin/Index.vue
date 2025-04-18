<template>
    <div>
        <h2 class="mb-4">Dashboard</h2>

        <div class="row">
            <div class="col-md-4 mb-3">
                <div class="card text-white bg-primary">
                    <div class="card-body">
                        <h5 class="card-title">Total Products</h5>
                        <p class="card-text fs-4">{{ summary.products }}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card text-white bg-success">
                    <div class="card-body">
                        <h5 class="card-title">Total Users</h5>
                        <p class="card-text fs-4">{{ summary.users }}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card text-white bg-warning">
                    <div class="card-body">
                        <h5 class="card-title">Total Categories</h5>
                        <p class="card-text fs-4">{{ summary.categories }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/services/axios'

const summary = ref({
    products: 0,
    users: 0,
    categories: 0,
})

const fetchSummary = async () => {
    try {
        const res = await axios.get('/api/dashboard')
        summary.value = res.data.data
    } catch (err) {
        console.error('Failed to load dashboard summary:', err)
    }
}

onMounted(fetchSummary)
</script>
