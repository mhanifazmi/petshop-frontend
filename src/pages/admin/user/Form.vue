<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Create User</h2>
            <router-link to="/admin/users" class="btn btn-light">Back to List</router-link>
        </div>

        <div class="card">
            <div class="card-body">
                <form @submit.prevent="submitForm">
                    <div class="mb-3">
                        <label class="form-label">Username</label>
                        <input v-model="userForm.username" class="form-control" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input v-model="userForm.name" class="form-control" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Role</label>
                        <select v-model="userForm.role_id" class="form-control" required>
                            <option disabled value="">-- Select Role --</option>
                            <option v-for="role in allRoles" :key="role.id" :value="role.id">
                                {{ role.name }}
                            </option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Contact</label>
                        <input v-model="userForm.contact" class="form-control" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input v-model="userForm.email" type="email" class="form-control" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input v-model="userForm.password" type="password" class="form-control" required />
                    </div>

                    <div class="d-flex justify-content-end">
                        <button type="submit" class="btn btn-primary">Create</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/services/axios';

const router = useRouter();

const userForm = reactive({
    username: '',
    name: '',
    role_id: '',
    contact: '',
    email: '',
    password: ''
});

const allRoles = ref([]);

const fetchRoles = async () => {
    const { data } = await axios.get('/api/roles');
    allRoles.value = data.data || [];
};

const submitForm = async () => {
    try {
        await axios.post('/api/users', userForm);
        router.push('/admin/users');
    } catch (err) {
        console.error('Error creating user:', err);
        // show validation feedback if needed
    }
};

onMounted(fetchRoles);
</script>

<style scoped>
.btn + .btn {
    margin-left: 0.5rem;
}
</style>
