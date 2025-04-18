<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>{{ isEdit ? 'Edit' : 'Create' }} Product</h2>
            <router-link to="/admin/products" class="btn btn-light">
                Back to List
            </router-link>
        </div>

        <div class="card">
            <div class="card-body">
                <form @submit.prevent="handleSubmit">
                    <!-- Product Name -->
                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input v-model="form.name" class="form-control" :class="{ 'is-invalid': errors.name }" />
                        <div class="invalid-feedback" v-if="errors.name">{{ errors.name[0] }}</div>
                    </div>

                    <!-- Product Code -->
                    <div class="mb-3">
                        <label class="form-label">Code</label>
                        <input v-model="form.code" class="form-control" :class="{ 'is-invalid': errors.code }" />
                        <div class="invalid-feedback" v-if="errors.code">{{ errors.code[0] }}</div>
                    </div>

                    <!-- Product Price -->
                    <div class="mb-3">
                        <label class="form-label">Price</label>
                        <input type="number" v-model="form.price" class="form-control"
                            :class="{ 'is-invalid': errors.price }" />
                        <div class="invalid-feedback" v-if="errors.price">{{ errors.price[0] }}</div>
                    </div>

                    <!-- Image Upload -->
                    <div class="mb-3">
                        <label class="form-label">Image</label>
                        <input type="file" class="form-control" @change="handleImageChange" accept="image/*" />
                        <div v-if="previewImage" class="mt-2">
                            <img :src="previewImage" alt="Preview" style="max-height: 150px;" />
                        </div>
                    </div>

                    <div class="mb-3" v-if=!isEdit>
                        <label class="form-label">Initial Stock</label>
                        <input type="number" v-model="form.stock" class="form-control"
                            :class="{ 'is-invalid': errors.stock }" />
                        <div class="invalid-feedback" v-if="errors.stock">{{ errors.stock[0] }}</div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Categories</label>
                        <multiselect v-model="form.categories" :options="allCategories" :multiple="true" label="name"
                            :track-by="'id'" placeholder="Select categories" />
                    </div>

                    <div v-for="field in allFields" :key="field.id" class="mb-3">
                        <label class="form-label">{{ field.name }}</label>
                        <template v-if="field.type === 'text' || field.type === 'textarea'">
                            <input v-if="field.type === 'text'" type="text" v-model="form.fields[field.id]"
                                class="form-control" />
                            <textarea v-else v-model="form.fields[field.id]" class="form-control"></textarea>
                        </template>

                        <template v-else-if="['select', 'radio'].includes(field.type)">
                            <select v-model="form.fields[field.id]" class="form-select">
                                <option disabled value="">Select an option</option>
                                <option v-for="opt in parseOptions(field.value)" :key="opt.value" :value="opt.label">
                                    {{ opt.label }}
                                </option>
                            </select>
                        </template>

                        <template v-else-if="field.type === 'checkbox'">
                            <div class="form-check" v-for="opt in parseOptions(field.value)" :key="opt.value">
                                <input class="form-check-input" type="checkbox" :id="`field-${field.id}-${opt.value}`"
                                    :value="opt.label" v-model="form.fields[field.id]" />
                                <label class="form-check-label" :for="`field-${field.id}-${opt.value}`">
                                    {{ opt.label }}
                                </label>
                            </div>
                        </template>
                    </div>

                    <!-- Submit & Cancel Buttons -->
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-light me-1" type="button" @click="cancel">Cancel</button>
                        <button class="btn btn-primary">Submit</button>
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
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

const route = useRoute();
const router = useRouter();
const productId = route.params.id;
const isEdit = !!productId;

const imageFile = ref(null);
const previewImage = ref('');

const form = reactive({
    name: '',
    code: '',
    initialStock: '',
    price: '',
    fields: {},
    categories: []
});

const errors = ref({});
const allFields = ref([]);
const allCategories = ref([]);

const parseOptions = (value) => {
    try {
        return JSON.parse(value || '[]');
    } catch {
        return [];
    }
};

const fetchFields = async () => {
    const { data } = await axios.get('/api/fields');
    allFields.value = data.data || [];
};

const fetchCategories = async () => {
    const { data } = await axios.get('/api/categories');
    allCategories.value = data.data || [];
};

const fetchProduct = async () => {
    const { data } = await axios.get(`/api/products/${productId}`);
    Object.assign(form, {
        name: data.data.name,
        code: data.data.code,
        price: data.data.price,
        categories: allCategories.value.filter(cat =>
            data.data.categories.some(selected => selected.id === cat.id)
        )
    });

    if (data.data.image_url) {
        previewImage.value = data.data.image_url;
    }

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

const handleSubmit = async () => {
    errors.value = {};

    const payload = new FormData();
    payload.append('name', form.name);
    payload.append('code', form.code);
    payload.append('price', form.price);
    if (!isEdit) {
        payload.append('stock', form.stock ?? 0);
    }
    form.categories.forEach((catId, index) => {
        payload.append(`categories[${index}]`, catId.id);
    });

    let i = 0;
    for (const [fieldId, value] of Object.entries(form.fields)) {
        payload.append(`fields[${i}][id]`, fieldId);
        const val = Array.isArray(value)
            ? JSON.stringify(value.map(label => ({ label, value: label.toLowerCase().replace(/\s+/g, '_') })))
            : value;
        payload.append(`fields[${i}][value]`, val);
        i++;
    }

    if (imageFile.value) {
        payload.append('image', imageFile.value);
    }

    try {
        if (isEdit) {
            await axios.post(`/api/products/${productId}?_method=PUT`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } else {
            await axios.post('/api/products', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        router.push('/admin/products');
    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {};
        } else {
            console.error('Unexpected error:', error);
        }
    }
};

const cancel = () => {
    router.push('/admin/products');
};

onMounted(async () => {
    await fetchFields();
    await fetchCategories();
    if (isEdit) await fetchProduct();
});

const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    imageFile.value = file;
    previewImage.value = URL.createObjectURL(file);
};
</script>

<style scoped>
.btn+.btn {
    margin-left: 0.5rem;
}
</style>
