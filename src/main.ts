import { createApp } from 'vue'
import { inject } from '@vercel/analytics'
import './style.css'
import App from './App.vue'

inject({ mode: 'auto' });

const app = createApp(App)
app.mount('#app')