<template>
  <div :class="['navbar-container', { 'navbar-container--scrolled': isScrolled }]">
    <Menubar :model="menuItems" class="custom-menubar">
      <template #start>
        <div class="navbar-brand" @click="goTo('Home')">
          <span class="logo"><img src="/public/images/N-con-Logo-image.png" style="height: 75px; width: auto" alt="Logo"></span>
        </div>
      </template>

      <template #item="{ item, props, hasSubmenu }">
        <a v-ripple class="flex align-items-center" v-bind="props.action">
          <!-- TODO PrimeVue Component: ripple effect on buttons -->
          <span :class="item.icon"/>
          <span class="ml-2">{{ item.label }}</span>
          <Badge v-if="item.badge" :value="item.badge" class="ml-2" severity="danger"/>
          <span v-if="hasSubmenu" class="pi pi-angle-down ml-2"/>
        </a>
      </template>

      <template #end>
        <div class="navbar-actions">

          <Dropdown v-model="authStore.currentLanguage" :options="languageOptions" optionLabel="label"
                    optionValue="value" placeholder="Langue" class="language-dropdown">
            <template #value="props">
              <div v-if="props.value" class="flex align-items-center">
                <i :class="props.value === 'fr' ? 'pi pi-flag' : 'pi pi-flag-fill'" class="mr-2"></i>
                <span> {{ props.value.toUpperCase() }}</span>
              </div>
            </template>

            <template #option="props">
              <div class="flex align-items-center">
                <i :class="props.option.icon" class="mr-2"></i>
                <span>{{ props.option.label }}</span>
              </div>
            </template>
          </Dropdown>

          <Button
              v-if="!authStore.isAuthenticated"
              icon="pi pi-sign-in"
              :label="lang('login')"
              @click="goTo('Login')"
              severity="primary"
              class="login-button"
              raised
          />
          <SplitButton
              v-else
              :label="authStore.user?.name || lang('logout')"
              icon="pi pi-user"
              @click="handleLogout"
              :model="userMenuItems"
              severity="secondary"
              outlined
              class="user-menu"
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/authStore.js'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import SplitButton from 'primevue/splitbutton'
import Dropdown from 'primevue/dropdown'
import Badge from 'primevue/badge'
import Ripple from 'primevue/ripple'

import '/src/assets/styles/NavBar.css'
// import PrestataireView from "@/views/PrestataireView.vue";

const router = useRouter()
const authStore = useAuthStore()

// Helper: supports both a single `userRole` and a multi-role `user.roles` array
const hasRole = (roleTarget) => {
  const userRoles = authStore.user?.roles || []
  const singleRole = authStore.user?.role

  // Admin = accès a tout
  if (roleTarget === 'organisateur' && singleRole === 'organisateur') return true

  return userRoles.includes(roleTarget) || singleRole === roleTarget
}

const notificationCount = ref(0)

function goTo(routeName) {
  router.push({ name: routeName })
}

const userMenuItems = computed(() => [
  {
    label: lang('profile'),
    icon: 'pi pi-user',
    command: () => goTo('Account')
  },
  {
    label: lang('settings'),
    icon: 'pi pi-cog',
    command: () => goTo('Settings')
  },
  {
    separator: true
  },
  {
    label: lang('logout'),
    icon: 'pi pi-sign-out',
    command: handleLogout
  }
])

// Main menu items
const menuItems = computed(() => {
  const items = [
    {
      label: lang('home'),
      icon: 'pi pi-home',
      command: () => goTo('Home')
    },
    {
      label: lang('activities'),
      icon: 'pi pi-calendar-times',
      command: () => goTo('Activities')
    }
  ]

  if (hasRole('organisateur')) {
    items.push({
      label: lang('organisateur.space'),
      icon: 'pi pi-calendar',
      items: [
        {
          label: lang('organisateur.events'),
          icon: 'pi pi-list',
          command: () => goTo('OrganisateurEvents')
        },
        {
          label: lang('organisateur.create'),
          icon: 'pi pi-plus',
          command: () => goTo('OrganisateurCreateEvent')
        }
      ]
    })
  }

  if (hasRole('prestataire')) {
    items.push({
      label: lang('prestataire.space'),
      icon: 'pi pi-briefcase',
      items: [
        {
          label: lang('prestataire.services'),
          icon: 'pi pi-box',
          command: () => goTo('PrestataireView')
        },
        {
          label: lang('prestataire.bookings'),
          icon: 'pi pi-calendar-plus',
          command: () => goTo('PrestataireBookings')
        }
      ]
    })
  }

  if (authStore.isAuthenticated) {
    items.push({
      label: lang('notifications'),
      icon: 'pi pi-bell',
      badge: notificationCount.value > 0 ? notificationCount.value.toString() : null,
      command: () => goTo('Notifications')
    })
  }

  // À propos
  items.push({
    label: lang('about'),
    icon: 'pi pi-info-circle',
    command: () => goTo('About')
  })

  items.push({
    label: lang('contact'),
    icon: 'pi pi-envelope',
    command: () => goTo('Contact')
  })

  return items
})

const lang = (key) => {
  return translations[authStore.currentLanguage][key] || key
}

// Language options
const languageOptions = [
  {label: ' Français', value: 'fr', icon: 'pi pi-flag'},
  {label: ' English', value: 'en', icon: 'pi pi-flag-fill'}
]

const translations = {
  fr: {
    home: 'Accueil',
    activities : 'Activités & Réservations',
    'organisateur.space': 'Espace Organisateur',
    'organisateur.events': 'Mes Événements',
    'organisateur.create': 'Créer un Événement',
    'prestataire.space': 'Espace Prestataire',
    'prestataire.services': 'Mes Services',
    'prestataire.bookings': 'Mes Réservations',
    'myAccount': 'Mon Compte',
    'notifications': 'Notifications',
    'about': 'À Propos',
    'login': 'Connexion',
    'logout': 'Déconnexion',
    'profile': 'Mon Profil',
    'settings': 'Paramètres',
    'contact': 'Contactez nous',
  },
  en: {
    home: 'Home',
    activities : 'Activities & Booking',
    'organisateur.space': 'Organizer Space',
    'organisateur.events': 'My Events',
    'organisateur.create': 'Create Event',
    'prestataire.space': 'Provider Space',
    'prestataire.services': 'My Services',
    'prestataire.bookings': 'My Bookings',
    'myAccount': 'My Account',
    'notifications': 'Notifications',
    'about': 'About',
    'login': 'Login',
    'logout': 'Logout',
    'profile': 'My Profile',
    'settings': 'Settings',
    'contact': 'Contact Us',
  }
}

function handleLogout() {
  authStore.logout()
  goTo('Home')
}


const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, {passive: true})
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped></style>
