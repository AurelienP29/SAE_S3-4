<template>
  <div class="prestataire-view-container p-4">
    <div v-if="!prestataire" class="flex flex-col items-center justify-center h-64">
      <Message severity="warn">Vous n'êtes pas reconnu comme un prestataire ou n'êtes pas connecté.</Message>
      <Button label=" Retour à l'accueil" icon="pi pi-home" @click="router.push('/')" class="mt-4" />
    </div>

    <div v-else>
      <h1 class="text-3xl font-bold mb-6 text-white uppercase tracking-wider">Espace Prestataire : {{ prestataire.name }}</h1>

      <Tabs value="0">
        <TabList>
          <Tab value="0">
            <i class="pi pi-user mr-2"></i>Mon Profil
          </Tab>
          <Tab value="1">
            <i class="pi pi-box mr-2"></i>Mes Prestations
          </Tab>
        </TabList>
        <TabPanels>
          <!-- Onglet Profil -->
          <TabPanel value="0">
            <div class="g-panel p-6 mt-4">
              <h2 class="text-xl font-bold mb-4 text-purple-400 uppercase">Informations Générales</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <label for="name" class="font-bold text-gray-300">Nom de l'enseigne</label>
                  <InputText id="name" v-model="profileForm.name" />
                </div>
                <div class="flex flex-col gap-2">
                  <label for="email" class="font-bold text-gray-300">Email de contact</label>
                  <InputText id="email" v-model="profileForm.email" />
                </div>
                <div class="flex flex-col gap-2">
                  <label for="phone" class="font-bold text-gray-300">Téléphone</label>
                  <InputText id="phone" v-model="profileForm.phone" />
                </div>
                <div class="flex flex-col gap-2">
                  <label for="category" class="font-bold text-gray-300">Catégorie</label>
                  <Select id="category" v-model="profileForm.category" :options="categoryOptions" optionlabel=" label" optionValue="value" />
                </div>
                <div class="flex flex-col gap-2 md:col-span-2">
                  <label class="font-bold text-gray-300">Description</label>
                  <Editor v-model="profileForm.description" editorStyle="height: 200px" />
                </div>
              </div>
              <div class="mt-6 flex justify-end">
                <Button label=" Sauvegarder le profil" icon="pi pi-check" severity="success" @click="saveProfile" />
              </div>
            </div>
          </TabPanel>

          <!-- Onglet Prestations -->
          <TabPanel value="1">
            <div class="g-panel p-6 mt-4">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-purple-400 uppercase">Liste de mes prestations</h2>
                <Button label=" Nouvelle Prestation" icon="pi pi-plus" severity="secondary" @click="openPrestationDialog()" />
              </div>

              <DataTable :value="mesPrestations" responsiveLayout="scroll" class="p-datatable-sm">
                <Column field="name" header="Nom"></Column>
                <Column field="Champ1" header="Zone"></Column>
                <Column field="category" header="Catégorie"></Column>
                <Column header="Actions" style="width: 12rem">
                  <template #body="slotProps">
                    <Button icon="pi pi-external-link" rounded text severity="help" class="mr-2" @click="router.push({ name: 'PrestationDetail', params: { id: slotProps.data.id } })" />
                    <Button icon="pi pi-pencil" rounded text severity="info" class="mr-2" @click="openPrestationDialog(slotProps.data)" />
                    <Button icon="pi pi-trash" rounded text severity="danger" @click="confirmDeletePrestation(slotProps.data)" />
                  </template>
                </Column>
              </DataTable>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>

    <!-- Dialogue Edition Prestation -->
    <Dialog v-model:visible="prestationDialog" :header="editingPrestation ? 'Modifier Prestation' : 'Nouvelle Prestation'" :modal="true" class="p-fluid" style="width: 50vw">
      <div class="grid grid-cols-1 gap-4">
        <div class="flex flex-col gap-2">
          <label for="presta-name" class="font-bold">Nom</label>
          <InputText id="presta-name" v-model="prestationForm.name" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="presta-zone" class="font-bold">Zone / Emplacement</label>
          <InputText id="presta-zone" v-model="prestationForm.Champ1" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="presta-cat" class="font-bold">Catégorie</label>
          <Select id="presta-cat" v-model="prestationForm.category" :options="categoryOptions" optionlabel=" label" optionValue="value" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-bold">Description détaillée</label>
          <Editor v-model="prestationForm.description" editorStyle="height: 150px" />
        </div>
      </div>
      <template #footer>
        <Button label=" Annuler" icon="pi pi-times" text @click="prestationDialog = false" />
        <Button label=" Enregistrer" icon="pi pi-check" severity="primary" @click="savePrestation" />
      </template>
    </Dialog>

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore.js';
import { prestataires, prestations, categoryOptions } from '@/datasource/data.js';
import { 
  Tabs, TabList, Tab, TabPanels, TabPanel, 
  InputText, Button, Select,
  DataTable, Column, Dialog, Message,
  Toast, ConfirmDialog 
} from 'primevue';
import Editor from 'primevue/editor'

import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const confirm = useConfirm();

const prestataire = ref(null);
const mesPrestations = ref([]);

// Formulaire Profil
const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  category: '',
  description: ''
});

// Formulaire Prestation
const prestationDialog = ref(false);
const editingPrestation = ref(null);
const prestationForm = reactive({
  name: '',
  Champ1: '',
  category: '',
  description: ''
});

onMounted(() => {
  if (authStore.user) {
    // On cherche le prestataire lié à l'email de l'utilisateur connecté
    const found = prestataires.find(p => p.email === authStore.user.email);
    if (found) {
      prestataire.value = found;
      Object.assign(profileForm, found);
      loadPrestations();
    }
  }
});

function loadPrestations() {
  if (prestataire.value) {
    mesPrestations.value = prestations.filter(p => p.prestataireId === prestataire.value.id);
  }
}

function saveProfile() {
  if (prestataire.value) {
    // Simuler la mise à jour dans la "DB" locale
    const index = prestataires.findIndex(p => p.id === prestataire.value.id);
    if (index !== -1) {
      prestataires[index] = { ...prestataire.value, ...profileForm };
      prestataire.value = prestataires[index];
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Profil mis à jour', life: 3000 });
    }
  }
}

function openPrestationDialog(data = null) {
  if (data) {
    editingPrestation.value = data;
    Object.assign(prestationForm, data);
  } else {
    editingPrestation.value = null;
    prestationForm.name = '';
    prestationForm.Champ1 = '';
    prestationForm.category = prestataire.value?.category || '';
    prestationForm.description = '';
  }
  prestationDialog.value = true;
}

function savePrestation() {
  if (editingPrestation.value) {
    // Edition
    const index = prestations.findIndex(p => p.id === editingPrestation.value.id);
    if (index !== -1) {
      prestations[index] = { ...editingPrestation.value, ...prestationForm };
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Prestation modifiée', life: 3000 });
    }
  } else {
    // Création
    const newPresta = {
      id: Math.max(...prestations.map(p => p.id)) + 1,
      ...prestationForm,
      prestataireId: prestataire.value.id
    };
    prestations.push(newPresta);
    toast.add({ severity: 'success', summary: 'Succès', detail: 'Nouvelle prestation ajoutée', life: 3000 });
  }
  loadPrestations();
  prestationDialog.value = false;
}

function confirmDeletePrestation(data) {
  confirm.require({
    message: `Voulez-vous vraiment supprimer la prestation "${data.name}" ?`,
    header: 'Confirmation de suppression',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      const index = prestations.findIndex(p => p.id === data.id);
      if (index !== -1) {
        prestations.splice(index, 1);
        loadPrestations();
        toast.add({ severity: 'info', summary: 'Supprimé', detail: 'Prestation supprimée', life: 3000 });
      }
    }
  });
}
</script>