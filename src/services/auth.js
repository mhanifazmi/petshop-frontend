// services/auth.js
import axios from './axios'

export default {
    async getCsrfToken() {
        await axios.get('/sanctum/csrf-cookie')
    },

    async login(email, password) {
        await this.getCsrfToken()
        const res = await axios.post('/api/login', { email, password })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        return res.data.user
    },

    async logout() {
        await this.getCsrfToken()
        await axios.post('/api/logout')
        localStorage.removeItem('user')
    },

    isAuthenticated() {
        return !!localStorage.getItem('user')
    },

    getUser() {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    }
}
