import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import BootstrapVue3 from 'bootstrap-vue-3'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(BootstrapVue3)
app.use(router)

const auth = useAuthStore()
auth.checkAuth()

app.mount('#app')
