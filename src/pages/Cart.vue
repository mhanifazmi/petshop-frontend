<template>
    <div class="container py-5">
        <div class="bg-white p-4 rounded shadow-sm">
            <h2 class="mb-4 text-primary">🛒 Your Cart</h2>

            <div v-if="cart.length">
                <div class="d-flex flex-column gap-3">
                    <div v-for="item in cart" :key="item.id"
                        class="d-flex align-items-center justify-content-between p-3 border rounded">
                        <!-- Left: Image + Details -->
                        <div class="d-flex align-items-center gap-3">
                            <img :src="item.image_url" alt="Product" class="rounded"
                                style="width: 80px; height: 80px; object-fit: cover;" />
                            <div>
                                <h6 class="mb-1">{{ item.name }}</h6>
                                <small class="text-muted">${{ Number(item.price).toFixed(2) }} each</small>
                            </div>
                        </div>

                        <!-- Middle: Quantity -->
                        <div class="text-center">
                            <strong>{{ item.quantity }}</strong>
                        </div>

                        <!-- Right: Total + Remove button -->
                        <div class="text-end">
                            <div>
                                <strong>${{ (item.price * item.quantity).toFixed(2) }}</strong>
                            </div>
                            <button class="btn btn-sm btn-outline-danger mt-2" @click="removeFromCart(item.id)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Grand Total -->
                <div class="text-end mt-4">
                    <h5 class="text-success">Total: ${{ total.toFixed(2) }}</h5>
                </div>

                <div class="text-end mt-3">
                    <button class="btn btn-primary" @click="placeOrder">Place Order</button>
                </div>
            </div>

            <div v-else class="text-center py-5 text-muted">
                <i class="bi bi-cart-x fs-1 mb-3"></i>
                <p>Your cart is empty.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/services/axios';
import auth from './../services/auth'
import Swal from 'sweetalert2'

const cart = ref([])

onMounted(() => {
    cart.value = JSON.parse(localStorage.getItem('cart') || '[]')
})

const total = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const removeFromCart = (id) => {
    cart.value = cart.value.filter(item => item.id !== id)
    localStorage.setItem('cart', JSON.stringify(cart.value))
}

const placeOrder = async () => {
    try {
        await auth.getCsrfToken()
        const user = auth.getUser()

        const payload = cart.value.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            source: 'outbound',
            user_id: user.id
        }))

        await axios.post('/api/stocks/multiple-store', payload)

        await Swal.fire({
            icon: 'success',
            title: 'Order placed!',
            text: 'Your order has been placed successfully.',
            confirmButtonColor: '#3085d6'
        })

        cart.value = []
        localStorage.removeItem('cart')
    } catch (err) {
        console.error(err)

        Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Failed to place order. Please try again.',
            confirmButtonColor: '#d33'
        })
    }
}
</script>