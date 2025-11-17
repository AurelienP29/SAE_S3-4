import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PrestataireView from '@/views/PrestataireView.vue'

// const routes = [
//     {
//         path: '/',
//         name: '',
//         component: () => import('../views/')
//     }
//     ]

const routes = [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/prestataire', name: 'PrestataireView', component: PrestataireView },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

export default router
