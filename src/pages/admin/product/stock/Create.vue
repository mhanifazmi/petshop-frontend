<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>
                {{ isEdit ? 'Edit' : 'Create' }} Stock
                <span v-if="product">({{ product.name }})</span>
            </h2>
        </div>

        <div class="card">
            <div class="card-body">
                <form @submit.prevent="submitStock">
                    <div class="mb-3">
                        <label for="quantity" class="form-label">Quantity</label>
                        <input type="number" class="form-control" id="quantity" v-model="quantity" required />
                    </div>
                    <div class="mb-3">
                        <label for="source" class="form-label">Source</label>
                        <select id="source" class="form-select" v-model="source" required>
                            <option value="" disabled>Select Source</option>
                            <option value="inbound">Inbound</option>
                            <option value="outbound">Outbound</option>
                        </select>
                    </div>
                    <div class="d-flex justify-content-end">
                        <router-link :to="`/admin/products/${productId}/stocks`"
                            class="btn btn-light me-1">Back</router-link>
                        <button class="btn btn-primary">Create</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/services/axios'
import auth from '../../../../services/auth'

const route = useRoute()
const router = useRouter()

const productId = route.params.id
const quantity = ref('')
const source = ref('')
const product = ref(null)

const isEdit = computed(() => false)

const user = auth.getUser();

const fetchProduct = async () => {
    try {
        const response = await axios.get(`/api/products/${productId}`)
        product.value = response.data.data
        console.log(response.data.data)
    } catch (error) {
        console.error('Failed to fetch product:', error.response?.data || error)
    }
}

const submitStock = async () => {
    try {
        const stockData = {
            quantity: quantity.value,
            source: source.value,
            user_id: user.id
        }

        const response = await axios.post(`/api/products/${productId}/stocks`, stockData)

        router.push(`/admin/products/${productId}/stocks`)
    } catch (error) {
        console.error('Failed to add stock:', error.response?.data || error)
    }
}

onMounted(fetchProduct)
</script>

<style scoped>
.card {
    border-radius: 8px;
}
</style>
