<template>
    <div class="container mt-4">
        <div class="card">
            <div class="card-header">
                <h2>Create Category</h2>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" :value="category.name" readonly />
                </div>
                <div class="d-flex justify-content-end">
                    <router-link to="/admin/categories" class="btn btn-light">Back</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/services/axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const category = ref({});

const fetchCategory = async () => {
    try {
        const response = await axios.get(`/api/categories/${route.params.id}`);
        category.value = response.data.data;
    } catch (error) {
        console.error('Error loading category:', error);
    }
};

onMounted(fetchCategory);
</script>
