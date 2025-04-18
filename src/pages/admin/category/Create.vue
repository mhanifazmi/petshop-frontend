<template>
    <div class="container mt-4">
        <div class="card">
            <div class="card-header">
                <h2>Create Category</h2>
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
                    <div class="d-flex justify-content-end">
                        <router-link to="/admin/categories" class="btn btn-light">Cancel</router-link>
                        <button class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from '@/services/axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
    name: '',
});

const errors = ref({});

const handleSubmit = async () => {
    errors.value = {}; // Reset errors
    try {
        await axios.post('/api/categories', form);
        router.push('/admin/categories');
    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {};
        } else {
            console.error('Unexpected error:', error);
        }
    }
};
</script>
