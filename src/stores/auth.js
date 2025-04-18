// stores/authStore.js
import { defineStore } from 'pinia'
import auth from '../services/auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isAuthenticated: false
    }),

    actions: {
        async login(email, password, isAdmin = false) {
            const user = await auth.login(email, password, isAdmin)
            this.user = user
            this.isAuthenticated = true
        },

        async logout() {
            await auth.logout()
            this.user = null
            this.isAuthenticated = false
            localStorage.removeItem('cart')
        },

        checkAuth() {
            const user = auth.getUser()
            if (user) {
                this.user = user
                this.isAuthenticated = true
            } else {
                this.user = null
                this.isAuthenticated = false
            }
        }
    }
})
