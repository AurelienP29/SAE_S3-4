<!-- Prestataire View — Revamped Layout -->

<template>
  <div class="prestataire-shell">

    <!-- Not connected/prestataire state -->
    <div v-if="!prestataire" class="empty-state">
      <i class="pi pi-lock empty-icon"></i>
      <p>{{ lang('prestataire.error') }}</p>
      <button class="necro-btn" @click="router.push('/')">
        <i class="pi pi-home"></i> {{ lang('home.return') }}
      </button>
    </div>

    <template v-else>
      <!-- ========== SIDEBAR ========== -->
      <aside class="prestataire-sidebar" :class="{ collapsed: sidebarCollapsed }">

        <!-- Avatar & info -->
        <div class="sidebar-profile">
          <div class="profile-avatar">
            <Avatar 
              v-if="profileForm.picture || authStore.user?.picture" 
              :image="profileForm.picture || authStore.user?.picture" 
              shape="circle" 
              class="avatar-img" 
            />
            <div v-else class="avatar-initials">
              {{ prestataire.name?.charAt(0)?.toUpperCase() }}
            </div>
          </div>
          <Transition name="fade-label">
            <div v-if="!sidebarCollapsed" class="profile-info">
              <span class="profile-name">{{ prestataire.name }}</span>
              <span class="profile-role">Prestataire</span>
            </div>
          </Transition>
        </div>

        <!-- Collapse toggle -->
        <button
          class="sidebar-collapse-btn"
          @click="sidebarCollapsed = !sidebarCollapsed"
          :title="sidebarCollapsed ? 'Ouvrir' : 'Réduire'"
        >
          <i class="pi" :class="sidebarCollapsed ? 'pi-chevron-right' : 'pi-chevron-left'"></i>
        </button>

        <!-- Nav items -->
        <nav class="sidebar-nav">
          <div
            v-for="item in navItems"
            :key="item.key"
            class="nav-item"
            :class="{ active: activeSection === item.key }"
            @click="activeSection = item.key"
            :title="item.label"
          >
            <div class="nav-icon">
              <i :class="'pi ' + item.icon"></i>
            </div>
            <Transition name="fade-label">
              <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
            </Transition>
            <Transition name="fade-label">
              <span v-if="!sidebarCollapsed && activeSection === item.key" class="nav-active-dot"></span>
            </Transition>
          </div>
        </nav>

        <!-- Footer -->
        <div class="sidebar-footer" v-if="!sidebarCollapsed">
          <button class="logout-btn" @click="router.push('/')">
            <i class="pi pi-arrow-left"></i>
            <span>Retour au site</span>
          </button>
        </div>
      </aside>

      <!-- ========== MAIN CONTENT ========== -->
      <main class="prestataire-main">
        
        <!-- Topbar -->
        <header class="prestataire-topbar">
          <div class="topbar-left">
            <h1 class="topbar-title">{{ currentItem?.label }}</h1>
          </div>
        </header>

        <!-- Content -->
        <div class="prestataire-content">
          <div class="content-card">
            <Transition name="section-fade" mode="out-in">
              <div :key="activeSection">

                <!-- ===== PROFIL ===== -->
                <div v-if="activeSection === 'profil'">
                  <div class="form-grid">
                    <div class="form-field">
                      <label for="name">{{ lang('prestataire.name') }}</label>
                      <InputText id="name" v-model="profileForm.name" class="w-full" />
                    </div>
                    <div class="form-field">
                      <label for="email">{{ lang('prestataire.email') }}</label>
                      <InputText id="email" v-model="profileForm.email" disabled class="w-full disabled-input" />
                    </div>
                    <div class="form-field">
                      <label for="phone">{{ lang('prestataire.phone') }}</label>
                      <InputText id="phone" v-model="profileForm.phone" class="w-full" />
                    </div>
                    <div class="form-field">
                      <label for="category">{{ lang('prestataire.category') }}</label>
                      <Select 
                        id="category" 
                        v-model="profileForm.category" 
                        :options="translatedCategoryOptions"
                        optionLabel="label" 
                        optionValue="value" 
                        class="w-full"
                      />
                    </div>
                    <div class="form-field form-field--full">
                      <label>{{ lang('prestataire.description') }}</label>
                      <Editor v-model="profileForm.description" editorStyle="height: 200px" />
                    </div>
                  </div>
                  <div class="form-actions">
                    <Button 
                      :label="' ' + lang('prestataire.saveProfile')" 
                      icon="pi pi-check" 
                      severity="success"
                      @click="saveProfile" 
                    />
                  </div>
                </div>

                <!-- ===== PRESTATIONS ===== -->
                <div v-else-if="activeSection === 'prestations'">
                  <div class="flex justify-between items-center mb-6">
                    <h2 class="section-subtitle">{{ lang('prestataire.servicesList') }}</h2>
                    <Button 
                      :label="' ' + lang('prestataire.newService')" 
                      icon="pi pi-plus" 
                      severity="secondary"
                      @click="openPrestationDialog()" 
                    />
                  </div>

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

                <!-- ===== AVIS ===== -->
                <div v-else-if="activeSection === 'avis'">
                  <h2 class="section-subtitle mb-6">{{ lang('prestataire.reviewsTitle') }}</h2>

                  <div v-if="mesAvis.length > 0" class="reviews-list">
                    <div v-for="review in mesAvis" :key="review.id" class="review-card">
                      <div class="review-header">
                        <div class="flex items-center gap-3">
                          <Avatar :label="review.userName.charAt(0).toUpperCase()" shape="circle" class="bg-purple-600 text-white" />
                          <div>
                            <div class="font-bold text-gray-800">{{ review.userName }}</div>
                            <div class="text-xs text-gray-500">
                              Sur 
                              <router-link :to="'/prestation/' + review.prestationId" class="text-purple-600 no-underline font-bold">
                                {{ getPrestationName(review.prestationId) }}
                              </router-link>
                              • {{ review.date }}
                            </div>
                          </div>
                        </div>
                        <div class="flex flex-col items-end gap-2">
                          <Rating v-model="review.rating" readonly :cancel="false"/>
                          <Button icon="pi pi-trash" text rounded severity="danger" size="small" @click="confirmDeleteReview(review.id)"/>
                        </div>
                      </div>
                      <p class="review-comment">"{{ review.comment }}"</p>
                    </div>
                  </div>
                  <div v-else class="reviews-empty">
                    <i class="pi pi-comment"></i>
                    <span>{{ lang('prestataire.noReviews') }}</span>
                  </div>
                </div>

                <!-- ===== STAND ===== -->
                <div v-else-if="activeSection === 'stand'">
                  <h2 class="section-subtitle mb-4">Gestion de mon emplacement</h2>

                  <div v-if="loadingStand" class="text-center p-4">
                    <i class="pi pi-spin pi-spinner text-2xl text-purple-600"></i>
                  </div>

                  <div v-else>
                    <div v-if="myStand && myStand.status === 'occupied'" class="stand-status-card status-success">
                      <h3 class="font-bold"><i class="pi pi-check-circle mr-2"></i>Emplacement Validé</h3>
                      <p>Votre stand : <strong>{{ myStand.label || myStand.zone_id }}</strong></p>
                    </div>

                    <div v-else-if="myStand && myStand.status === 'pending'" class="stand-status-card status-warning flex justify-between items-center">
                      <div>
                        <h3 class="font-bold"><i class="pi pi-clock mr-2"></i>Demande en attente</h3>
                        <p>Emplacement demandé : <strong>{{ myStand.label || myStand.zone_id }}</strong></p>
                      </div>
                      <Button label="Annuler" icon="pi pi-times" severity="danger" size="small" @click="cancelMyRequest"/>
                    </div>

                    <div v-else class="stand-status-card status-info">
                      <h3 class="font-bold"><i class="pi pi-map mr-2"></i>Réserver</h3>
                      <p>Cliquez sur un emplacement vert pour faire une demande.</p>
                    </div>

                    <div class="map-container-wrapper">
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

                <!-- ===== PAGE PUBLIQUE ===== -->
                <div v-else-if="activeSection === 'public'">
                  <div class="flex justify-between items-center mb-6">
                    <h2 class="section-subtitle">{{ lang('prestataire.public_page_title') || 'Personnalisation de ma page publique' }}</h2>
                    <Button 
                      :label="lang('view_page') || 'Voir ma page'" 
                      icon="pi pi-external-link" 
                      text 
                      @click="router.push({ name: 'PrestatairePublic', params: { id: prestataire.id } })" 
                    />
                  </div>

                  <div class="form-grid" style="grid-template-columns: 1fr;">
                    <div class="form-field">
                      <label>{{ lang('prestataire.public_text') || 'Texte de présentation personnalisé' }}</label>
                      <Editor v-model="profileForm.publicPageText" editorStyle="height: 300px"/>
                    </div>

                    <div class="form-field">
                      <label>{{ lang('prestataire.public_images') || 'Images (URLs séparées par des virgules)' }}</label>
                      <Textarea v-model="publicPageImagesRaw" rows="3" placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" class="w-full" />
                      <small class="text-gray-500 mt-1">Ajoutez des liens vers vos images pour illustrer votre page.</small>
                    </div>
                    
                    <div class="form-actions">
                      <Button :label="lang('prestataire.saveProfile')" icon="pi pi-check" severity="success" @click="saveProfile" />
                    </div>
                  </div>
                </div>

              </div>
            </Transition>
          </div>
        </div>
      </main>

      <!-- DIALOG PRESTATION -->
      <Dialog 
        v-model:visible="prestationDialog"
        :header="editingPrestation ? lang('prestataire.editService') : lang('prestataire.newService')" 
        :modal="true"
        class="p-fluid necro-dialog" 
        style="width: 600px"
      >
        <div class="form-grid" style="grid-template-columns: 1fr; gap: 1rem; margin-top: 0.5rem;">
          <div class="form-field">
            <label for="presta-name">{{ lang('prestataire.colName') }}</label>
            <InputText id="presta-name" v-model="prestationForm.name" />
          </div>
          <div class="form-field">
            <label for="presta-zone">{{ lang('prestataire.zoneLabel') }}</label>
            <InputText id="presta-zone" v-model="prestationForm.Champ1" />
          </div>
          <div class="form-field">
            <label for="presta-cat">{{ lang('prestataire.colCategory') }}</label>
            <Select 
              id="presta-cat" 
              v-model="prestationForm.category" 
              :options="translatedCategoryOptions"
              optionLabel="label" 
              optionValue="value" 
            />
          </div>
          <div class="form-field">
            <label>{{ lang('prestataire.detailLabel') }}</label>
            <Editor v-model="prestationForm.description" editorStyle="height: 150px" />
          </div>
        </div>
        <template #footer>
          <Button :label="' ' + lang('cancel')" icon="pi pi-times" text @click="prestationDialog = false"/>
          <Button :label="' ' + lang('save')" icon="pi pi-check" severity="primary" @click="savePrestation"/>
        </template>
      </Dialog>
    </template>

    <Toast/>
    <ConfirmDialog/>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore.js';
import { useReviewStore } from '@/stores/reviewStore.js';
import { categoryOptions, prestations, prestataires } from '@/datasource/data.mjs';
import { usePrestataireStore } from '@/stores/prestataire.js';
import { translations } from '@/datasource/lang.js';

import {
  InputText, Button, Select, DataTable, Column, Dialog, 
  Textarea, Toast, ConfirmDialog, Rating, Avatar
} from 'primevue';
import Editor from 'primevue/editor';

import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import StandService from '@/services/standService';
import InteractiveMap from '@/components/InteractiveMap.vue';

const router = useRouter();
const authStore = useAuthStore();
const prestataireStore = usePrestataireStore();
const reviewStore = useReviewStore();
const toast = useToast();
const confirm = useConfirm();

const lang = (key) => translations[authStore.currentLanguage]?.[key] || key;

const translatedCategoryOptions = computed(() => categoryOptions.map(opt => ({
  ...opt,
  label: lang(`category.${opt.value}`)
})));

const prestataire = ref(null);
const mesPrestations = ref([]);

const sidebarCollapsed = ref(false);
const activeSection = ref('profil');

const navItems = computed(() => [
  { key: 'profil',      icon: 'pi-user',        label: lang('profile') },
  { key: 'prestations', icon: 'pi-box',         label: lang('prestataire.services') },
  { key: 'avis',        icon: 'pi-comments',    label: lang('prestataire.reviews') },
  { key: 'stand',       icon: 'pi-map-marker',  label: lang('prestataire.stand') },
  { key: 'public',      icon: 'pi-globe',       label: lang('prestataire.public_page') || 'Page Publique' }
]);

const currentItem = computed(() => navItems.value.find(i => i.key === activeSection.value));

const mesAvis = computed(() => {
  if (!prestataire.value) return [];
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
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      reviewStore.deleteReview(id);
      toast.add({ severity: 'info', summary: 'Supprimé', detail: "L'avis a été supprimé", life: 3000 });
    }
  });
}

const profileForm = reactive({
  name: '', email: '', phone: '', category: '', 
  description: '', publicPageText: '', publicPageImages: []
});
const publicPageImagesRaw = ref('');

const prestationDialog = ref(false);
const editingPrestation = ref(null);
const prestationForm = reactive({ name: '', Champ1: '', category: '', description: '' });

onMounted(async () => {
  if (authStore.user) {
    // Si l'utilisateur n'est pas un prestataire (rôle), on ne cherche pas plus loin
    if (authStore.user.role !== 'prestataire' && !authStore.user.roles?.includes('prestataire')) {
      return;
    }

    // On essaie de récupérer le prestataire depuis le store (qui interroge le backend)
    await prestataireStore.fetchPrestataires();
    const found = prestataireStore.prestataires.find(p => p.email === authStore.user.email);
    
    if (found) {
      prestataire.value = found;
      Object.assign(profileForm, found);
      publicPageImagesRaw.value = found.publicPageImages ? found.publicPageImages.join(', ') : '';
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

async function saveProfile() {
  if (prestataire.value) {
    profileForm.publicPageImages = publicPageImagesRaw.value.split(',').map(s => s.trim()).filter(s => s !== '');
    
    try {
      await prestataireStore.updatePrestataire({ ...prestataire.value, ...profileForm });
      prestataire.value = { ...prestataire.value, ...profileForm };
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Profil mis à jour', life: 3000 });
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      toast.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de mettre à jour le profil', life: 3000 });
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
    const index = prestations.findIndex(p => p.id === editingPrestation.value.id);
    if (index !== -1) {
      prestations[index] = { ...editingPrestation.value, ...prestationForm };
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Prestation modifiée', life: 3000 });
    }
  } else {
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
    header: 'Confirmation',
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
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger le stand' });
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
      toast.add({ severity: 'info', summary: 'Annulé', detail: 'Demande annulée' });
      await loadMyStandData();
    }
  });
}
</script>

<style scoped>
@import '@/assets/main.css';

/* ============================================================
   SHELL (Light beige theme synchronized with Account/Admin)
   ============================================================ */
.prestataire-shell {
  display: flex;
  min-height: 100vh;
  background: var(--necro-bg); /* Sera géré par index au besoin, transparent ici */
  font-family: 'Rajdhani', sans-serif;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 1.5rem;
  color: #6c6c6c;
}
.empty-icon { font-size: 3.5rem; color: #a855f7; }

/* ============================================================
   SIDEBAR
   ============================================================ */
.prestataire-sidebar {
  width: 240px;
  min-height: 100vh;
  background: rgba(243, 240, 236, 0.69);
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  flex-shrink: 0;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  z-index: 100;
}
.prestataire-sidebar.collapsed { width: 64px; }

/* Profile area */
.sidebar-profile {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.5rem 1.1rem 1.2rem;
  border-bottom: 1px solid var(--glass-border);
  overflow: hidden;
}

.profile-avatar { flex-shrink: 0; }
.avatar-img { width: 44px !important; height: 44px !important; }
.avatar-initials {
  width: 44px; height: 44px; border-radius: 50%;
  background: linear-gradient(135deg, var(--necro-purple), #6d28d9);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; font-weight: 700; color: white;
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.4);
}

.profile-info {
  display: flex; flex-direction: column; overflow: hidden; white-space: nowrap;
}
.profile-name {
  font-size: 0.95rem; font-weight: 700; color: #6c6c6c;
  overflow: hidden; text-overflow: ellipsis;
}
.profile-role {
  font-size: 0.72rem; color: var(--necro-text-muted); text-transform: capitalize;
}

/* Collapse btn */
.sidebar-collapse-btn {
  position: absolute; top: 1.4rem; right: -13px;
  width: 26px; height: 26px; border-radius: 50%;
  border: 1px solid var(--glass-border);
  background: var(--necro-surface, #bdbdbd);
  color: var(--necro-text-muted);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 0.65rem; z-index: 10;
  transition: all 0.2s;
}
.sidebar-collapse-btn:hover {
  background: var(--necro-purple); color: white;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
}

/* Nav */
.sidebar-nav {
  flex: 1; padding: 1rem 0.6rem;
  display: flex; flex-direction: column; gap: 0.3rem;
  overflow: hidden;
}

.nav-item {
  display: flex; align-items: center; gap: 0.85rem;
  padding: 0.75rem 0.85rem; border-radius: 10px;
  cursor: pointer; color: var(--necro-text-muted);
  position: relative; overflow: hidden; white-space: nowrap;
  transition: all 0.2s;
}
.nav-item::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(168, 85, 247, 0.12), transparent);
  opacity: 0; transition: opacity 0.2s;
}
.nav-item:hover { color: #505050; background: rgba(118, 76, 158, 0.08); }
.nav-item:hover::before { opacity: 1; }

.nav-item.active {
  background: rgba(101, 60, 140, 0.18); color: #423053;
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.18);
}
.nav-item.active::before { opacity: 1; }

.nav-icon {
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; font-size: 1rem; border-radius: 8px;
}
.nav-item.active .nav-icon {
  background: rgba(168, 85, 247, 0.25); color: var(--necro-purple);
}

.nav-label { font-size: 0.95rem; font-weight: 600; flex: 1; overflow: hidden; text-overflow: ellipsis; }
.nav-active-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--necro-purple); box-shadow: 0 0 6px var(--necro-purple); flex-shrink: 0;
}

/* Footer */
.sidebar-footer {
  padding: 1rem 0.85rem; border-top: 1px solid var(--glass-border); overflow: hidden;
}
.logout-btn {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.6rem 0.75rem; border-radius: 8px;
  border: 1px solid var(--glass-border);
  background: rgba(0,0,0,0.03); color: #6c6c6c;
  cursor: pointer; font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem; font-weight: 600; width: 100%; transition: all 0.2s;
}
.logout-btn:hover { background: rgba(0,0,0,0.08); color: #000; }

/* ============================================================
   MAIN CONTENT
   ============================================================ */
.prestataire-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

/* Topbar */
.prestataire-topbar {
  display: flex; align-items: flex-end; justify-content: space-between;
  padding: 1.5rem 2rem 1rem; border-bottom: 1px solid var(--glass-border);
  background: rgba(232, 226, 221, 0.75); backdrop-filter: blur(8px);
}
.topbar-title {
  font-family: 'Rajdhani', sans-serif; font-size: 1.6rem; font-weight: 800;
  color: #424242; margin: 0; letter-spacing: 0.02em; text-transform: uppercase;
}
.section-subtitle {
  font-family: 'Rajdhani', sans-serif; font-size: 1.2rem; font-weight: 700;
  color: #6c6c6c; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;
}

/* Content Area */
.prestataire-content { flex: 1; padding: 2rem; overflow-y: auto; }
.content-card {
  background: rgba(237, 233, 229, 0.75); border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg, 16px); padding: 2.5rem; min-height: 60vh;
  backdrop-filter: blur(6px); box-shadow: 0 4px 20px rgba(0,0,0,0.03);
}

/* ============================================================
   FORMS & LAYOUT
   ============================================================ */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.form-field { display: flex; flex-direction: column; gap: 0.5rem; }
.form-field label {
  font-size: 0.85rem; font-weight: 700; color: #6c6c6c;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.form-field--full { grid-column: 1 / -1; }
.disabled-input { opacity: 0.6; }
.form-actions {
  display: flex; justify-content: flex-end; margin-top: 1.5rem;
  padding-top: 1.25rem; border-top: 1px solid var(--glass-border);
}

/* ============================================================
   REVIEWS
   ============================================================ */
.reviews-list { display: flex; flex-direction: column; gap: 1rem; }
.review-card {
  background: rgba(255,255,255,0.4); border: 1px solid rgba(0,0,0,0.05);
  border-radius: 12px; padding: 1.25rem; transition: transform 0.2s;
}
.review-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.review-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
.review-comment { font-size: 0.95rem; color: #424242; font-style: italic; margin: 0; line-height: 1.5; }
.reviews-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;
  padding: 3rem; background: rgba(255,255,255,0.3); border: 1px dashed var(--glass-border);
  border-radius: 12px; color: #888; font-style: italic;
}
.reviews-empty i { font-size: 2rem; color: #ccc; }

/* ============================================================
   STANDS
   ============================================================ */
.stand-status-card {
  padding: 1.25rem 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;
  display: flex; flex-direction: column; gap: 0.25rem;
}
.stand-status-card h3 { margin: 0; font-size: 1.1rem; }
.stand-status-card p { margin: 0; font-size: 0.95rem; color: #555; }
.status-success { background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); }
.status-success h3 { color: #16a34a; }
.status-success strong { color: #15803d; }
.status-warning { background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.3); }
.status-warning h3 { color: #ea580c; }
.status-warning strong { color: #c2410c; }
.status-info { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); }
.status-info h3 { color: #2563eb; }
.map-container-wrapper {
  border: 1px solid var(--glass-border); border-radius: 12px; overflow: hidden; height: 500px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

/* ============================================================
   TRANSITIONS
   ============================================================ */
.section-fade-enter-active, .section-fade-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.section-fade-enter-from { opacity: 0; transform: translateY(10px); }
.section-fade-leave-to { opacity: 0; transform: translateY(-10px); }
.fade-label-enter-active, .fade-label-leave-active { transition: opacity 0.15s ease; }
.fade-label-enter-from, .fade-label-leave-to { opacity: 0; }

/* ============================================================
   DEEP OVERRIDES (Light Theme)
   ============================================================ */
:deep(.p-inputtext), :deep(.p-textarea) {
  background: rgba(255, 255, 255, 0.7) !important;
  border-color: rgba(0,0,0,0.1) !important; color: #333 !important;
  font-family: 'Rajdhani', sans-serif !important; border-radius: 8px !important;
}
:deep(.p-inputtext:focus), :deep(.p-textarea:focus) {
  border-color: var(--necro-purple) !important; box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
}
:deep(.p-select) {
  background: rgba(255, 255, 255, 0.7) !important; border-color: rgba(0,0,0,0.1) !important; color: #333 !important;
}
:deep(.p-editor-container) { border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
:deep(.p-editor-toolbar) { background: rgba(245,245,245,0.8); border-bottom: 1px solid rgba(0,0,0,0.05); }

:deep(.p-datatable-thead > tr > th) {
  background: rgba(0, 0, 0, 0.03) !important; color: #666 !important;
  font-family: 'Rajdhani', sans-serif !important; font-size: 0.85rem !important;
  text-transform: uppercase; letter-spacing: 0.05em; border-color: rgba(0,0,0,0.08) !important;
}
:deep(.p-datatable-tbody > tr) {
  background: transparent !important; color: #222 !important;
  border-color: rgba(0,0,0,0.05) !important; font-family: 'Rajdhani', sans-serif !important;
}
:deep(.p-datatable-tbody > tr:hover) { background: rgba(168,85,247,0.04) !important; }

/* Dialog Dark Overrides pour l'édition */
:deep(.necro-dialog .p-dialog-header) {
  background: rgba(20, 17, 38, 0.98) !important; color: #f1f5f9 !important;
  font-family: 'Rajdhani', sans-serif !important;
}
:deep(.necro-dialog .p-dialog-content) {
  background: rgba(20, 17, 38, 0.98) !important; color: #f1f5f9 !important;
}
:deep(.necro-dialog .p-dialog-footer) {
  background: rgba(20, 17, 38, 0.98) !important; border-top: 1px solid rgba(255,255,255,0.05);
}
:deep(.necro-dialog label) { color: #a1a1aa !important; }
:deep(.necro-dialog .p-inputtext), :deep(.necro-dialog .p-select) {
  background: rgba(11, 9, 20, 0.7) !important; border-color: rgba(255,255,255,0.1) !important; color: white !important;
}
</style>