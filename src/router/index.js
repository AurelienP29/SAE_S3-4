import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import PrestataireView from '@/views/PrestataireView.vue'
import ActivitiesView from '@/views/ActivitiesView.vue'
import AccountView from '@/views/AccountView.vue'
import ContactUs from "@/views/ContactUs.vue"
import AdminView from "@/views/AdminView.vue"
import AdminMapView from "@/views/AdminMapView.vue";
import CartView from "@/views/Billeterie/CartView.vue";
import SuccessView from "@/views/Billeterie/SuccessView.vue";
import PrestationView from "@/views/PrestationView.vue";


// const routes = [
//     {
//         path: '/',
//         name: '',
//         component: () => import('../views/')
//     }
//     ]

const routes = [
    {path: '/', name: 'Home', component: HomeView},
    {path: '/prestatairedashboard', name: 'PrestataireView', component: PrestataireView},
    {path: '/prestataire/:id', name: 'PrestatairePublic', component: () => import('@/views/PrestatairePublicView.vue')},
    {path: '/login', name: 'Login', component: LoginView},
    {path: '/register', name: 'Register', component: RegisterView},

    {path: '/activities', name: 'Activities', component: ActivitiesView},
    {path: '/account', name: 'Account', component: AccountView},
    {path: '/contact-us', name: 'Contact', component: ContactUs},
    {path: '/admin/prestataires', name: 'OrganisateurEvents', component: AdminView},
    {path: '/admin/map', name: 'OrganisateurMap', component: AdminMapView},
    {path: '/cart', name: 'Cart', component: CartView},
    {path: '/checkout', name: 'Checkout', component: () => import('@/views/Billeterie/CheckOutView.vue')},
    {path: '/order-success', name: 'success', component: SuccessView},
    {path: '/prestation/:id', name: 'PrestationDetail', component: PrestationView}
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

export default router
