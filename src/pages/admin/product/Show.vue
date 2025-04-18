<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Product Details</h2>
            <router-link to="/admin/products" class="btn btn-light">
                Back to List
            </router-link>
        </div>

        <div class="card">
            <div class="card-body">
                <form>
                    <div class="mb-3" v-if="form.image_url">
                        <label class="form-label d-block">Image</label>
                        <img :src="form.image_url" alt="Product Image" class="img-fluid" />
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input v-model="form.name" class="form-control" readonly />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Code</label>
                        <input v-model="form.code" class="form-control" readonly />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Price</label>
                        <input type="number" v-model="form.price" class="form-control" readonly />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Categories</label>
                        <div>
                            <div v-if="form.categories.length" class="form-control d-flex flex-wrap gap-1">
                                <span v-for="cat in form.categories" :key="cat.id" class="badge bg-primary">
                                    {{ cat.name }}
                                </span>
                            </div>
                            <span v-else class="text-muted">No categories assigned</span>
                        </div>
                    </div>

                    <div v-for="field in allFields" :key="field.id" class="mb-3">
                        <label class="form-label">{{ field.name }}</label>

                        <template v-if="field.type === 'text' || field.type === 'textarea'">
                            <input v-if="field.type === 'text'" type="text" v-model="form.fields[field.id]"
                                class="form-control" readonly />
                            <textarea v-else v-model="form.fields[field.id]" class="form-control" readonly></textarea>
                        </template>

                        <template v-else-if="['select', 'radio'].includes(field.type)">
                            <input type="text" v-model="form.fields[field.id]" class="form-control" readonly />
                        </template>

                        <template v-else-if="field.type === 'checkbox'">
                            <div>
                                <span v-for="(value, index) in form.fields[field.id]" :key="index">
                                    {{ value }}{{ index < form.fields[field.id].length - 1 ? ', ' : '' }} </span>
                            </div>
                        </template>
                    </div>

                    <div class="d-flex justify-content-end">
                        <router-link to="/admin/products" class="btn btn-light me-1">Back</router-link>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import axios from '@/services/axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const productId = route.params.id;

const form = reactive({
    name: '',
    code: '',
    price: '',
    fields: {},
    categories: [],
    image_url: '', // Adding image_url to the form data
});

const allFields = reactive([]);

const parseOptions = (value) => {
    try {
        return JSON.parse(value || '[]');
    } catch {
        return [];
    }
};

const fetchFields = async () => {
    const { data } = await axios.get('/api/fields');
    allFields.splice(0, allFields.length, ...data.data || []);
};

const fetchProduct = async () => {
    const { data } = await axios.get(`/api/products/${productId}`);
    Object.assign(form, {
        name: data.data.name,
        code: data.data.code,
        price: data.data.price,
        categories: data.data.categories || [],
        image_url: data.data.image_url || '', // Assuming the full URL is included in the API response
    });

    data.data.fields?.forEach(field => {
        try {
            if (Array.isArray(JSON.parse(field.pivot.value))) {
                form.fields[field.id] = JSON.parse(field.pivot.value).map(opt => opt.label);
            } else {
                form.fields[field.id] = JSON.parse(field.pivot.value).label || '';
            }
        } catch {
            form.fields[field.id] = field.pivot.value;
        }
    });
};

onMounted(async () => {
    await fetchFields();
    await fetchProduct();
});
</script>

<style scoped>
.btn+.btn {
    margin-left: 0.5rem;
}
</style>
