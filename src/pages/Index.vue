<template>
    <div>
        <h2 class="mb-4">Available Products</h2>

        <div class="row">
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <!-- Search -->
                        <div class="mb-3">
                            <label for="priceFilter">Search: </label>
                            <b-input-group>
                                <b-form-input v-model="searchText" type="text" placeholder="Search..."
                                    @input="onSearchInput" />
                                <b-input-group-append>
                                    <b-input-group-text @click="clearSearch" style="cursor: pointer">
                                        <i class="bi bi-x"></i>
                                    </b-input-group-text>
                                </b-input-group-append>
                            </b-input-group>
                        </div>

                        <!-- Price Filter -->
                        <div class="mb-3">
                            <label>Filter by Price: </label>
                            <input type="number" v-model="priceFilter" placeholder="Max Price" class="form-control" />
                        </div>

                        <!-- Category Filter -->
                        <div class="mb-3">
                            <label>Filter by Category: </label>
                            <Multiselect v-model="selectedCategories" :options="allCategories" :multiple="true"
                                :close-on-select="false" placeholder="Select categories" label="name" track-by="id"
                                class="w-100" />
                        </div>

                        <!-- Sort Controls -->
                        <div class="mb-3">
                            <label for="sortBy">Sort by: </label>
                            <select v-model="sortBy" class="form-control">
                                <option value="name">Name</option>
                                <option value="price">Price</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="sortOrder">Sort Order: </label>
                            <select v-model="sortOrder" class="form-control">
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Product Grid -->
            <div class="col-md-9">
                <div v-if="paginatedProducts.length > 0" class="row row-cols-1 row-cols-md-3 g-4">
                    <div class="col" v-for="product in paginatedProducts" :key="product.id">
                        <div class="card h-100">
                            <img :src="product.image_url" class="card-img-top" :alt="product.name" />
                            <div class="card-body">
                                <h5 class="card-title">{{ product.name }}</h5>
                                <p class="card-text">Price: ${{ Number(product.price).toFixed(2) }}</p>
                                <p class="card-text">Stock: {{ product.current_stock }}</p>
                                <p class="card-text">
                                    Categories:
                                    <span v-for="(cat, index) in product.categories" :key="cat.id">
                                        {{ cat.name }}<span v-if="index < product.categories.length - 1">, </span>
                                    </span>
                                </p>
                                <button class="btn btn-primary" @click="addToCart(product)">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center mt-4 mx-auto">
                    <p>No products found.</p>
                </div>
                <!-- Pagination -->
                <div class="d-flex justify-content-center mt-4">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1"
                        class="btn btn-secondary">Previous</button>
                    <span class="mx-3">Page {{ currentPage }} of {{ totalPages }}</span>
                    <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages"
                        class="btn btn-secondary">Next</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import axios from '@/services/axios'
import { useAuthStore } from './../stores/auth'
import Swal from 'sweetalert2'

const searchText = ref('')
const priceFilter = ref(0)
const sortBy = ref('name')
const sortOrder = ref('asc')
const currentPage = ref(1)
const itemsPerPage = 6

const selectedCategories = ref([])
const allCategories = ref([])

const products = ref([])

const fetchProducts = async () => {
    try {
        const response = await axios.get('/api/all-products')
        products.value = response.data?.data ?? []
    } catch (error) {
        console.error('Error fetching products:', error)
    }
}

const fetchCategories = async () => {
    try {
        const response = await axios.get('/api/all-categories')
        const categories = response.data?.data ?? []
        allCategories.value = categories.map(category => ({
            id: category.id,
            name: category.name
        }))
        console.log(allCategories)
    } catch (error) {
        console.error('Error fetching categories:', error)
        allCategories.value = []
    }
}


const filteredProducts = computed(() => {
    if (!Array.isArray(products.value)) return []


    return products.value.filter(product => {
        const matchesPrice = product.price <= priceFilter.value || priceFilter.value === 0
        const matchesSearch = product.name.toLowerCase().includes(searchText.value.toLowerCase())
        const matchesCategory =
            selectedCategories.value.length === 0 ||
            product.categories.some(cat =>
                selectedCategories.value.some(selected => selected.id === cat.id)
            )
        return matchesPrice && matchesSearch && matchesCategory
    })
})

const sortedProducts = computed(() => {
    return [...filteredProducts.value].sort((a, b) => {
        if (sortBy.value === 'price') {
            return sortOrder.value === 'asc' ? a.price - b.price : b.price - a.price
        } else {
            return sortOrder.value === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        }
    })
})

const totalPages = computed(() =>
    Math.ceil(sortedProducts.value.length / itemsPerPage)
)

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return sortedProducts.value.slice(start, start + itemsPerPage)
})

function changePage(page) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

function clearSearch() {
    searchText.value = ''
}

const authStore = useAuthStore()

function addToCart(product) {
    authStore.checkAuth()
    if (!authStore.isAuthenticated) {
        window.dispatchEvent(new Event('show-login-modal'))
        return
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(p => p.id === product.id)

    if (existing) {
        if (existing.quantity >= product.current_stock) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops!',
                text: 'Cannot add more than available stock.',
            })
            return
        }
        existing.quantity += 1
    } else {
        if (product.current_stock < 1) {
            Swal.fire({
                icon: 'warning',
                title: 'Out of Stock',
                text: 'Product is currently out of stock.',
            })
            return
        }
        cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    Swal.fire({
        icon: 'success',
        title: 'Added to Cart',
        text: 'Product added to your cart!',
        timer: 1500,
        showConfirmButton: false,
    })
}

onMounted(() => {
    fetchProducts();
    fetchCategories();
})
</script>