import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: '',
        component: () => import('../views/')
    },
    {
        path: '/',
        name: '',
        component: () => import('../views/')
    }
    ]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
    // routes: routes,
})

export default router
