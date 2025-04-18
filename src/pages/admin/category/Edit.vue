<template>
    <div class="container mt-4">
        <div class="card">
            <div class="card-header">
                <h2>Edit Category</h2>
            </div>
            <div class="card-body">
                <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input v-model="form.name" class="form-control" :class="{ 'is-invalid': errors.name }" />
                        <div class="invalid-feedback" v-if="errors.name">
                            {{ errors.name[0] }}
                        </div>
                    </div>
                    <div class="d-flex justify-content-end gap-2">
                        <router-link to="/admin/categories" class="btn btn-light">Cancel</router-link>
                        <button class="btn btn-primary">Update</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from '@/services/axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const form = reactive({
    name: '',
});

const errors = ref({});

const fetchCategory = async () => {
    try {
        const response = await axios.get(`/api/categories/${route.params.id}`);
        form.name = response.data.data.name;
    } catch (error) {
        console.error('Error fetching category:', error);
    }
};

const handleSubmit = async () => {
    errors.value = {};
    try {
        await axios.put(`/api/categories/${route.params.id}`, form);
        router.push('/admin/categories');
    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {};
        } else {
            console.error('Unexpected error:', error);
        }
    }
};

onMounted(() => {
    fetchCategory();
});
</script>
