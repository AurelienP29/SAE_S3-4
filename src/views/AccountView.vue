<template>
  <div class="account-view-container p-4">
    <div v-if="!authStore.isAuthenticated" class="flex flex-col items-center justify-center h-64">
      <Message severity="warn">Vous devez être connecté pour accéder à cette page.</Message>
      <Button label=" Se connecter" icon="pi pi-sign-in" @click="router.push('/login')" class="mt-4" />
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-white uppercase tracking-wider">Mon Compte</h1>

      <div class="g-panel p-6">
        <div class="flex items-center gap-4 mb-8">
          <!-- icone user !-->
          <Avatar v-if="authStore.user.picture" :image="authStore.user.picture" size="xlarge" shape="circle" />
          <Avatar v-else :label=" authStore.user.name?.charAt(0).toUpperCase()" size="xlarge" shape="circle" class="bg-purple-500 text-white" />
          <div>
            <h2 class="text-2xl font-bold text-white">{{ authStore.user.name }}</h2>
            <p class="text-gray-400 capitalize">{{ authStore.user.role }}</p>
          </div>
        </div>

        <Tabs value="0">
          <TabList>
            <Tab value="0">
              <i class="pi pi-user mr-2"></i>Profil
            </Tab>
            <Tab value="1">
              <i class="pi pi-calendar mr-2"></i>Mes Activités
            </Tab>
            <Tab value="2">
              <i class="pi pi-lock mr-2"></i>Sécurité
            </Tab>
          </TabList>
          <TabPanels>

<!-- tab Profil -->
            <TabPanel value="0">
              <div class="pt-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="flex flex-col gap-2">
                    <label for="acc-name" class="font-bold text-gray-300">Nom Complet</label>
                    <InputText id="acc-name" v-model="profileForm.name" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="acc-email" class="font-bold text-gray-300">Email (non modifiable)</label>
                    <InputText id="acc-email" v-model="profileForm.email" disabled class="opacity-60" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="acc-phone" class="font-bold text-gray-300">Téléphone</label>
                    <InputText id="acc-phone" v-model="profileForm.phone" placeholder="Ex: 06 00 00 00 00" />
                  </div>
                  <div class="flex flex-col gap-2 md:col-span-2">
                    <label for="acc-desc" class="font-bold text-gray-300">Bio / Description</label>
                    <Textarea id="acc-desc" v-model="profileForm.description" rows="4" class="w-full" />
                  </div>
                </div>

                <div class="mt-8 flex justify-end">
                  <Button label=" Enregistrer les modifications" icon="pi pi-save" severity="primary" @click="saveProfile" :loading="saving" />
                </div>
              </div>
            </TabPanel>


<!-- tab activités -->
            <TabPanel value="1">
              <div class="pt-4">
                <div v-if="authStore.user.role === 'visiteur'">
                  <h3 class="text-xl font-bold text-purple-400 mb-4">Mes Réservations</h3>
                  <div v-if="authStore.mesReservations.length > 0" class="flex flex-col gap-4">
                    <div v-for="resa in authStore.mesReservations" :key="resa.id" class="resa-item-glass p-4 rounded flex justify-between items-center">
                      <div>
                        <div class="font-bold text-white text-lg">{{ resa.activite.titre }}</div>
                        <div class="text-gray-400 text-sm">{{ resa.activite.date }} (Réservé le {{ resa.dateReservation }})</div>
                      </div>
                      <Button icon="pi pi-trash" severity="danger" rounded text @click="handleCancel(resa.id)" />
                    </div>
                  </div>
                  <div v-else class="text-gray-400 italic p-4">Aucune réservation pour le moment.</div>
                  <Button label=" Voir les activités" icon="pi pi-calendar" @click="router.push('/activities')" class="mt-4" text />
                </div>

                <div v-else-if="authStore.user.role === 'organisateur'">
                   <h3 class="text-xl font-bold text-purple-400 mb-4">Administration - Suivi global</h3>
                   <DataTable :value="authStore.reservations" class="p-datatable-sm">
                      <Column field="userEmail" header="Client"></Column>
                      <Column field="activite.titre" header="Activité"></Column>
                      <Column field="dateReservation" header="Date"></Column>
                      <Column header="Action">
                        <template #body="slotProps">
                          <Button icon="pi pi-times" severity="danger" text rounded @click="handleCancel(slotProps.data.id)" />
                        </template>
                      </Column>
                   </DataTable>
                </div>

                <div v-else-if="authStore.user.role === 'prestataire'">
                  <h3 class="text-xl font-bold text-purple-400 mb-4">Espace Prestataire</h3>
                  <div class="resa-item-glass p-6 rounded">
                    <p class="mb-2">Statut du stand : <span class="text-green-400 font-bold">Validé</span></p>
                    <p>Emplacement : <span class="text-white font-bold">Hall B - Stand 12</span></p>
                    <Button label=" Gérer mes prestations" icon="pi pi-box" @click="router.push('/prestataire')" class="mt-4" />
                  </div>
                </div>
              </div>
            </TabPanel>

<!-- tab sécu -->
            <TabPanel value="2">
              <div class="pt-4">
                <p class="text-gray-700 mb-6">Pour changer votre mot de passe, veuillez remplir les champs ci-dessous.</p>
                <div class="grid grid-cols-1 gap-4">
                  <div class="flex gap-2">
                    <label for="current-pass" class="font-bold text-gray-500">Mot de passe actuel</label>
                    <Password id="current-pass" v-model="securityForm.currentPassword" :feedback="false" toggleMask fluid />
                  </div>
                  <div class="flex flex-row gap-2">
                    <label for="new-pass" class="font-bold text-gray-500">Nouveau mot de passe</label>
                    <Password id="new-pass" v-model="securityForm.newPassword" toggleMask fluid />
                  </div>
                  <div class="flex gap-2">
                    <label for="confirm-pass" class="font-bold text-gray-500">Confirmer le mot de passe</label>
                    <Password id="confirm-pass" v-model="securityForm.confirmPassword" :feedback="false" toggleMask fluid />
                  </div>
                </div>
                <div class="mt-8 flex justify-start">
                  <Button label=" Mettre à jour le mot de passe" icon="pi pi-key" severity="warn" @click="updatePassword" />
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <div class="mt-5 items-center">
            <span class="text-gray-500 text-sm">Identifiant unique: {{ authStore.user.id }}</span>
            <Button label=" Se déconnecter" icon="pi pi-sign-out" severity="danger" text @click="handleLogout" />
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore.js';
import { 
  InputText, Button, Textarea, Password, Message, 
  Tabs, TabList, Tab, TabPanels, TabPanel, Avatar, Toast,
  DataTable, Column
} from 'primevue';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const saving = ref(false);

const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  description: ''
});

const securityForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

onMounted(() => {
  if (authStore.user) {
    profileForm.name = authStore.user.name || '';
    profileForm.email = authStore.user.email || '';
    profileForm.phone = authStore.user.phone || '';
    profileForm.description = authStore.user.description || '';
  }
});

function saveProfile() {
  saving.value = true;
  
  // Simulation d'un délai réseau
  setTimeout(() => {
    authStore.updateUser({
      name: profileForm.name,
      phone: profileForm.phone,
      description: profileForm.description
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
  
  // Reset security form
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
</style>