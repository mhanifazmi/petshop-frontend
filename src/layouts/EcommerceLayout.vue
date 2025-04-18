<template>
    <div>
        <b-navbar variant="light" type="light">
            <b-container>
                <!-- Flex container: Brand on left, collapse on right -->
                <div class="d-flex w-100 align-items-center justify-content-between flex-wrap">
                    <b-navbar-brand to="/">🐾 Pet Shop</b-navbar-brand>

                    <!-- Right: Toggler -->
                    <b-navbar-toggle target="nav_collapse" />
                    <div>
                        <b-collapse id="nav_collapse" is-nav>
                            <b-navbar-nav class="d-flex justify-content-between align-items-center">
                                <!-- Left Nav Items -->
                                <div class="d-flex">
                                    <b-nav-item @click="handleCartClick"><i class="bi bi-cart"></i></b-nav-item>
                                </div>

                                <!-- Right Dropdown -->
                                <b-nav-item-dropdown class="ms-3" :text="user.name" right v-if="authStore.isAuthenticated">
                                    <b-dropdown-item @click="handleLogoutClick">Sign Out</b-dropdown-item>
                                </b-nav-item-dropdown>
                            </b-navbar-nav>
                        </b-collapse>
                    </div>
                </div>
            </b-container>
        </b-navbar>
        <b-container class="my-4">
            <router-view />
            <LoginModal :show="showLoginModal" @close="showLoginModal = false"
                @register="() => { showLoginModal = false; showRegisterModal = true }" />
            <RegisterModal :show="showRegisterModal" @close="showRegisterModal = false" />
        </b-container>
    </div>
</template>

<script setup>
import { ref, provide, onMounted, onBeforeUnmount } from 'vue'
import LoginModal from '../components/Login.vue'
import RegisterModal from '../components/Register.vue'
import { useAuthStore } from './../stores/auth'
import auth from './../services/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const user = auth.getUser();
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const router = useRouter();
authStore.checkAuth();
provide('showLoginModal', showLoginModal)

const handleShowLoginModal = () => {
    showLoginModal.value = true
}

onMounted(() => {
    window.addEventListener('show-login-modal', handleShowLoginModal)
})

onBeforeUnmount(() => {
    window.removeEventListener('show-login-modal', handleShowLoginModal)
})

const handleCartClick = () => {
    if (!authStore.isAuthenticated) {
        showLoginModal.value = true
    } else {
        window.location.href = '/cart'
    }
}

const handleLogoutClick = async () => {
    await authStore.logout()
    router.push('/') // or wherever you want after logout
}
</script>