<template>
    <b-modal v-model="visible" title="Register" @hidden="$emit('close')" hide-footer centered>
        <b-row no-gutters>
            <form @submit.prevent="handleRegister" class="w-100">
                <div class="mb-2">
                    <input v-model="username" type="text" class="form-control" placeholder="Username" required />
                </div>
                <div class="mb-2">
                    <input v-model="name" type="text" class="form-control" placeholder="Full Name" required />
                </div>
                <div class="mb-2">
                    <input v-model="contact" type="text" class="form-control" placeholder="Contact (Optional)" />
                </div>
                <div class="mb-2">
                    <input v-model="email" type="email" class="form-control" placeholder="Email" required />
                </div>
                <div class="mb-2">
                    <input v-model="password" type="password" class="form-control" placeholder="Password" required />
                </div>
                <div class="mb-3">
                    <input v-model="password_confirmation" type="password" class="form-control"
                        placeholder="Confirm Password" required />
                </div>
                <button type="submit" class="btn btn-primary w-100">Register</button>
                <button type="button" class="btn btn-link w-100 mt-2" @click="openLogin">
                    Already have an account? Login
                </button>
            </form>
            <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
        </b-row>
    </b-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from '@/services/axios'
import { useAuthStore } from './../stores/auth'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'login'])

const visible = ref(props.show)
watch(() => props.show, (newVal) => (visible.value = newVal))
watch(visible, (val) => { if (!val) emit('close') })
const authStore = useAuthStore()

const username = ref('')
const name = ref('')
const contact = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const errorMessage = ref('')

const handleRegister = async () => {
    errorMessage.value = ''
    try {
        const response = await axios.post('/api/register', {
            username: username.value,
            name: name.value,
            contact: contact.value,
            email: email.value,
            password: password.value,
            password_confirmation: password_confirmation.value,
        })
        if (response.data.status === 200) {
            await authStore.login(email.value, password.value)
            emit('close')
        }
    } catch (err) {
        errorMessage.value = err.response?.data?.message || 'Registration failed.'
    }
}

const openLogin = () => {
    emit('close')
    emit('login')
}
</script>