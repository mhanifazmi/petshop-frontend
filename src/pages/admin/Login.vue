<template>
    <b-container class="d-flex justify-content-center align-items-center min-vh-100">
        <b-card class="" style="width: 100%; max-width: 400px">
            <h4 class="mb-4 text-center">Admin Login</h4>

            <form @submit.prevent="handleLogin">
                <b-form-group label="Email" label-for="email">
                    <b-form-input id="email" v-model="email" type="email" placeholder="Enter email" required />
                </b-form-group>

                <b-form-group label="Password" label-for="password">
                    <b-form-input id="password" v-model="password" type="password" placeholder="Enter password"
                        required />
                </b-form-group>

                <b-button class="w-100" type="submit" variant="primary" block>Login</b-button>

                <b-alert v-if="errorMessage" variant="danger" show class="mt-3">
                    {{ errorMessage }}
                </b-alert>
            </form>
        </b-card>
    </b-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './../../stores/auth'
import { ROLE_SUPERADMIN } from '@/constants'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
    errorMessage.value = ''
    try {
        await authStore.login(email.value, password.value, true)
        if (authStore.user?.role_id == ROLE_SUPERADMIN) {
            router.push('/admin/dashboard')
        } else {
            router.push('/')
        }
    } catch (e) {
        errorMessage.value = 'Invalid email or password'
    }
}
</script>