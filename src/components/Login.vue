<template>
    <b-modal v-model="visible" title="Login" @hidden="$emit('close')" hide-footer centered>
        <b-row no-gutters>
            <form @submit.prevent="handleLogin" class="align-items-center w-100">
                <div class="mb-3">
                    <input v-model="email" type="email" class="form-control" placeholder="Email" />
                </div>
                <div class="mb-3">
                    <input v-model="password" type="password" class="form-control" placeholder="Password" />
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
                <button type="button" class="btn btn-link w-100 mt-2" @click="openRegister">
                    Don't have an account? Register
                </button>
            </form>
            <p v-if="errorMessage" class="text-danger mt-2">
                {{ errorMessage }}
            </p>
        </b-row>
    </b-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from './../stores/auth'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'register'])

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const visible = ref(props.show)

watch(() => props.show, (newVal) => {
    visible.value = newVal
})

watch(visible, (val) => {
    if (!val) emit('close')
})

const authStore = useAuthStore()

const handleLogin = async () => {
    try {
        await authStore.login(email.value, password.value)
        emit('close')
    } catch (e) {
        errorMessage.value = 'Invalid credentials'
    }
}

const openRegister = () => {
    emit('close')
    emit('register')
}
</script>
