<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Field List</h2>
            <router-link to="/admin/fields/${product.id}/stock/create" class="btn btn-primary d-flex align-items-center">
                <i class="bi bi-plus-lg me-2"></i> Create Field
            </router-link>
        </div>

        <table class="table table-bordered">
            <thead class="table-dark">
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Options</th>
                    <th style="width: 200px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="fields.length === 0">
                    <td colspan="3" class="text-center">No data found</td>
                </tr>
                <tr v-for="field in fields" :key="field.id">
                    <td>{{ field.name }}</td>
                    <td>{{ field.type }}</td>
                    <td>
                        <span v-if="['select', 'checkbox', 'radio'].includes(field.type)">
                            {{
                                (() => {
                                    try {
                                        const parsed = JSON.parse(field.value);
                                        return Array.isArray(parsed)
                                            ? parsed.map(opt => opt.label).join(', ')
                                            : '-';
                                    } catch (e) {
                            return '-';
                            }
                            })()
                            }}
                        </span>
                        <span v-else>-</span>
                    </td>
                    <td>
                        <router-link :to="`/admin/fields/${field.id}`" class="btn btn-sm btn-info me-1" title="View">
                            <i class="bi bi-eye"></i>
                        </router-link>
                        <router-link :to="`/admin/fields/${field.id}/edit`" class="btn btn-sm btn-warning me-1"
                            title="Edit">
                            <i class="bi bi-pencil"></i>
                        </router-link>
                        <button @click="deleteField(field.id)" class="btn btn-sm btn-danger" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/services/axios'
import Swal from 'sweetalert2'

const fields = ref([])

const fetchFields = async () => {
    try {
        const response = await axios.get('/api/fields')
        fields.value = response.data.data
    } catch (error) {
        console.error('Error fetching fields:', error)
    }
}

const deleteField = async (fieldId) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        try {
            await axios.delete(`/api/fields/${fieldId}`);
            fetchFields(); // Fetch fields again after deletion
            Swal.fire(
                'Deleted!',
                'The field has been deleted.',
                'success'
            );
        } catch (error) {
            console.error('Error deleting field:', error);
            Swal.fire(
                'Error!',
                'There was an error deleting the field.',
                'error'
            );
        }
    }
}

onMounted(() => {
    fetchFields();
})
</script>

<style scoped>
.btn+.btn {
    margin-left: 0.5rem;
}
</style>
