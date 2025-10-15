import {createRouter, createWebHistory} from 'vue-router'

// const routes = [
//     {
//         path: '/',
//         name: '',
//         component: () => import('../views/')
//     }
//     ]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [],
    // routes: routes,
})

export default router
