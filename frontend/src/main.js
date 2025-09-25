// # 应用入口 - Vue应用初始化

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import '@/assets/styles/base.css'

const routes = [
    { path: '/', component: Home }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

createApp(App).use(router).mount('#app')