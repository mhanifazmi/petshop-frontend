<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Category List</h2>
            <div>
                <input type="file" accept=".csv" @change="importCSV" class="form-control d-inline-block me-2"
                    style="width: auto;" />
                <router-link to="/admin/categories/create" class="btn btn-primary d-inline-flex align-items-center">
                    <i class="bi bi-plus-lg me-2"></i> Create Category
                </router-link>
            </div>
        </div>

        <table class="table table-bordered">
            <thead class="table-dark">
                <tr>
                    <th>Name</th>
                    <th style="width: 200px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="categories.length === 0">
                    <td colspan="3" class="text-center">No data found</td>
                </tr>
                <tr v-for="category in categories" :key="category.id">
                    <td>{{ category.name }}</td>
                    <td>
                        <router-link :to="`/admin/categories/${category.id}`" class="btn btn-sm btn-info me-1"
                            title="View">
                            <i class="bi bi-eye"></i>
                        </router-link>
                        <router-link :to="`/admin/categories/${category.id}/edit`" class="btn btn-sm btn-warning me-1"
                            title="Edit">
                            <i class="bi bi-pencil"></i>
                        </router-link>
                        <button @click="deleteCategory(category.id)" class="btn btn-sm btn-danger" title="Delete">
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
import Papa from 'papaparse'

const categories = ref([])

const fetchCategories = async () => {
    try {
        const response = await axios.get('/api/categories')
        categories.value = response.data.data
    } catch (error) {
        console.error('Error fetching categories:', error)
    }
}

const deleteCategory = async (categoryId) => {
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
            await axios.delete(`/api/categories/${categoryId}`);
            fetchCategories();
            Swal.fire(
                'Deleted!',
                'The category has been deleted.',
                'success'
            );
        } catch (error) {
            console.error('Error deleting category:', error);
            Swal.fire(
                'Error!',
                'There was an error deleting the category.',
                'error'
            );
        }
    }
}

const importCSV = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
            const parsedData = results.data

            // Optional: filter out invalid rows
            const validCategories = parsedData.filter(item => item.Name)

            try {
                await axios.post('/api/categories/import', { categories: validCategories })
                Swal.fire('Success', 'Categories imported successfully!', 'success')
                fetchCategories()
            } catch (err) {
                console.error(err)
                Swal.fire('Error', 'Failed to import categories.', 'error')
            }
        },
        error: (err) => {
            console.error('CSV Parse Error:', err)
            Swal.fire('Error', 'Invalid CSV file.', 'error')
        }
    })
}

onMounted(() => {
    fetchCategories();
})
</script>

<style scoped>
.btn+.btn {
    margin-left: 0.5rem;
}
</style>
