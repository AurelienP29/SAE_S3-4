<template>
  <div class="checkout-page">
    <div class="container">
      <h1 class="text-3xl font-bold mb-5 text-center">Finalisation de votre commande</h1>

      <div v-if="cartStore.items.length === 0" class="empty-state card text-center p-8">
        <i class="pi pi-shopping-cart text-6xl mb-4 text-400"></i>
        <p class="text-xl mb-4">Votre panier est tristement vide...</p>
        <Button label="Découvrir nos activités" icon="pi pi-arrow-left" @click="$router.push('/activities')" />
      </div>

      <form v-else @submit.prevent="processPayment" class="grid">
        <!-- Colonne de Gauche : Formulaires Billets -->
        <div class="col-12 lg:col-8">
          <div v-for="(item, index) in cartStore.items" :key="item.uuid" class="ticket-card card mb-4 shadow-1">
            <div class="ticket-header flex align-items-center justify-content-between mb-4">
              <div class="flex align-items-center gap-3">
                <span class="ticket-badge">{{ index + 1 }}</span>
                <h3 class="m-0 text-xl font-semibold">{{ item.label }}</h3>
              </div>
              <div class="flex align-items-center gap-3">
                <span class="text-primary font-bold text-lg">{{ item.cout }}€</span>
                <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger"
                    @click="cartStore.removeFromCart(item.uuid)"
                    aria-label="Supprimer le billet"
                />
              </div>
            </div>

            <div class="grid p-fluid">
              <div class="field col-12 md:col-6">
                <label :for="'name-' + item.uuid" class="font-medium">Nom complet</label>
                <InputText :id="'name-' + item.uuid" v-model="item.holderName" placeholder="Ex: Jean Dupont" required />
              </div>
              <div class="field col-12 md:col-6">
                <label :for="'email-' + item.uuid" class="font-medium">Email</label>
                <InputText :id="'email-' + item.uuid" type="email" v-model="item.holderEmail" placeholder="jean@exemple.com" required />
              </div>
              <div class="field col-12">
                <label :for="'birth-' + item.uuid" class="font-medium">Date de naissance</label>
                <InputText :id="'birth-' + item.uuid" type="date" v-model="item.holderBirthDate" required />
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne de Droite : Résumé & Paiement -->
        <div class="col-12 lg:col-4">
          <div class="sticky-summary card shadow-2 p-4">
            <h3 class="text-xl font-bold mb-4 border-bottom-1 pb-3 border-200">Résumé</h3>

            <div class="flex justify-content-between mb-3">
              <span class="text-600">Nombre de billets</span>
              <span class="font-bold">{{ cartStore.itemsCount }}</span>
            </div>

            <div class="flex justify-content-between mb-4 text-xl">
              <span class="font-bold">Total</span>
              <span class="font-bold text-primary">{{ cartStore.totalAmount }}€</span>
            </div>

            <h4 class="font-semibold mb-3">Mode de paiement</h4>
            <div class="flex flex-column gap-3 mb-5">
              <div class="payment-option p-3 border-1 border-round-md cursor-pointer transition-colors duration-200"
                   :class="{'selected-payment': paymentMethod === 'CB'}"
                   @click="paymentMethod = 'CB'">
                <RadioButton v-model="paymentMethod" inputId="cb" name="payment" value="CB" />
                <label for="cb" class="ml-2 cursor-pointer font-medium">
                  <i class="pi pi-credit-card mr-2"></i> Carte Bancaire
                </label>
              </div>

              <div class="payment-option p-3 border-1 border-round-md cursor-pointer transition-colors duration-200"
                   :class="{'selected-payment': paymentMethod === 'PayPal'}"
                   @click="paymentMethod = 'PayPal'">
                <RadioButton v-model="paymentMethod" inputId="paypal" name="payment" value="PayPal" />
                <label for="paypal" class="ml-2 cursor-pointer font-medium">
                  <i class="pi pi-paypal mr-2"></i> PayPal
                </label>
              </div>
            </div>

            <Button
                type="submit"
                :label="paymentMethod ? `Payer ${cartStore.totalAmount}€` : 'Choisir un paiement'"
                icon="pi pi-lock"
                :disabled="!isFormValid"
                class="w-full p-button-lg shadow-2"
                :class="isFormValid ? 'p-button-primary' : 'p-button-secondary'"
            />
            <p class="text-center text-xs text-500 mt-3">
              <i class="pi pi-shield mr-1"></i> Paiement 100% sécurisé
            </p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 3rem 1rem;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.ticket-card {
  transition: transform 0.2s;
}

.ticket-badge {
  background: var(--primary-color);
  color: white;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: bold;
}

.sticky-summary {
  position: sticky;
  top: 2rem;
}

.payment-option {
  border-color: #e2e8f0;
}

.payment-option:hover {
  background-color: #f1f5f9;
}

.selected-payment {
  border-color: var(--primary-color);
  background-color: #eff6ff !important;
  box-shadow: 0 0 0 1px var(--primary-color);
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  color: #475569;
}

/* Override PrimeVue Input styles pour plus de rondeur */
:deep(.p-inputtext) {
  border-radius: 8px;
  padding: 0.75rem;
}

:deep(.p-button) {
  border-radius: 8px;
  padding: 0.8rem;
}

@media (max-width: 991px) {
  .sticky-summary {
    position: static;
    margin-top: 2rem;
  }
}
</style>

<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '@/stores/cartStore.js';
import InputText from 'primevue/inputtext';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import emailjs from '@emailjs/browser'
import {useAuthStore} from "@/stores/authStore.js";
import router from "@/router/index.js";

const authStore = useAuthStore();
const cartStore = useCartStore();
const paymentMethod = ref(null);
const translation = {
  fr: {
    salutations: "Bonjour ",
    core_message: "Voici votre ticket, gardez bien ce mail il vous sera demandé à l'accueil.",
    end_message: "A très bientôt! \nL'équipe Necronomi'con"
  },
  en: {
    salutations: "Hello ",
    core_message: "Here is your ticket, keep this email well, it will be asked at the reception.",
    end_message: "See you soon! \nNecronomi'con Team"
  }
}
const t = (key) => {
  return translation[authStore.currentLanguage]?.[key] || translation.fr[key]
}

const isFormValid = computed(() => {
  // Vérifie si le mode de paiement est choisi
  if (!paymentMethod.value) return false;

  // Vérifie si tous les champs de chaque billet sont remplis
  return cartStore.items.every(item =>
      item.holderName?.trim().length > 0 &&
      item.holderBirthDate !== '' &&
      /^\S+@\S+\.\S+$/.test(item.holderEmail) // Validation email simple
  );
});

const processPayment = async () => {
  if (isFormValid.value) {
    alert(`Paiement de ${cartStore.totalAmount}€ effectué via ${paymentMethod.value}`);
    try{
      const emailPromises = cartStore.items.map(ticket => {
        const templateParams = {
          name: ticket.holderName,
          email: ticket.holderEmail,
          ticket_label: ticket.label,
          ticket_uuid: ticket.uuid,
          salutations: t('salutations'),
          core_message: t('core_message'),
          end_message: t('end_message')
        };
        return emailjs.send(
            'service_c8v4m1m',
            'template_ldyg6od',
            templateParams,
            '35QMzN_dvjeN3YUiG'
        );
      });

      // On attend que tous les mails soient envoyés
      await Promise.all(emailPromises);

      alert(`Paiement réussi ! Un mail a été envoyé à chaque participant.`);

      cartStore.confirmTickets();

      await router.push({name: 'success'});
    } catch (error) {
      console.error("Erreur lors de l'envoi des mails :", error);
      alert("Le paiement a réussi mais une erreur est survenue lors de l'envoi des confirmations.");
    }
  }
};
</script>
