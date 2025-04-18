<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">User List</h2>
            <router-link to="/admin/users/create" class="btn btn-primary d-flex align-items-center">
                <i class="bi bi-plus-lg me-2"></i> Create User
            </router-link>
        </div>

        <table class="table table-bordered">
            <thead class="table-dark">
                <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th style="width: 200px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="users.length === 0">
                    <td colspan="6" class="text-center">No data found</td>
                </tr>
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.name }}</td>
                    <td>{{ user.username }}</td>
                    <td>{{ user.contact }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.role.name }}</td>
                    <td>
                        <router-link :to="`/admin/users/${user.id}`" class="btn btn-sm btn-info me-1"
                            title="View">
                            <i class="bi bi-eye"></i>
                        </router-link>
                        <router-link :to="`/admin/users/${user.id}/edit`" class="btn btn-sm btn-warning me-1"
                            title="Edit">
                            <i class="bi bi-pencil"></i>
                        </router-link>
                        <button @click="deleteUser(user.id)" class="btn btn-sm btn-danger" title="Delete">
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
import Swal from 'sweetalert2'  // Import SweetAlert2

const users = ref([])

// Fetch users from the API
const fetchCategories = async () => {
    try {
        const response = await axios.get('/api/users')
        users.value = response.data.data
    } catch (error) {
        console.error('Error fetching users:', error)
    }
}

// Delete user using SweetAlert2 for confirmation
const deleteUser = async (categoryId) => {
    // Show SweetAlert2 confirmation dialog
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
            // Send DELETE request to backend
            await axios.delete(`/api/users/${categoryId}`);
            // After successful deletion, re-fetch users to update the list
            fetchCategories();
            // Show success message
            Swal.fire(
                'Deleted!',
                'The user has been deleted.',
                'success'
            );
        } catch (error) {
            console.error('Error deleting user:', error);
            // Show error message
            Swal.fire(
                'Error!',
                'There was an error deleting the user.',
                'error'
            );
        }
    }
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
