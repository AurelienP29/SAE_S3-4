<template>
  <div class="callback-container">
    <p>Authentification en cours...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  const token = route.query.token
  if (token) {
    try {
      // Stocker le token et récupérer les infos utilisateur
      // On peut appeler le backend pour avoir les infos complètes si besoin
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        authStore.login(data.user, token)
        router.push({ name: 'Home' })
      } else {
        router.push({ name: 'Login', query: { error: 'failed_to_fetch_profile' } })
      }
    } catch (error) {
      console.error('Callback error:', error)
      router.push({ name: 'Login', query: { error: 'callback_error' } })
    }
  } else {
    router.push({ name: 'Login', query: { error: 'no_token' } })
  }
})
</script>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
}
</style>
