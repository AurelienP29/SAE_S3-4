<template>
  <div class="prestataire-view-container p-4">
    <div v-if="!prestataire" class="flex flex-col items-center justify-center h-64">
      <Message severity="warn">{{ lang('prestataire.error') }}</Message>
      <Button :label="' ' + lang('home.return')" icon="pi pi-home" @click="router.push('/')" class="mt-4"/>
    </div>

    <div v-else>
      <h1 class="text-3xl font-bold mb-6 text-white uppercase tracking-wider">{{ lang('prestataire.space.title') }}
        {{ prestataire.name }}</h1>

      <Tabs value="0">
        <TabList>
          <Tab value="0">
            <i class="pi pi-user mr-2"></i>{{ lang('profile') }}
          </Tab>
          <Tab value="1">
            <i class="pi pi-box mr-2"></i>{{ lang('prestataire.services') }}
          </Tab>
          <Tab value="2">
            <i class="pi pi-comments mr-2"></i>{{ lang('prestataire.reviews') }}
          </Tab>
          <Tab value="3">
            <i class="pi pi-map-marker mr-2"></i>{{ lang('prestataire.stand') }}
          </Tab>
        </TabList>
        <TabPanels>
          <!-- tab Profil -->
          <TabPanel value="0">
            <div class="g-panel p-6 mt-4">
              <h2 class="text-xl font-bold mb-4 text-purple-400 uppercase">{{ lang('prestataire.info') }}</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <label for="name" class="font-bold text-gray-300">{{ lang('prestataire.name') }}</label>
                  <InputText id="name" v-model="profileForm.name"/>
                </div>
                <div class="flex flex-col gap-2">
                  <label for="email" class="font-bold text-gray-300">{{ lang('prestataire.email') }}</label>
                  <InputText id="email" v-model="profileForm.email"/>
                </div>
                <div class="flex flex-col gap-2">
                  <label for="phone" class="font-bold text-gray-300">{{ lang('prestataire.phone') }}</label>
                  <InputText id="phone" v-model="profileForm.phone"/>
                </div>
                <div class="flex flex-col gap-2">
                  <label for="category" class="font-bold text-gray-300">{{ lang('prestataire.category') }}</label>
                  <Select id="category" v-model="profileForm.category" :options="translatedCategoryOptions"
                          optionLabel="label" optionValue="value"/>
                </div>
                <div class="flex flex-col gap-2 md:col-span-2">
                  <label class="font-bold text-gray-300">{{ lang('prestataire.description') }}</label>
                  <Editor v-model="profileForm.description" editorStyle="height: 200px"/>
                </div>
              </div>
              <div class="mt-6 flex justify-end">
                <Button :label="' ' + lang('prestataire.saveProfile')" icon="pi pi-check" severity="success"
                        @click="saveProfile"/>
              </div>
            </div>
          </TabPanel>

          <!-- tab Prestations !-->
          <TabPanel value="1">
            <div class="g-panel p-6 mt-4">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-purple-400 uppercase">{{ lang('prestataire.servicesList') }}</h2>
                <Button :label="' ' + lang('prestataire.newService')" icon="pi pi-plus" severity="secondary"
                        @click="openPrestationDialog()"/>
              </div>

              <!--
              <table>
                <tr v-for="p in mesPrestations"><td>{{ p.name }}</td></tr>
              </table>
              !-->

              <DataTable :value="mesPrestations" responsiveLayout="scroll" class="p-datatable-sm">
                <Column field="name" :header="lang('prestataire.colName')"></Column>
                <Column field="Champ1" :header="lang('prestataire.colZone')"></Column>
                <Column field="category" :header="lang('prestataire.colCategory')">
                  <template #body="slotProps">
                    {{ lang('category.' + slotProps.data.category) }}
                  </template>
                </Column>
                <Column :header="lang('admin.action')" style="width: 12rem">
                  <template #body="slotProps">
                    <Button icon="pi pi-external-link" rounded text severity="help" class="mr-2"
                            @click="router.push({ name: 'PrestationDetail', params: { id: slotProps.data.id } })"/>
                    <Button icon="pi pi-pencil" rounded text severity="info" class="mr-2"
                            @click="openPrestationDialog(slotProps.data)"/>
                    <Button icon="pi pi-trash" rounded text severity="danger"
                            @click="confirmDeletePrestation(slotProps.data)"/>
                  </template>
                </Column>
              </DataTable>
            </div>
          </TabPanel>

          <!-- tab Avis -->
          <TabPanel value="2">
            <div class="g-panel p-6 mt-4">
              <h2 class="text-xl font-bold text-purple-400 uppercase mb-6">{{ lang('prestataire.reviewsTitle') }}</h2>

              <div v-if="mesAvis.length > 0" class="flex flex-col gap-4">
                <div v-for="review in mesAvis" :key="review.id"
                     class="p-4 rounded-lg bg-black/20 border border-purple-500/20">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-3">
                      <Avatar :label="review.userName.charAt(0).toUpperCase()" shape="circle"
                              class="bg-purple-600 text-white"/>
                      <div>
                        <div class="font-bold text-white">{{ review.userName }}</div>
                        <div class="text-xs text-gray-500">
                          Sur
                          <router-link :to="'/prestation/' + review.prestationId" class="text-purple-400 no-underline">
                            {{ getPrestationName(review.prestationId) }}
                          </router-link>
                          • {{ review.date }}
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                      <Rating v-model="review.rating" readonly :cancel="false"/>
                      <Button icon="pi pi-trash" text rounded severity="danger" size="small"
                              @click="confirmDeleteReview(review.id)"/>
                    </div>
                  </div>
                  <p class="text-gray-300 italic m-0">"{{ review.comment }}"</p>
                </div>
              </div>
              <div v-else class="text-gray-500 italic p-8 text-center bg-black/10 rounded">
                {{ lang('prestataire.noReviews') }}
              </div>
            </div>
          </TabPanel>

          <!-- Tab Stand -->
          <TabPanel value="3">
            <div class="g-panel p-6 mt-4">
              <h2 class="text-xl font-bold text-purple-400 uppercase mb-4">Gestion de mon emplacement</h2>

              <div v-if="loadingStand" class="text-center p-4">
                <i class="pi pi-spin pi-spinner text-2xl"></i>
              </div>

              <div v-else>
                <div v-if="myStand && myStand.status === 'occupied'"
                     class="mb-6 p-4 rounded bg-green-900/30 border border-green-500/50">
                  <h3 class="text-green-400 font-bold"><i class="pi pi-check-circle mr-2"></i>Emplacement Validé</h3>
                  <p class="text-gray-300">Votre stand : <strong class="text-white">{{
                      myStand.label || myStand.zone_id
                    }}</strong></p>
                </div>

                <div v-else-if="myStand && myStand.status === 'pending'"
                     class="mb-6 p-4 rounded bg-orange-900/30 border border-orange-500/50 flex justify-between items-center">
                  <div>
                    <h3 class="text-orange-400 font-bold"><i class="pi pi-clock mr-2"></i>Demande en attente</h3>
                    <p class="text-gray-300">Emplacement demandé : <strong>{{
                        myStand.label || myStand.zone_id
                      }}</strong></p>
                  </div>
                  <Button label="Annuler" icon="pi pi-times" severity="danger" size="small" @click="cancelMyRequest"/>
                </div>

                <div v-else class="mb-6 p-4 rounded bg-blue-900/30 border border-blue-500/50">
                  <h3 class="text-blue-400 font-bold"><i class="pi pi-map mr-2"></i>Réserver</h3>
                  <p class="text-gray-300">Cliquez sur un emplacement vert pour faire une demande.</p>
                </div>

                <div class="border border-gray-700 rounded overflow-hidden h-[500px]">
                  <InteractiveMap
                      :current-user="{ id: prestataire.id, ...profileForm, roles: authStore.user?.roles || ['prestataire'] }"
                      :enable-actions="!myStand"
                      :highlight-id="myStand ? myStand.id : null"
                      :key="myStand ? myStand.id : 'free'"
                      @stand-updated="loadMyStandData"
                  />
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>

    <!-- Prestation modif dialog -->
    <Dialog v-model:visible="prestationDialog"
            :header="editingPrestation ? lang('prestataire.editService') : lang('prestataire.newService')" :modal="true"
            class="p-fluid" style="width: 50vw">
      <div class="grid grid-cols-1 gap-4">
        <div class="flex flex-col gap-2">
          <label for="presta-name" class="font-bold">{{ lang('prestataire.colName') }}</label>
          <InputText id="presta-name" v-model="prestationForm.name"/>
        </div>
        <div class="flex flex-col gap-2">
          <label for="presta-zone" class="font-bold">{{ lang('prestataire.zoneLabel') }}</label>
          <InputText id="presta-zone" v-model="prestationForm.Champ1"/>
        </div>
        <div class="flex flex-col gap-2">
          <label for="presta-cat" class="font-bold">{{ lang('prestataire.colCategory') }}</label>
          <Select id="presta-cat" v-model="prestationForm.category" :options="translatedCategoryOptions"
                  optionLabel="label" optionValue="value"/>
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-bold">{{ lang('prestataire.detailLabel') }}</label>
          <Editor v-model="prestationForm.description" editorStyle="height: 150px"/>
        </div>
      </div>
      <template #footer>
        <Button :label="' ' + lang('cancel')" icon="pi pi-times" text @click="prestationDialog = false"/>
        <Button :label="' ' + lang('save')" icon="pi pi-check" severity="primary" @click="savePrestation"/>
      </template>
    </Dialog>

    <Toast/>
    <ConfirmDialog/>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, reactive} from 'vue';
import {useRouter} from 'vue-router';
import {useAuthStore} from '@/stores/authStore.js';
import {useReviewStore} from '@/stores/reviewStore.js';
import {prestataires, prestations, categoryOptions} from '@/datasource/data.js';
import {translations} from '@/datasource/lang.js';
import {
  Tabs, TabList, Tab, TabPanels, TabPanel,
  InputText, Button, Select,
  DataTable, Column, Dialog, Message,
  Toast, ConfirmDialog, Rating, Avatar
} from 'primevue';
import Editor from 'primevue/editor'

import {useToast} from 'primevue/usetoast';
import {useConfirm} from 'primevue/useconfirm';

import StandService from '@/services/standService';
import InteractiveMap from '@/components/InteractiveMap.vue';

const router = useRouter();
const authStore = useAuthStore();
const reviewStore = useReviewStore();
const toast = useToast();
const confirm = useConfirm();

const lang = (key) => {
  return translations[authStore.currentLanguage][key] || key;
};

const translatedCategoryOptions = computed(() => {
  return categoryOptions.map(opt => ({
    ...opt,
    label: lang(`category.${opt.value}`)
  }));
});

const prestataire = ref(null);
const mesPrestations = ref([]);

const mesAvis = computed(() => {
  if (!prestataire.value) return [];
  // return reviewStore.reviews;
  const prestationIds = mesPrestations.value.map(p => p.id);
  return reviewStore.reviews.filter(r => prestationIds.includes(r.prestationId));
});

const getPrestationName = (id) => {
  const p = prestations.find(presta => presta.id === id);
  return p ? p.name : 'Prestation inconnue';
};

function confirmDeleteReview(id) {
  confirm.require({
    message: 'Voulez-vous vraiment supprimer cet avis ?',
    header: 'Confirmation de suppression',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      reviewStore.deleteReview(id);
      toast.add({severity: 'info', summary: 'Supprimé', detail: 'L\'avis a été supprimé', life: 3000});
    }
  });
}


const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  category: '',
  description: ''
});


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
      loadMyStandData();
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

    const index = prestataires.findIndex(p => p.id === prestataire.value.id);
    if (index !== -1) {
      prestataires[index] = {...prestataire.value, ...profileForm};
      prestataire.value = prestataires[index];
      toast.add({severity: 'success', summary: 'Succès', detail: 'Profil mis à jour', life: 3000});
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
      prestations[index] = {...editingPrestation.value, ...prestationForm};
      toast.add({severity: 'success', summary: 'Succès', detail: 'Prestation modifiée', life: 3000});
    }
  } else {
    // Création
    const newPresta = {
      id: Math.max(...prestations.map(p => p.id)) + 1,
      ...prestationForm,
      prestataireId: prestataire.value.id
    };
    prestations.push(newPresta);
    toast.add({severity: 'success', summary: 'Succès', detail: 'Nouvelle prestation ajoutée', life: 3000});
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
        toast.add({severity: 'info', summary: 'Supprimé', detail: 'Prestation supprimée', life: 3000});
      }
    }
  });
}


// Gestion Stand
const myStand = ref(null);
const loadingStand = ref(false);

async function loadMyStandData() {
  if (!prestataire.value) return;
  loadingStand.value = true;
  try {
    const allStands = await StandService.getAllStands();
    myStand.value = allStands.find(s => s.prestataire && s.prestataire.id === prestataire.value.id) || null;
  } catch (e) {
    console.error(e);
    toast.add({severity: 'error', summary: 'Erreur', detail: 'Impossible de charger le stand'});
  } finally {
    loadingStand.value = false;
  }
}

function cancelMyRequest() {
  if (!myStand.value) return;
  confirm.require({
    message: 'Annuler votre demande pour cet emplacement ?',
    header: 'Annulation',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await StandService.updateStatus(myStand.value.id, 'free');
      toast.add({severity: 'info', summary: 'Annulé', detail: 'Demande annulée'});
      await loadMyStandData();
    }
  });
}
</script>