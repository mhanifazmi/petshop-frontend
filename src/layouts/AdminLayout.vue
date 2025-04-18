<template>
    <div class="d-flex min-vh-100">
        <!-- Sidebar -->
        <aside class="bg-dark text-white p-3" style="width: 250px;">
            <h5 class="mb-4">Admin Panel</h5>
            <ul class="nav flex-column">
                <li class="nav-item">
                    <router-link to="/admin/dashboard" class="nav-link text-white">Dashboard</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/products" class="nav-link text-white">Products</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/categories" class="nav-link text-white">Categories</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/users" class="nav-link text-white">Users</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/fields" class="nav-link text-white">Fields</router-link>
                </li>
            </ul>
        </aside>

        <!-- Main Content -->
        <div class="flex-grow-1 d-flex flex-column">
            <!-- Topbar -->
            <header class="navbar navbar-light bg-light justify-content-end px-4">
                <div class="dropdown">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Admin
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <a class="dropdown-item" href="#" @click="handleLogoutClick">Logout</a>
                        </li>
                    </ul>
                </div>
            </header>

            <!-- Page Content -->
            <main class="p-4 bg-light flex-grow-1">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from './../stores/auth'
import { useRouter } from 'vue-router'
const authStore = useAuthStore()
const router = useRouter();

const handleLogoutClick = async () => {
    await authStore.logout()
    router.push('/') // or wherever you want after logout
}
</script>

<style scoped>
.nav-link.router-link-exact-active {
    background-color: rgba(255, 255, 255, 0.1);
    font-weight: bold;
}
</style>