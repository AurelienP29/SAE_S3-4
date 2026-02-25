<template>
  <div class="provider-request">
    <Button
        :label="displayLabel"
        :icon="buttonIcon"
        :severity="buttonSeverity"
        :text="buttonText"
        :outlined="buttonOutlined"
        :rounded="buttonRounded"
        :class="buttonClass"
        :style="buttonStyle"
        :aria-label="t('registerAsProvider')"
        @click="openModal"
    />

    <Dialog v-model:visible="visible" :header="t('registerAsProvider')" :style="{ width: '250rem' }"
            position="bottom" :modal="true" :draggable="false">

      <form class="form_provider" id="form_provider" @submit.prevent="validateAndSend">

        <!-- Provider Name -->
        <div class="form-group">
          <label for="provider-name">{{ t('providerName') }}</label>
          <input type="text" id="provider-name" v-model="formData.providerName" required />
          <span class="error" :class="{ active: errors.providerNameError }">{{ t('providerMessageError') }}</span>
        </div>

        <!-- Shop Name -->
        <div class="form-group">
          <label for="shop-name">{{ t('shopName') }}</label>
          <input type="text" id="shop-name" v-model="formData.shopName" />
          <span class="error" :class="{ active: errors.shopNameError }">{{ t('shopNameError') }}</span>
        </div>

        <!-- Phone, Email, Website -->
        <div class="form-group">
          <label>{{ t('phone') }} / {{ t('email') }} / {{ t('website') }}</label>

          <div class="input-text-container">
            <div>
              <label for="phone">{{ t('phone') }}</label>
              <input type="tel" id="phone" v-model="formData.phone" pattern="[0-9]{10}" required />
              <span class="error" :class="{ active: errors.phoneError }">{{ t('phoneError') }}</span>
            </div>

            <div>
              <label for="email">{{ t('email') }}</label>
              <input type="email" id="email" v-model="formData.email" required />
              <span class="error" :class="{ active: errors.emailError }">{{ t('emailError') }}</span>
            </div>

            <div>
              <label for="website">{{ t('website') }}</label>
              <input type="text" id="website" v-model="formData.website" />
            </div>
          </div>
        </div>

        <!-- Days of Presence -->
        <div class="form-group">
          <label>{{ t('daysOfPresence') }}</label>

          <div class="option-line">
            <div class="option-item">
              <input type="checkbox" id="day1" :value="t('day1')" v-model="formData.daysOfPresence" />
              <label for="day1">{{ t('day1') }}</label>
            </div>

            <div class="option-item">
              <input type="checkbox" id="day2" :value="t('day2')" v-model="formData.daysOfPresence" />
              <label for="day2">{{ t('day2') }}</label>
            </div>

            <div class="option-item">
              <input type="checkbox" id="day3" :value="t('day3')" v-model="formData.daysOfPresence" />
              <label for="day3">{{ t('day3') }}</label>
            </div>
          </div>

          <span class="error" :class="{ active: errors.daysError }">{{ t('daysError') }}</span>
        </div>

        <!-- Shop Type (Radio) -->
        <div class="form-group">
          <label>{{ t('typeOfShop') }}</label>

          <div class="option-line">
            <div v-for="option in categoryOptions" :key="option.value" class="option-item">
              <input
                  type="radio"
                  :id="`shop-${option.value}`"
                  name="typeOfShop"
                  :value="option.value"
                  v-model="formData.shopType"
              />
              <label :for="`shop-${option.value}`">{{ lang(`category.${option.value}`) }}</label>
            </div>
          </div>

          <span class="error" :class="{ active: errors.shopTypeError }">{{ t('shopTypeError') }}</span>
        </div>

        <!-- Services -->
        <div class="form-group">
          <label>{{ t('proposedServices') }}</label>

          <div class="option-line">
            <div v-for="option in serviceOptions" :key="option.value" class="option-item">
              <input
                  type="checkbox"
                  :id="`service-${option.value}`"
                  :value="option.value"
                  v-model="formData.services"
              />
              <label :for="`service-${option.value}`">{{ lang(`service.${option.value}`) }}</label>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div id="button-container">
          <Button type="button" :label=" t('cancel')" severity="secondary" @click="visible = false"></Button>
          <Button type="button" :label=" t('send')" @click="validateAndSend"></Button>
        </div>

      </form>
    </Dialog>
  </div>
</template>

<script setup>
import {reactive, ref, computed} from 'vue'
import {useAuthStore} from '@/stores/authStore.js'
import {categoryOptions, serviceOptions, waitingList} from '@/datasource/data.mjs'
import {translations as appTranslations} from '@/datasource/lang.js'
import {Dialog, Button} from 'primevue'
import emailjs from '@emailjs/browser'

const props = defineProps({
  buttonLabel: {
    type: String,
    default: ''
  },
  buttonIcon: {
    type: String,
    default: 'pi pi-user-plus'
  },
  buttonSeverity: {
    type: String,
    default: 'secondary'
  },
  buttonText: {
    type: Boolean,
    default: false
  },
  buttonOutlined: {
    type: Boolean,
    default: false
  },
  buttonRounded: {
    type: Boolean,
    default: false
  },
  buttonClass: {
    type: [String, Array, Object],
    default: ''
  },
  buttonStyle: {
    type: [String, Object, Array],
    default: ''
  },
  hideLabel: {
    type: Boolean,
    default: false
  }
});

const authStore = useAuthStore()
const visible = ref(false)

const displayLabel = computed(() => {
  if (props.hideLabel) return ''
  return props.buttonLabel || t('registerAsProvider')
})

// Simple translation function
const translations = {
  fr: {
    providerMessageError: 'Un nom est requis !',
    shopNameError: 'Un nom de boutique est requis !',
    shopTypeError: 'Il faut sélectionner un type de boutique !',
    phoneError: 'Le numéro n\'est pas valide ! ',
    emailError: 'L\'adresse n\'est pas valide! ',
    registerAsProvider: 'S\'inscrire comme prestataire',
    providerName: 'Nom du prestataire',
    shopName: 'Nom de la boutique',
    phone: 'Numéro de téléphone',
    email: 'Adresse email',
    website: 'Site web ou réseau social',
    daysOfPresence: 'Jours de présence',
    day1: 'Vendredi',
    day2: 'Samedi',
    day3: 'Dimanche',
    typeOfShop: 'Type de boutique',
    proposedServices: "Quels services proposez-vous ?",
    cancel: 'Annuler',
    send: 'Envoyer',
    daysError: 'Il faut sélectionner au moins un jour de présence',
    title_mail: 'Merci de votre inscription !',
    remerciement: 'Bonjour ! Merci beaucoup de votre inscription sur le site Necronomi\'con ',
    message: 'Nous avons bien reçu votre demande et la traiterons dans les meilleurs délais ! ',
    message_resume: 'Vous trouverez ci-dessous les informations que nous avons recueillies sur votre inscription : ',
    remerciement_fin: 'A très bientôt à la Necronomi\'con !',
    msg_name: 'Nom : ',
    msg_boutique: 'Boutique : ',
    msg_services: 'Services : ',
    msg_website: 'Site web : ',
    msg_day: 'Jour.s de présence :',
    msg_phone: 'Téléphone : ',
    msg_email: 'Adresse email : ',
    msg_type: 'Type de boutique : ',
  },
  en: {
    providerMessageError: 'A name is required!',
    shopNameError: 'A shop name is required!',
    shopTypeError: 'You must select a shop type!',
    phoneError: 'The phone number is not valid!',
    emailError: 'The email address is not valid!',
    daysError: 'You must select at least one day of presence!',
    registerAsProvider: 'Register as Provider',
    providerName: 'Provider Name',
    shopName: 'Shop Name',
    phone: 'Phone number',
    email: 'Email address',
    website: 'Website or social network',
    daysOfPresence: 'Days of Presence',
    day1: 'Friday',
    day2: 'Saturday',
    day3: 'Sunday',
    typeOfShop: 'Type of Shop',
    proposedServices: "What services do you offer?",
    cancel: 'Cancel',
    send: 'Send',
    title_mail: 'Thank you for your registration!',
    remerciement: 'Hello! Thank you so much for your registration on the Necronomi\'con website!',
    message: 'We have received your request and will process it as soon as possible!',
    message_resume: 'Here are the information we have collected on your registration:',
    remerciement_fin: 'See you at the Necronomi\'con!',
    msg_name: 'Name: ',
    msg_boutique: 'Shop: ',
    msg_services: 'Services: ',
    msg_website: 'Website: ',
    msg_day: 'Days of presence: ',
    msg_phone: 'Phone number: ',
    msg_email: 'Email address: ',
    msg_type: 'Type of shop: ',
  }
}

const formData = reactive({
  providerName: '',
  shopName: '',
  phone: '',
  email: '',
  website: '',
  daysOfPresence: [],
  shopType: '',
  services: []
});

const errors = reactive({
  providerNameError: false,
  shopNameError: false,
  shopTypeError: false,
  phoneError: false,
  emailError: false,
  daysError: false,
})

const t = (key) => {
  return translations[authStore.currentLanguage]?.[key] || translations.fr[key]
}

const lang = (key) => {
  return appTranslations[authStore.currentLanguage]?.[key] || appTranslations.fr[key] || key
}

function openModal() {
  visible.value = true
}

function validateAndSend() {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = false);

  if (!formData.providerName) {
    errors.providerNameError = true;
    isValid = false;
  }

  if (!formData.shopName) {
    errors.shopNameError = true;
    isValid = false;
  }

  if (!formData.shopType) {
    errors.shopTypeError = true;
    isValid = false;
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!formData.phone || !phoneRegex.test(formData.phone)) {
    errors.phoneError = true;
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.emailError = true;
    isValid = false;
  }

  if (formData.daysOfPresence.length === 0) {
    errors.daysError = true;
    isValid = false;
  }

  if (isValid) {
    registerProvider();
  }
}

async function registerProvider() {
  console.log("Register provider : ", formData);

  const shopTypeLabel = formData.shopType ? lang(`category.${formData.shopType}`) : '';
  const servicesLabel = formData.services.map((service) => lang(`service.${service}`)).join(', ');
  const requestDate = new Date().toISOString().slice(0, 10);

  const newWaitlistId = waitingList.value.length > 0
      ? Math.max(...waitingList.value.map(p => p.id)) + 1
      : 1;

  const templateData = {
    title: t('title_mail'),
    remerciement: t('remerciement'),
    name: formData.providerName,
    message_resume: t('message_resume'),
    message: t('message'),
    remerciement_fin: t('remerciement_fin'),
    provider_name: formData.providerName,
    shop_name: formData.shopName,
    phone: formData.phone,
    email: formData.email,
    website: formData.website,
    days_of_presence: formData.daysOfPresence.join(', '),
    shop_type: shopTypeLabel || formData.shopType,
    services: servicesLabel || formData.services.join(', '),
    msg_name: t('msg_name'),
    msg_boutique: t('msg_boutique'),
    msg_services: t('msg_services'),
    msg_website: t('msg_website'),
    msg_day: t('msg_day'),
    msg_phone: t('msg_phone'),
    msg_email: t('msg_email'),
    msg_type: t('msg_type'),
  };

  waitingList.value.push({
    id: newWaitlistId,
    name: formData.shopName || formData.providerName,
    email: formData.email,
    phone: formData.phone,
    category: formData.shopType,
    description: '',
    services: [...formData.services],
    requestDate: requestDate
  });

  emailjs.send('service_2zpxqyi', 'inscription_provider',  templateData)
      .then((message) => {
            console.log('SUCCESS!', message);
          }, (error) => {
            console.log('FAILED...', error);
          }
      )

  visible.value = false;
}
</script>

<style scoped>
/* ----- FORM CONTAINER ----- */
.form_provider {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  padding: 1rem 0.8rem;
  max-width: 900px;
  margin: auto;
}

/* ----- BLOC GLOBAL DE CHAQUE QUESTION ----- */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-bottom: 0.8rem;
}

/* ----- LABEL DES QUESTIONS ----- */
.form-group > label {
  font-weight: 700;
  font-size: 1.1rem;
  color: #222;
}

/* ----- INPUTS TEXT ----- */
.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"] {
  width: 100%;
  padding: 0.6rem 0.7rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color .2s, box-shadow .2s;
}

.form-group input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, .25);
  outline: none;
}

/* ---------- INPUT TEXT GROUPED ---------- */
.input-text-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.input-text-container label {
  font-size: 0.9rem;
  font-weight: 600;
}

/* ---------- CHECKBOXES / RADIOS ALIGNÉS ---------- */
.option-line {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.option-item input {
  margin: 0;
}

.option-item label {
  font-size: 0.95rem;
  font-weight: 500;
}

/* ----- ERROR MESSAGES ----- */
.error {
  font-size: 0.85rem;
  color: white;
  background: #b00020;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  visibility: hidden;
  height: 1.2rem;
  display: flex;
  align-items: center;
}

.error.active {
  visibility: visible;
}

/* ----- BUTTONS ----- */
#button-container {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

/* ----- RESPONSIVE ----- */
@media (max-width: 800px) {
  .input-text-container {
    grid-template-columns: 1fr;
  }
}
</style>
