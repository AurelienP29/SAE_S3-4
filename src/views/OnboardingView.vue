<template>
  <div class="auth-wrapper">
    <div class="auth-card onboarding-card fade-in">
      <div class="onboarding-header text-center mb-4">
        <h2>{{ lang('onboarding.title') }}</h2>
        <p class="text-muted">{{ lang('onboarding.subtitle') }}</p>
      </div>

      <form class="p-fluid" @submit.prevent="submitOnboarding">
        
        <div class="field mb-4">
          <label for="age" class="block mb-2">{{ lang('onboarding.age') }}</label>
          <Dropdown
            id="age"
            v-model="form.ageGroup"
            :options="ageOptions"
            :placeholder="lang('onboarding.select')"
            class="w-full"
          />
        </div>

        <div class="field mb-4">
          <label for="gender" class="block mb-2">{{ lang('onboarding.gender') }}</label>
          <Dropdown
            id="gender"
            v-model="form.gender"
            :options="genderOptions"
            :placeholder="lang('onboarding.select')"
            class="w-full"
          />
        </div>

        <div class="field mb-4">
          <label for="family" class="block mb-2">{{ lang('onboarding.family') }}</label>
          <Dropdown
            id="family"
            v-model="form.family"
            :options="familyOptions"
            :placeholder="lang('onboarding.select')"
            class="w-full"
          />
        </div>

        <div class="field mb-4">
          <label for="region" class="block mb-2">{{ lang('onboarding.region') }}</label>
          <Dropdown
            id="region"
            v-model="form.geographicRegion"
            :options="regionOptions"
            :placeholder="lang('onboarding.select')"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-3 mt-5">
          <Button type="submit" :label="lang('onboarding.submit')" icon="pi pi-check" severity="primary" :loading="saving" />
          <Button type="button" :label="lang('onboarding.skip')" icon="pi pi-forward" severity="secondary" text @click="skipOnboarding" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { translations } from '@/datasource/lang.js'
import { Dropdown, Button } from 'primevue'

const router = useRouter()
const authStore = useAuthStore()

const lang = (key) => translations[authStore.currentLanguage]?.[key] || key

const saving = ref(false)

const form = reactive({
  ageGroup: null,
  gender: null,
  family: null,
  geographicRegion: null
})

const ageOptions = ['< 18 ans', '18-25 ans', '26-35 ans', '36-45 ans', '46-60 ans', '+ 60 ans']
const genderOptions = ['Hommes', 'Femmes', 'Non-binaire']
const familyOptions = ['En famille', 'Seul(e) / Amis']
const regionOptions = ['Belfort (90)', 'Montbéliard (25)', 'Autres Franche-Comté', 'Alsace', 'Reste de la France', 'Suisse / Étranger']

async function submitOnboarding() {
  saving.value = true
  if (authStore.user && authStore.user.id) {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await fetch(`${API_URL}/users/${authStore.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ageGroup: form.ageGroup,
          gender: form.gender,
          family: form.family,
          geographicRegion: form.geographicRegion
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        authStore.updateUser(data.user || data)
      }
    } catch (e) {
      console.error(e)
    }
  }
  saving.value = false
  router.push('/')
}

function skipOnboarding() {
  router.push('/')
}
</script>

<style scoped src="@/assets/styles/LoginForm.css"></style>
<style scoped>
.onboarding-card {
  max-width: 500px;
  width: 100%;
}
.text-muted {
  color: var(--necro-text-muted);
  font-size: 0.9rem;
  margin-top: 5px;
}
</style>
