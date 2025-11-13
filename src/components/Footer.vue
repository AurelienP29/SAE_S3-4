<template>
  <div id="footer">
    <!-- Button -->
    <Button :label="t('registerAsProvider')" icon="pi pi-user-plus" @click="openModal()" severity="secondary"
            style="min-width: 10rem"/>

    <!-- Modal -->
    <Dialog v-model:visible="visible" :header="t('registerAsProvider')" :style="{ width: '250rem' }"
            position="bottom" :modal="true" :draggable="false">er...')
      <p>
        <Label for="provider-name" :required="true">{{ t('providerName') }}</Label> <input type="text"
                                                                                           id="provider-name"/>
      </p>
      <p>
        <label for="shop-name" :required="true">{{ t('shopName') }}</label> <input type="text" id="shop-name"/>
      </p>
      <div class="input-text-container">
        <label for="phone">{{ t('phone') }}</label> <input type="text" id="phone" required/>
        <label for="email">{{ t('email') }}</label> <input type="text" id="email" required/>
        <label for="website">{{ t('website') }}</label> <input type="text" id="website"/>
      </div>
      <div class="checkBoxes-container">
        <label for="days" :required="true">{{ t('daysOfPresence') }}</label>
        <p>
          <input type="checkbox" id="days" value="day1"/> <label for="day1">{{ t('day1') }}</label>
          <input type="checkbox" id="days" value="day2"/> <label for="day2">{{ t('day2') }}</label>
          <input type="checkbox" id="days" value="day3"/> <label for="day3">{{ t('day3') }}</label>
        </p>
      </div>
      <div class="radio-buttons-container">
        <label for="typeOfShop">{{ t('typeOfShop') }}</label>
        <p>
          <input type="radio" id="typeOfShop" name="typeOfShop" value="shop1"/> <label for="shop1">{{t('shop1') }}</label>
          <input type="radio" id="typeOfShop" name="typeOfShop" value="shop2"/> <label for="shop2">{{t('shop2')}}</label>
          <input type="radio" id="typeOfShop" name="typeOfShop" value="shop3"/> <label for="shop3">{{t('shop3')}}</label>
        </p>
      </div>
      <div class="checkBoxes-container">
        <span> {{ t('proposedServices') }}</span>
        <p>
          <input type="checkbox" id="services" value="service1"/> <label for="service1">{{ t('service1') }}</label>
          <input type="checkbox" id="services" value="service2"/> <label for="service2">{{ t('service2') }}</label>
          <input type="checkbox" id="services" value="service3"/> <label for="service3">{{ t('service3') }}</label>
        </p>
      </div>
      <div id="button-container">
        <Button type="button" :label="t('cancel')" severity="secondary" @click="visible = false"></Button>
        <Button type="button" :label="t('send')" @click="registerProvider()"></Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useAuthStore} from '@/stores/authStore.js'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const authStore = useAuthStore()
const visible = ref(false)

// Simple translation function
const translations = {
  fr: {
    registerAsProvider: 'S\'inscrire comme prestataire',
    providerName: 'Nom du prestataire',
    shopName: 'Nom de la boutique',
    phone : 'Numéro de téléphone',
    email: 'Adresse email',
    website: 'Site web ou réseau social',
    daysOfPresence: 'Jours de présence',
    day1: 'Vendredi',
    day2: 'Samedi',
    day3: 'Dimanche',
    typeOfShop: 'Type de boutique',
    shop1: 'Boutique 1',
    shop2: 'Boutique 2',
    shop3: 'Boutique 3',
    proposedServices: "Quels services proposez-vous ?",
    service1: 'Service 1',
    service2: 'Service 2',
    service3: 'Service 3',
    cancel: 'Annuler',
    send: 'Envoyer'
  },
  en: {
    registerAsProvider: 'Register as Provider',
    providerName: 'Provider Name',
    shopName: 'Shop Name',
    phone : 'Phone number',
    email : 'Email address',
    website: 'Website or social network',
    daysOfPresence: 'Days of Presence',
    day1: 'Friday',
    day2: 'Saturday',
    day3: 'Sunday',
    typeOfShop: 'Type of Shop',
    Shop1: 'Shop 1',
    Shop2: 'Shop 2',
    Shop3: 'Shop 3',
    proposedServices: "What services do you offer?",
    service1: 'Service 1',
    service2: 'Service 2',
    service3: 'Service 3',
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
  width: calc(0.25rem * 24);
  font-weight: 600;
}

#provider-name {
  flex: auto;
}

#button-container {
  display: flex;
  justify-content: flex-end;
  gap: calc(0.25rem * 2);
}

.input-text-container {
  display: flex;
  align-items: center;
  margin-bottom: calc(0.25rem * 4);
  gap: calc(0.25rem * 4);
}
</style>