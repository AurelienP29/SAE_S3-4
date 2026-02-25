<!-- Account Management View -->

<template>
  <div class="account-view-container p-4">
    <div v-if="!authStore.isAuthenticated" class="flex flex-col items-center justify-center h-64">
      <Message severity="warn">{{ lang('account.notConnected') }}</Message>
      <Button :label="' ' + lang('login')" icon="pi pi-sign-in" @click="router.push('/login')" class="mt-4" />
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-white uppercase tracking-wider">{{ lang('account.title') }}</h1>

      <div class="g-panel p-6">
        <div class="flex items-center gap-4 mb-8">

    <!-- icone user !-->
          <Avatar v-if="profileForm.picture" :image="profileForm.picture" size="xlarge" shape="circle" />
          <Avatar v-else-if="authStore.user.picture" :image="authStore.user.picture" size="xlarge" shape="circle" />
          <Avatar v-else :label=" authStore.user.name?.charAt(0).toUpperCase()" size="xlarge" shape="circle" class="bg-purple-500 text-white" />
          <div>
            <h2 class="text-2xl font-bold text-white">{{ authStore.user.name }}</h2>
            <p class="text-gray-400 capitalize">{{ authStore.user.role }}</p>
          </div>
        </div>

        <Tabs value="0">
          <TabList>
            <Tab value="0">
              <i class="pi pi-user mr-2"></i>{{ lang('profile') }}
            </Tab>
            <Tab value="1">
              <i class="pi pi-ticket mr-2"></i>{{ lang('account.tickets') }}
            </Tab>
            <Tab value="2">
              <i class="pi pi-calendar mr-2"></i>{{ lang('account.activities') }}
            </Tab>
            <Tab value="3">
              <i class="pi pi-lock mr-2"></i>{{ lang('account.security') }}
            </Tab>
          </TabList>
          <TabPanels>

<!-- tab Profil -->
            <TabPanel value="0">
              <div class="pt-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="flex flex-col gap-2">
                    <label for="acc-name" class="font-bold">{{ lang('account.fullName') }}</label>
                    <InputText id="acc-name" v-model="profileForm.name" class="w-full" />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label for="acc-email" class="font-bold">{{ lang('account.emailReadOnly') }}</label>
                    <InputText id="acc-email" v-model="profileForm.email" disabled class="w-full opacity-60" />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label for="acc-phone" class="font-bold">{{ lang('account.phone') }}</label>
                    <InputText id="acc-phone" v-model="profileForm.phone" placeholder="Ex: 06 00 00 00 00" class="w-full" />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label for="acc-picture" class="font-bold">{{ lang('account.picture') }}</label>
                    <InputText id="acc-picture" v-model="profileForm.picture" placeholder="https://..." class="w-full" />
                  </div>

                  <div class="flex flex-col gap-2 md:col-span-2">
                    <label for="acc-desc" class="font-bold">{{ lang('account.description') }}</label>
                    <Textarea id="acc-desc" v-model="profileForm.description" rows="4" class="w-full" />
                  </div>
                </div>

                <div class="mt-8 flex justify-end">
                  <Button
                      :label="lang('account.saveChanges')"
                      icon="pi pi-save"
                      severity="primary"
                      @click="saveProfile"
                      :loading="saving"
                  />
                </div>
              </div>

<!-- Reviews !-->
              <div class="mt-10 border-t border-gray-200 pt-6">
                <h3 class="text-xl font-bold text-primary mb-4 uppercase tracking-wider">
                  {{ lang('account.myReviews') }}
                </h3>

                <div v-if="userReviews.length > 0" class="flex flex-col gap-4">
                  <div v-for="review in userReviews" :key="review.id" class="border p-4 rounded-lg bg-white shadow-sm flex flex-col gap-3">
                    <div class="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                      <div>
                        <router-link :to="'/prestation/' + review.prestationId" class="font-bold hover:text-primary no-underline transition-colors block">
                          {{ getPrestationName(review.prestationId) }}
                        </router-link>
                        <span class="text-xs text-gray-500">{{ review.date }}</span>
                      </div>

                      <div class="flex items-center gap-3">
                        <Rating v-model="review.rating" readonly :cancel="false" />
                        <div class="flex gap-1">
                          <Button icon="pi pi-pencil" text rounded severity="info" size="small" @click="editReview(review)" />
                          <Button icon="pi pi-trash" text rounded severity="danger" size="small" @click="confirmDeleteReview(review.id)" />
                        </div>
                      </div>
                    </div>

                    <p class="text-gray-600 italic m-0">"{{ review.comment }}"</p>
                  </div>
                </div>

                  <!-- si pas de reviews !-->
                <div v-else class="text-gray-500 italic p-6 bg-gray-50 rounded text-center">
                  {{ lang('account.noReviews') }}
                </div>
              </div>
    <!-- Review modif dialog -->
              <Dialog v-model:visible="editReviewDialog" :header="lang('review.edit')" modal class="p-fluid" style="width: 450px">
                <div class="flex flex-col gap-4 mt-2">
                  <div class="flex items-center gap-3">
                    <span class="font-bold">{{ lang('review.rating') }}</span>
                    <Rating v-model="selectReview.rating" :cancel="false" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="font-bold">{{ lang('review.comment') }}</label>
                    <Textarea v-model="selectReview.comment" rows="4" />
                  </div>
                </div>
                <template #footer>
                  <Button :label="' ' + lang('cancel')" icon="pi pi-times" text @click="editReviewDialog = false" />
                  <Button :label="' ' + lang('save')" icon="pi pi-check" @click="saveReviewEdit" />
                </template>
              </Dialog>
              <ConfirmDialog />


            </TabPanel>

<!-- tab billets !-->
            <TabPanel value="1">
              <div class="pt-4">
                <h3 class="text-xl font-bold text-purple-400 mb-4">{{ lang('account.tickets') }}</h3>
                <!--
                <div v-for="t in userTickets" class="ticket">
                   {{ t.label }} - {{ t.uuid }}
                </div>
                !-->
                <div v-if="userTickets.length > 0" class="tickets-grid">
                  <div v-for="ticket in userTickets" :key="ticket.uuid" class="necro-ticket fade-in">
                    <div class="ticket-left">
                      <div class="ticket-event">NECRONOMI'CON 2026</div>
                      <div class="ticket-type">{{ ticket.label }}</div>
                      <div class="ticket-info">
                        <div class="info-group">
                          <span class="label">{{ lang('ticket.holder') }}</span>
                          <span class="value">{{ ticket.holderName }}</span>
                        </div>
                        <div class="info-group">
                          <span class="label">{{ lang('ticket.date') }}</span>
                          <span class="value">{{ ticket.purchaseDate }}</span>
                        </div>
                      </div>
                      <div class="ticket-uuid">{{ ticket.uuid }}</div>
                    </div>
                    <div class="ticket-right">
                      <div class="qr-code-placeholder">
                        <i class="pi pi-qrcode"></i>
                      </div>
                      <div class="ticket-price">{{ ticket.cout }}€</div>
                    </div>
                    <div class="ticket-stub"></div>
                  </div>
                </div>
                <div v-else class="text-gray-400 italic p-4 text-center">
                  <i class="pi pi-ticket text-4xl mb-3 block"></i>
                  {{ lang('ticket.empty') }}
                  <Button :label="' ' + lang('ticket.goto')" icon="pi pi-shopping-bag" @click="router.push('/activities')" class="mt-4 block mx-auto" text />
                </div>
              </div>
            </TabPanel>

<!-- tab activités -->
            <TabPanel value="2">
              <div class="pt-4">
                <div v-if="authStore.user.role === 'visiteur'">
                  <h3 class="text-xl font-bold text-purple-400 mb-4">{{ lang('reservation.my') }}</h3>
                  <div v-if="authStore.mesReservations.length > 0" class="flex flex-col gap-4">
                    <div v-for="resa in authStore.mesReservations" :key="resa.id" class="resa-item-glass p-4 rounded flex justify-between items-center">
                      <div>
                        <div class="font-bold text-white text-lg">{{ resa.activite.titre }}</div>
                        <div class="text-gray-400 text-sm">{{ resa.activite.date }} (Réservé le {{ resa.dateReservation }})</div>
                      </div>
                      <Button icon="pi pi-trash" severity="danger" rounded text @click="handleCancel(resa.id)" />
                    </div>
                  </div>
                  <div v-else class="text-gray-400 italic p-4">{{ lang('reservation.empty') }}</div>
                  <Button :label="' ' + lang('reservation.view')" icon="pi pi-calendar" @click="router.push('/activities')" class="mt-4" text />
                </div>

                <div v-else-if="authStore.user.role === 'organisateur'">
                   <h3 class="text-xl font-bold text-purple-400 mb-4">{{ lang('admin.globalTracking') }}</h3>
                   <DataTable :value="authStore.reservations" class="p-datatable-sm">
                      <Column field="userEmail" :header="lang('admin.client')"></Column>
                      <Column field="activite.titre" :header="lang('admin.activity')"></Column>
                      <Column field="dateReservation" :header="lang('admin.date')"></Column>
                      <Column :header="lang('admin.action')">
                        <template #body="slotProps">
                          <Button icon="pi pi-times" severity="danger" text rounded @click="handleCancel(slotProps.data.id)" />
                        </template>
                      </Column>
                   </DataTable>
                </div>

                <div v-else-if="authStore.user.role === 'prestataire'">
                  <h3 class="text-xl font-bold text-purple-400 mb-4">{{ lang('prestataire.space') }}</h3>
                  <div class="resa-item-glass p-6 rounded">
                    <p class="mb-2">{{ lang('prestataire.status') }} <span class="text-green-400 font-bold">{{ lang('prestataire.validated') }}</span></p>
                    <p>{{ lang('prestataire.location') }} <span class="text-white font-bold">Hall B - Stand 12</span></p>
                    <Button :label="' ' + lang('prestataire.manage')" icon="pi pi-box" @click="router.push('/prestatairedashboard')" class="mt-4" />
                  </div>
                </div>
              </div>
            </TabPanel>

<!-- tab sécu -->
            <TabPanel value="3">
              <div class="pt-4">
                <p class="text-gray-700 mb-6">{{ lang('security.instructions') }}</p>
                <div class="grid grid-cols-1 gap-4">
                  <div class="flex gap-2">
                    <label for="current-pass" class="font-bold text-gray-500">{{ lang('security.currentPass') }}</label>
                    <Password id="current-pass" v-model="securityForm.currentPassword" :feedback="false" toggleMask fluid />
                  </div>
                  <div class="flex flex-row gap-2">
                    <label for="new-pass" class="font-bold text-gray-500">{{ lang('security.newPass') }}</label>
                    <Password id="new-pass" v-model="securityForm.newPassword" toggleMask fluid />
                  </div>
                  <div class="flex gap-2">
                    <label for="confirm-pass" class="font-bold text-gray-500">{{ lang('security.confirmPass') }}</label>
                    <Password id="confirm-pass" v-model="securityForm.confirmPassword" :feedback="false" toggleMask fluid />
                  </div>
                </div>
                <div class="mt-8 flex justify-start">
                  <Button :label="' ' + lang('security.updatePass')" icon="pi pi-key" severity="warn" @click="updatePassword" />
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <div class="mt-5 items-center">
            <span class="text-gray-500 text-sm">{{ lang('account.uid') }} {{ authStore.user.id }}</span>
            <Button :label="' ' + lang('logout')" icon="pi pi-sign-out" severity="danger" text @click="handleLogout" />
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore.js';
import { useCartStore } from '@/stores/cartStore.js';
import { useReviewStore } from '@/stores/reviewStore.js';
import { prestations } from '@/datasource/data.mjs';
import { translations } from '@/datasource/lang.js';

import {
  InputText, Button, Textarea, Password, Message,
  Tabs, TabList, Tab, TabPanels, TabPanel, Avatar, Toast,
  DataTable, Column, Rating, ConfirmDialog, Dialog
} from 'primevue';

import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const reviewStore = useReviewStore();
const toast = useToast();
const confirm = useConfirm();

// Tod: changement de la langue

const lang = (key) => {
  return translations[authStore.currentLanguage][key] || key;
};

const saving = ref(false);

const userTickets = computed(() => {
  if (!authStore.user) return [];
  return cartStore.userConfirmedTickets(authStore.user.email);
});


  // Reviews
const userReviews = computed(() => {
  if (!authStore.user) return [];
  return reviewStore.getReviewsByUser(authStore.user.id);
});

const getPrestationName = (id) => {
  const p = prestations.find(presta => presta.id === id);
  return p ? p.name : 'Prestation inconnue';
};

const editReviewDialog = ref(false);
const selectReview = reactive({
  id: null,
  rating: 0,
  comment: ''
});

function editReview(review) {
  selectReview.id = review.id;
  selectReview.rating = review.rating;
  selectReview.comment = review.comment;
  editReviewDialog.value = true;
}

function saveReviewEdit() {
  reviewStore.updateReview(selectReview.id, {
    rating: selectReview.rating,
    comment: selectReview.comment
  });
  editReviewDialog.value = false;
  toast.add({ severity: 'success', summary: 'Succès', detail: 'Avis mis à jour', life: 3000 });
}

function confirmDeleteReview(id) {
  confirm.require({
    message: 'Voulez-vous vraiment supprimer cet avis ?',
    header: 'Confirmation de suppression',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      reviewStore.deleteReview(id);
      toast.add({ severity: 'info', summary: 'Supprimé', detail: 'L\'avis a été supprimé', life: 3000 });
    }
  });
}

const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  description: '',
  picture: ''
});

const securityForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

onMounted(() => {
  if (authStore.user) {
    // profileForm.name = authStore.user.name;
    profileForm.name = authStore.user.name || '';
    profileForm.email = authStore.user.email || '';
    profileForm.phone = authStore.user.phone || '';
    profileForm.description = authStore.user.description || '';
    profileForm.picture = authStore.user.picture || '';
  }
});

function saveProfile() {
  saving.value = true;

  /*
  authStore.user.name = profileForm.name;
  authStore.user.phone = profileForm.phone;
  */

  setTimeout(() => {
    authStore.updateUser({
      name: profileForm.name,
      phone: profileForm.phone,
      description: profileForm.description,
      picture: profileForm.picture
    });

    saving.value = false;
    toast.add({ severity: 'success', summary: 'Succès', detail: 'Profil mis à jour avec succès', life: 3000 });
  }, 500);
}

function updatePassword() {
  if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs', life: 3000 });
    return;
  }

  if (securityForm.newPassword !== securityForm.confirmPassword) {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Les nouveaux mots de passe ne correspondent pas', life: 3000 });
    return;
  }

  toast.add({ severity: 'success', summary: 'Succès', detail: 'Mot de passe mis à jour (simulation)', life: 3000 });

  // Resetz
  securityForm.currentPassword = '';
  securityForm.newPassword = '';
  securityForm.confirmPassword = '';
}

function handleLogout() {
  authStore.logout();
  router.push('/');
}

function handleCancel(id) {
  if (confirm("Voulez-vous vraiment annuler cette réservation ?")) {
    authStore.annulerReservation(id);
    toast.add({ severity: 'info', summary: 'Annulé', detail: 'Réservation annulée', life: 3000 });
  }
}
</script>

<style scoped>
.account-view-container {
  min-height: 90vh;
  color: #f1f5f9;
}

.g-panel {
  background: rgba(187, 186, 197, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 12px;
}

.resa-item-glass {
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.necro-ticket {
  display: flex;
  background: #fff;
  color: #333;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  min-height: 160px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.ticket-left {
  flex: 1;
  padding: 1rem;
  border-right: 2px dashed #ccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ticket-event {
  font-size: 0.7rem;
  font-weight: 800;
  color: #a855f7;
  letter-spacing: 1px;
}

.ticket-type {
  font-size: 1.2rem;
  font-weight: 900;
  text-transform: uppercase;
  margin: 0.5rem 0;
}

.ticket-info {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
}

.info-group {
  display: flex;
  flex-direction: column;
}

.info-group .label {
  color: #888;
  font-size: 0.6rem;
  text-transform: uppercase;
}

.info-group .value {
  font-weight: 600;
}

.ticket-uuid {
  font-family: monospace;
  font-size: 0.5rem;
  color: #aaa;
  margin-top: 0.5rem;
}

.ticket-right {
  width: 100px;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

.qr-code-placeholder {
  font-size: 3rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.ticket-price {
  font-weight: 800;
  font-size: 1.1rem;
}

.ticket-stub {
  position: absolute;
  right: 90px;
  top: -10px;
  bottom: -10px;
  width: 20px;
  background: transparent;
}

.ticket-stub::before, .ticket-stub::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(187, 186, 197, 1); /* Match parent background */
  border-radius: 50%;
  left: 0;
}

.ticket-stub::before { top: 0; transform: translateY(-50%); }
.ticket-stub::after { bottom: 0; transform: translateY(50%); }

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>