<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Edit Field</h2>
            <router-link to="/admin/fields" class="btn btn-light">
                Back to List
            </router-link>
        </div>

        <div class="card">
            <div class="card-body">
                <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input v-model="form.name" class="form-control" :class="{ 'is-invalid': errors.name }" />
                        <div class="invalid-feedback" v-if="errors.name">
                            {{ errors.name[0] }}
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Type</label>
                        <select v-model="form.type" class="form-select" :class="{ 'is-invalid': errors.type }">
                            <option disabled value="">Select Field Type</option>
                            <option value="text">Text</option>
                            <option value="textarea">Textarea</option>
                            <option value="select">Select</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="radio">Radio</option>
                        </select>
                        <div class="invalid-feedback" v-if="errors.type">
                            {{ errors.type[0] }}
                        </div>
                    </div>

                    <div v-if="['select', 'checkbox', 'radio'].includes(form.type)" class="mb-3">
                        <label class="form-label">Options (Comma-separated)</label>
                        <input v-model="form.value" class="form-control" placeholder="Option1, Option2, Option3" />
                        <div class="invalid-feedback" v-if="errors.value">
                            {{ errors.value[0] }}
                        </div>
                    </div>

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

const route = useRoute();
const router = useRouter();
const fieldId = route.params.id;

const form = reactive({
    name: '',
    type: '',
    value: ''
});

const errors = ref({});

const fetchField = async () => {
    try {
        const { data } = await axios.get(`/api/fields/${fieldId}`);

        form.name = data.data.name;
        form.type = data.data.type;

        if (['select', 'checkbox', 'radio'].includes(data.data.type)) {
            try {
                const parsed = JSON.parse(data.data.value || '[]');
                form.value = parsed.map(opt => opt.label).join(', ');
            } catch (e) {
                form.value = '';
            }
        } else {
            form.value = '';
        }
    } catch (error) {
        console.error('Error fetching field:', error);
    }
};

const handleSubmit = async () => {
    errors.value = {};

    try {
        const submitData = { ...form };

        if (['select', 'checkbox', 'radio'].includes(form.type)) {
            const options = form.value.split(',').map(option => ({
                label: option.trim(),
                value: option.trim().toLowerCase().replace(/\s+/g, '_')
            }));
            submitData.value = JSON.stringify(options);
        } else {
            submitData.value = null;
        }

        await axios.put(`/api/fields/${fieldId}`, submitData);
        router.push('/admin/fields');
    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {};
        } else {
            console.error('Unexpected error:', error);
        }
    }
};

const cancel = () => {
    router.push('/admin/fields');
};

onMounted(() => {
    fetchField();
});
</script>

<style scoped>
.btn+.btn {
    margin-left: 0.5rem;
}
</style>
