import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PrestataireView from '@/views/PrestataireView.vue'
import LoginView from '@/views/LoginView.vue'
import ActivitiesView from '@/views/ActivitiesView.vue'
import AccountView from '@/views/AccountView.vue'
import ContactUs from "@/views/ContactUs.vue";

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
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/activities', name: 'Activities', component: ActivitiesView },
    { path: '/account', name: 'Account', component: AccountView },
    {path: '/contact-us' , name: 'Contact' , component: ContactUs}
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

export default router
