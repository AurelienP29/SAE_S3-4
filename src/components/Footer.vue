<template>
  <div id="footer">
    <!-- Button -->
    <Button :label="t('registerAsProvider')" icon="pi pi-user-plus" @click="openModal()" severity="secondary"
            style="min-width: 10rem" />

    <!-- Modal -->
    <Dialog v-model:visible="visible" :header="t('registerAsProvider')" :style="{ width: '25rem' }"
            position="bottom" :modal="true" :draggable="false">
      <div id="button-container">
        <Button type="button" :label="t('cancel')" severity="secondary" @click="visible = false"></Button>
        <Button type="button" :label="t('send')" @click="registerProvider()"></Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const authStore = useAuthStore()
const visible = ref(false)

// Simple translation function
const translations = {
  fr: {
    registerAsProvider: 'S\'inscrire comme prestataire',
    cancel: 'Annuler',
    send: 'Envoyer'
  },
  en: {
    registerAsProvider: 'Register as Provider',
    cancel: 'Cancel',
    send: 'Send'
  }
}

const t = (key) => {
  return translations[authStore.currentLanguage]?.[key] || translations.fr[key]
}

function openModal() {
  visible.value = true
}

function registerProvider() {
  console.log('Registering provider...')
  visible.value = false
}
</script>

<style scoped>
#footer {
  background-color: #818181;
  width: 100%;
  height: 30vh;
}

label {
  width: calc(0.25rem*24);
  font-weight: 600;
}

#provider-name {
  flex: auto;
}

#button-container {
  display: flex;
  justify-content: flex-end;
  gap: calc(0.25rem*2);
}

.input-text-container {
  display: flex;
  align-items: center;
  margin-bottom: calc(0.25rem * 4);
  gap: calc(0.25rem * 4);
}
</style>