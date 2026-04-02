<template>
  <div :class="['navbar-container', { 'navbar-container--scrolled': isScrolled }]">
    <Menubar :model="menuItems" class="custom-menubar">
      <template #start>
        <div class="navbar-brand" @click="goTo('Home')">
          <span class="logo"><img src="/public/images/N-con-Logo-image.png" style="height: 75px; width: auto"
                                  alt="Logo"></span>
        </div>
      </template>

      <template #item="{ item, props, hasSubmenu }">
        <template v-if="item.id === 'mobile-actions'">
          <div class="mobile-actions-container flex flex-column gap-3 p-3 w-full">
            <ProviderRequestForm
                buttonIcon="pi pi-user-plus"
                :buttonRounded="true"
                :buttonLabel="lang('nav.provideService')"
                buttonClass="provider-request-trigger w-full"
            />

            <!-- Cart -->
            <router-link to="/cart" class="cart-container-mobile flex align-items-center text-white no-underline p-2">
              <i class="pi pi-shopping-cart mr-2" style="font-size: 1.2rem;"></i>
              <span class="font-semibold">{{ lang('cart') || 'Panier' }}</span>
              <Badge v-if="cartStore.itemsCount > 0" :value="cartStore.itemsCount" class="ml-auto" />
            </router-link>

            <!-- Language -->
            <Dropdown v-model="authStore.currentLanguage" :options="languageOptions" optionLabel="label"
                      optionValue="value" placeholder="Langue" class="language-dropdown w-full">
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

            <!-- Login / User -->
            <Button
                v-if="!authStore.isAuthenticated"
                icon="pi pi-sign-in"
                :label="lang('login')"
                @click="goTo('Login')"
                severity="primary"
                class="login-button w-full mt-2"
                raised
            />
            <template v-else>
              <div class="user-mobile-info flex align-items-center my-2 p-2 border-round" style="background: rgba(255,255,255,0.1);">
                <Avatar v-if="authStore.user" :image="authStore.user?.picture" :label="!authStore.user?.picture ? authStore.user?.name?.charAt(0).toUpperCase() : null" shape="circle" class="mr-2 border-1 border-purple-500" />
                <span class="text-white font-bold text-lg">{{ authStore.user?.name }}</span>
              </div>
              <Button
                  :label="lang('Profile & Settings') || 'Profil et Paramètres'"
                  icon="pi pi-user"
                  @click="goTo('Account')"
                  severity="secondary"
                  class="w-full"
                  outlined
              />
              <Button
                  :label="lang('logout')"
                  icon="pi pi-sign-out"
                  @click="handleLogout"
                  severity="danger"
                  class="w-full mt-2"
                  outlined
              />
            </template>
          </div>
        </template>
        <template v-else>
          <a v-ripple class="flex align-items-center" v-bind="props.action">
            <span :class="item.icon"/>
            <span class="ml-2">{{ item.label }}</span>
            <Badge v-if="item.badge" :value="item.badge" class="ml-2" severity="danger"/>
            <span v-if="hasSubmenu" class="pi pi-angle-down ml-2"/>
          </a>
        </template>
      </template>

      <template #end>
        <div class="navbar-actions desktop-only">

          <ProviderRequestForm
              buttonIcon="pi pi-user-plus"
              :buttonRounded="true"
              :buttonLabel="lang('nav.provideService')"
              buttonClass="provider-request-trigger"
          />

          <router-link to="/cart" class="cart-container">
            <i class="pi pi-shopping-cart" style="font-size: 1.2rem;"></i>
            <span v-if="cartStore.itemsCount > 0" class="cart-badge">
            {{ cartStore.itemsCount }}
          </span>
          </router-link>

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
          <template v-else>
            <SplitButton
                :label="authStore.user? authStore.user.name : lang('logout')"
                @click="handleLogout"
                :model="userMenuItems"
                severity="secondary"
                outlined
                class="user-menu"
            >
              <template #icon>
                <Avatar
                    v-if="authStore.user"
                    :image="authStore.user?.picture"
                    :label="!authStore.user?.picture ? authStore.user?.name?.charAt(0).toUpperCase() : null"
                    @click="goTo('Account')"
                    shape="circle"
                    class="mr-2 border-1 border-purple-500"
                />
              </template>
            </SplitButton>
          </template>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/authStore.js'
import { Menubar, Button, SplitButton, Dropdown, Badge, Avatar } from 'primevue'
import Ripple from 'primevue/ripple'

import '/src/assets/styles/NavBar.css'
import { translations } from '@/datasource/lang.js'
import {useCartStore} from "@/stores/cartStore.js";
import ProviderRequestForm from '@/components/ProviderRequestForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const hasRole = (roleTarget) => {
  const userRoles = authStore.user?.roles || []
  const singleRole = authStore.user?.role

  if (singleRole === 'admin' || userRoles.includes('admin')) {
      if (roleTarget === 'organisateur' || roleTarget === 'admin') {
          return true
      }
  }

  return userRoles.includes(roleTarget) || singleRole === roleTarget
}

const notificationCount = ref(0)

function goTo(routeName) {
  router.push({name: routeName})
}

const userMenuItems = computed(() => [
  {
    label: lang('Profile & Settings'),
    icon: 'pi pi-user',
    command: () => goTo('Account')
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
    },
    {
      label: lang('contact'),
      icon: 'pi pi-envelope',
      command: () => goTo('Contact')
    }
  ]

  if (hasRole('organisateur')) {
    items.push({
      label: lang('organisateur.space'),
      icon: 'pi pi-calendar',
      items: [
        {
          label: lang('organistaeur.manager'),
          icon: 'pi pi-list',
          command: () => goTo('OrganisateurEvents')
        },
        {
          label: lang('organisateur.create'),
          icon: 'pi pi-plus',
          command: () => goTo('OrganisateurCreateEvent')
        },
        {
          label: lang('admin.settings.title') || 'Paramètres du site',
          icon: 'pi pi-cog',
          command: () => router.push({ name: 'OrganisateurEvents', query: { section: 'settings' } })
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
        }
      ]
    })
  }

  // About
  items.push({
    label: lang('about'),
    icon: 'pi pi-info-circle',
    command: () => goTo('About')
  })

  if (authStore.isAuthenticated) {
    items.push({
      icon: 'pi pi-bell',
      badge: notificationCount.value > 0 ? notificationCount.value.toString() : null,
      command: () => goTo('Notifications')
    })
  }

  if (windowWidth.value <= 960) {
    items.push({
      id: 'mobile-actions',
      class: 'mobile-only-item'
    });
  }

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

function handleLogout() {
  authStore.logout()
  goTo('Home')
}


const isScrolled = ref(false)
const windowWidth = ref(window.innerWidth)

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

function handleResize() {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, {passive: true})
  window.addEventListener('resize', handleResize, {passive: true})
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>

</style>
