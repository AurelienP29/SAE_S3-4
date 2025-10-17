import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null) // { id, name, role: 'organisateur' | 'prestataire' | null }
  const isAuthenticated = computed(() => user.value !== null)
  const userRole = computed(() => user.value?.role || null)
  const currentLanguage = ref('fr')

  function login(userData) {
    user.value = userData
  }

  function logout() {
    user.value = null
  }

  function setLanguage(lang) {
    currentLanguage.value = lang
  }

  return { 
    user, 
    isAuthenticated, 
    userRole,
    currentLanguage,
    login, 
    logout,
    setLanguage
  }
})
