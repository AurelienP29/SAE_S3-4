<!-- Account Management View — Revamped Layout -->

<template>
  <div class="account-shell">

    <!-- ========== SIDEBAR ========== -->
    <aside class="account-sidebar" :class="{ collapsed: sidebarCollapsed }">

      <!-- Avatar & user info -->
      <div class="sidebar-profile">
        <div class="profile-avatar">
          <Avatar
            v-if="profileForm.picture || authStore.user?.picture"
            :image="profileForm.picture || authStore.user?.picture"
            shape="circle"
            class="avatar-img"
          />
          <div v-else class="avatar-initials">
            {{ authStore.user?.name?.charAt(0)?.toUpperCase() }}
          </div>
        </div>
        <Transition name="fade-label">
          <div v-if="!sidebarCollapsed" class="profile-info">
            <span class="profile-name">{{ authStore.user?.name }}</span>
            <span class="profile-role">{{ authStore.user?.role }}</span>
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

      <!-- Logout -->
      <div class="sidebar-footer" v-if="!sidebarCollapsed">
        <button class="logout-btn" @click="handleLogout">
          <i class="pi pi-sign-out"></i>
          <span>{{ lang('logout') }}</span>
        </button>
        <p class="uid-text">{{ lang('account.uid') }}<br><span>{{ authStore.user?.id }}</span></p>
      </div>
    </aside>

    <!-- ========== MAIN CONTENT ========== -->
    <main class="account-main">

      <!-- Not connected state -->
      <div v-if="!authStore.isAuthenticated" class="empty-state">
        <i class="pi pi-lock empty-icon"></i>
        <p>{{ lang('account.notConnected') }}</p>
        <button class="necro-btn" @click="router.push('/login')">
          <i class="pi pi-sign-in"></i> {{ lang('login') }}
        </button>
      </div>

      <template v-else>
        <!-- Topbar -->
        <header class="account-topbar">
          <div class="topbar-left">
            <h1 class="topbar-title">{{ currentItem?.label }}</h1>
          </div>
        </header>

        <!-- Content -->
        <div class="account-content">
          <div class="content-card">
            <Transition name="section-fade" mode="out-in">
              <div :key="activeSection">

                <!-- ===== PROFIL ===== -->
                <div v-if="activeSection === 'profil'">
                  <div class="form-grid">
                    <div class="form-field">
                      <label for="acc-name">{{ lang('account.fullName') }}</label>
                      <InputText id="acc-name" v-model="profileForm.name" class="w-full" />
                    </div>
                    <div class="form-field">
                      <label for="acc-email">{{ lang('account.emailReadOnly') }}</label>
                      <InputText id="acc-email" v-model="profileForm.email" disabled class="w-full disabled-input" />
                    </div>
                    <div class="form-field">
                      <label for="acc-phone">{{ lang('account.phone') }}</label>
                      <InputText id="acc-phone" v-model="profileForm.phone" placeholder="Ex: 06 00 00 00 00" class="w-full" />
                    </div>
                    <div class="form-field">
                      <label for="acc-picture">{{ lang('account.picture') }}</label>
                      <InputText id="acc-picture" v-model="profileForm.picture" placeholder="https://..." class="w-full" />
                    </div>
                    <div class="form-field">
                      <label for="acc-age">Tranche d'âge</label>
                      <Dropdown id="acc-age" v-model="profileForm.ageGroup" :options="ageOptions" placeholder="Sélectionnez..." class="w-full" />
                    </div>
                    <div class="form-field">
                      <label for="acc-gender">Genre</label>
                      <Dropdown id="acc-gender" v-model="profileForm.gender" :options="genderOptions" placeholder="Sélectionnez..." class="w-full" />
                    </div>
                    <div class="form-field">
                      <label for="acc-family">Situation</label>
                      <Dropdown id="acc-family" v-model="profileForm.family" :options="familyOptions" placeholder="Sélectionnez..." class="w-full" />
                    </div>
                    <div class="form-field">
                      <label for="acc-region">Région</label>
                      <Dropdown id="acc-region" v-model="profileForm.geographicRegion" :options="regionOptions" placeholder="Sélectionnez..." class="w-full" />
                    </div>
                    <div class="form-field form-field--full">
                      <label for="acc-desc">{{ lang('account.description') }}</label>
                      <Textarea id="acc-desc" v-model="profileForm.description" rows="4" class="w-full" />
                    </div>
                  </div>
                  <div class="form-actions">
                    <Button
                      :label="lang('account.saveChanges')"
                      icon="pi pi-save"
                      severity="primary"
                      @click="saveProfile"
                      :loading="saving"
                    />
                  </div>

                  <!-- Reviews -->
                  <div class="reviews-section">
                    <h3 class="reviews-title">
                      <i class="pi pi-star-fill text-yellow"></i>
                      {{ lang('account.myReviews') }}
                    </h3>
                    <div v-if="userReviews.length > 0" class="reviews-list">
                      <div v-for="review in userReviews" :key="review.id" class="review-card">
                        <div class="review-header">
                          <div>
                            <router-link :to="'/prestation/' + review.prestationId" class="review-link">
                              {{ getPrestationName(review.prestationId) }}
                            </router-link>
                            <span class="review-date">{{ review.date }}</span>
                          </div>
                          <div class="review-actions">
                            <Rating v-model="review.rating" readonly :cancel="false" />
                            <Button icon="pi pi-pencil" text rounded severity="info" size="small" @click="editReview(review)" />
                            <Button icon="pi pi-trash" text rounded severity="danger" size="small" @click="confirmDeleteReview(review.id)" />
                          </div>
                        </div>
                        <p class="review-comment">"{{ review.comment }}"</p>
                      </div>
                    </div>
                    <div v-else class="reviews-empty">
                      <i class="pi pi-comment"></i>
                      <span>{{ lang('account.noReviews') }}</span>
                    </div>
                  </div>

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
                </div>

                <!-- ===== BILLETS ===== -->
                <div v-else-if="activeSection === 'billets'">
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
                        <div class="qr-code-placeholder"><i class="pi pi-qrcode"></i></div>
                        <div class="ticket-price">{{ ticket.cout }}€</div>
                      </div>
                      <div class="ticket-stub"></div>
                    </div>
                  </div>
                  <div v-else class="empty-section">
                    <i class="pi pi-ticket empty-icon-sm"></i>
                    <p>{{ lang('ticket.empty') }}</p>
                    <Button :label="' ' + lang('ticket.goto')" icon="pi pi-shopping-bag" @click="router.push('/activities')" text />
                  </div>
                </div>

                <!-- ===== ACTIVITES ===== -->
                <div v-else-if="activeSection === 'activites'">
                  <!-- Visiteur -->
                  <div v-if="authStore.user.role === 'visiteur'">
                    <div v-if="authStore.mesReservations.length > 0" class="reservations-list">
                      <div v-for="resa in authStore.mesReservations" :key="resa.id" class="resa-card">
                        <div>
                          <div class="resa-title">{{ resa.activite.titre }}</div>
                          <div class="resa-date">{{ resa.activite.date }} — Réservé le {{ resa.dateReservation }}</div>
                        </div>
                        <Button icon="pi pi-trash" severity="danger" rounded text @click="handleCancel(resa.id)" />
                      </div>
                    </div>
                    <div v-else class="empty-section">
                      <i class="pi pi-calendar empty-icon-sm"></i>
                      <p>{{ lang('reservation.empty') }}</p>
                    </div>
                    <Button :label="' ' + lang('reservation.view')" icon="pi pi-calendar" @click="router.push('/activities')" class="mt-4" text />
                  </div>
                  <!-- Admin/Organisateur -->
                  <div v-else-if="authStore.user.role === 'organisateur' || authStore.user.role === 'admin'">
                    <div v-if="authStore.reservations && authStore.reservations.length > 0">
                      <DataTable :value="authStore.reservations" class="p-datatable-sm">
                        <Column field="userEmail" :header="lang('admin.client')" />
                        <Column field="activite.titre" :header="lang('admin.activity')" />
                        <Column field="dateReservation" :header="lang('admin.date')" />
                        <Column :header="lang('admin.action')">
                          <template #body="slotProps">
                            <Button icon="pi pi-times" severity="danger" text rounded @click="handleCancel(slotProps.data.id)" />
                          </template>
                        </Column>
                      </DataTable>
                    </div>
                    <div v-else class="empty-section">
                      <i class="pi pi-calendar-times empty-icon-sm"></i>
                      <p>Aucune réservation d'activité pour le moment.</p>
                    </div>
                  </div>
                  <!-- Prestataire -->
                  <div v-else-if="authStore.user.role === 'prestataire'">
                    <div class="prestate-info-card">
                      <p>{{ lang('prestataire.status') }} <span class="text-green">{{ lang('prestataire.validated') }}</span></p>
                      <p>{{ lang('prestataire.location') }} <span class="text-white font-bold">Hall B - Stand 12</span></p>
                      <Button :label="' ' + lang('prestataire.manage')" icon="pi pi-box" @click="router.push('/prestatairedashboard')" class="mt-4" />
                    </div>
                  </div>
                </div>

                <!-- ===== SECURITE ===== -->
                <div v-else-if="activeSection === 'securite'">
                  <p class="security-hint">{{ lang('security.instructions') }}</p>
                  <div class="security-form">
                    <div class="form-field">
                      <label for="current-pass">{{ lang('security.currentPass') }}</label>
                      <Password id="current-pass" v-model="securityForm.currentPassword" :feedback="false" toggleMask fluid />
                    </div>
                    <div class="form-field">
                      <label for="new-pass">{{ lang('security.newPass') }}</label>
                      <Password id="new-pass" v-model="securityForm.newPassword" toggleMask fluid />
                    </div>
                    <div class="form-field">
                      <label for="confirm-pass">{{ lang('security.confirmPass') }}</label>
                      <Password id="confirm-pass" v-model="securityForm.confirmPassword" :feedback="false" toggleMask fluid />
                    </div>
                  </div>
                  <div class="form-actions">
                    <Button :label="' ' + lang('security.updatePass')" icon="pi pi-key" severity="warn" @click="updatePassword" />
                  </div>
                </div>

              </div>
            </Transition>
          </div>
        </div>
      </template>
    </main>

    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore }   from '@/stores/authStore.js';
import { useCartStore }   from '@/stores/cartStore.js';
import { useReviewStore } from '@/stores/reviewStore.js';
import { prestations }    from '@/datasource/data.mjs';
import { translations }   from '@/datasource/lang.js';

import {
  InputText, Button, Textarea, Password, Avatar, Toast,
  DataTable, Column, Rating, ConfirmDialog, Dialog, Dropdown
} from 'primevue';

import { useToast }    from 'primevue/usetoast';
import { useConfirm }  from 'primevue/useconfirm';

const router      = useRouter();
const authStore   = useAuthStore();
const cartStore   = useCartStore();
const reviewStore = useReviewStore();
const toast       = useToast();
const confirm     = useConfirm();

const lang = (key) => translations[authStore.currentLanguage]?.[key] || key;

const saving = ref(false);
const sidebarCollapsed = ref(false);
const activeSection    = ref('profil');

const navItems = computed(() => [
  { key: 'profil',    icon: 'pi-user',     label: lang('profile') },
  { key: 'billets',   icon: 'pi-ticket',   label: lang('account.tickets') },
  { key: 'activites', icon: 'pi-calendar', label: lang('account.activities') },
  { key: 'securite',  icon: 'pi-lock',     label: lang('account.security') },
]);

const currentItem = computed(() => navItems.value.find(i => i.key === activeSection.value));

const userTickets = computed(() => {
  if (!authStore.user) return [];
  return authStore.user.tickets || [];
});

const userReviews = computed(() => {
  if (!authStore.user) return [];
  return reviewStore.getReviewsByUser(authStore.user.id);
});

const getPrestationName = (id) => {
  const p = prestations.find(presta => presta.id === id);
  return p ? p.name : 'Prestation inconnue';
};

const editReviewDialog = ref(false);
const selectReview = reactive({ id: null, rating: 0, comment: '' });

function editReview(review) {
  selectReview.id = review.id;
  selectReview.rating = review.rating;
  selectReview.comment = review.comment;
  editReviewDialog.value = true;
}
function saveReviewEdit() {
  reviewStore.updateReview(selectReview.id, { rating: selectReview.rating, comment: selectReview.comment });
  editReviewDialog.value = false;
  toast.add({ severity: 'success', summary: 'Succès', detail: 'Avis mis à jour', life: 3000 });
}
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

const ageOptions = ['< 18 ans', '18-25 ans', '26-35 ans', '36-45 ans', '46-60 ans', '+ 60 ans'];
const genderOptions = ['Hommes', 'Femmes', 'Non-binaire'];
const familyOptions = ['En famille', 'Seul(e) / Amis'];
const regionOptions = ['Belfort (90)', 'Montbéliard (25)', 'Autres Franche-Comté', 'Alsace', 'Reste de la France', 'Suisse / Étranger'];

const profileForm = reactive({ name: '', email: '', phone: '', description: '', picture: '', ageGroup: null, gender: null, family: null, geographicRegion: null });
const securityForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' });

onMounted(() => {
  if (authStore.user) {
    profileForm.name             = authStore.user.name             || '';
    profileForm.email            = authStore.user.email            || '';
    profileForm.phone            = authStore.user.phone            || '';
    profileForm.description      = authStore.user.description      || '';
    profileForm.picture          = authStore.user.picture          || '';
    profileForm.ageGroup         = authStore.user.ageGroup         || null;
    profileForm.gender           = authStore.user.gender           || null;
    profileForm.family           = authStore.user.family           || null;
    profileForm.geographicRegion = authStore.user.geographicRegion || null;
  }
});

function saveProfile() {
  saving.value = true;
  setTimeout(async () => {
    // Need to also call to PUT /users/:id to save these fields since authStore.updateUser only does local storage unless specifically handled
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await fetch(`${API_URL}/users/${authStore.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileForm.name,
          phone: profileForm.phone,
          description: profileForm.description,
          picture: profileForm.picture,
          ageGroup: profileForm.ageGroup,
          gender: profileForm.gender,
          family: profileForm.family,
          geographicRegion: profileForm.geographicRegion
        })
      });
      if (response.ok) {
        const data = await response.json();
        authStore.updateUser(data.user);
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Profil mis à jour', life: 3000 });
      } else {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur du serveur', life: 3000 });
      }
    } catch (e) {
      toast.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur de connexion', life: 3000 });
    }
    saving.value = false;
  }, 500);
}

function updatePassword() {
  if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs', life: 3000 });
    return;
  }
  if (securityForm.newPassword !== securityForm.confirmPassword) {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Les mots de passe ne correspondent pas', life: 3000 });
    return;
  }
  toast.add({ severity: 'success', summary: 'Succès', detail: 'Mot de passe mis à jour', life: 3000 });
  securityForm.currentPassword = '';
  securityForm.newPassword = '';
  securityForm.confirmPassword = '';
}

function handleLogout() {
  authStore.logout();
  router.push('/');
}

function handleCancel(id) {
  authStore.annulerReservation(id);
  toast.add({ severity: 'info', summary: 'Annulé', detail: 'Réservation annulée', life: 3000 });
}
</script>

<style scoped>
@import '@/assets/main.css';

/* ============================================================
   SHELL
   ============================================================ */
.account-shell {
  display: flex;
  min-height: 100vh;
  background: var(--necro-bg);
  font-family: 'Rajdhani', sans-serif;
}

/* ============================================================
   SIDEBAR
   ============================================================ */
.account-sidebar {
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

.account-sidebar.collapsed {
  width: 64px;
}

/* Profile area */
.sidebar-profile {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.5rem 1.1rem 1.2rem;
  border-bottom: 1px solid var(--glass-border);
  overflow: hidden;
}

.profile-avatar {
  flex-shrink: 0;
}

.avatar-img {
  width: 44px !important;
  height: 44px !important;
}

.avatar-initials {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--necro-purple), #6d28d9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.4);
}

.profile-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
}

.profile-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--necro-text, #6c6c6c);
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-role {
  font-size: 0.72rem;
  color: var(--necro-text-muted);
  text-transform: capitalize;
}

/* Collapse btn */
.sidebar-collapse-btn {
  position: absolute;
  top: 1.4rem;
  right: -13px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  background: var(--necro-surface, #bdbdbd);
  color: var(--necro-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.65rem;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  z-index: 10;
}
.sidebar-collapse-btn:hover {
  background: var(--necro-purple);
  color: white;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
}

/* Nav */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  overflow: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.85rem;
  border-radius: 10px;
  cursor: pointer;
  color: var(--necro-text-muted);
  transition: background 0.2s, color 0.2s;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.nav-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(168, 85, 247, 0.12), transparent);
  opacity: 0;
  transition: opacity 0.2s;
}

.nav-item:hover {
  color: var(--necro-text, #505050);
  background: rgba(118, 76, 158, 0.08);
}
.nav-item:hover::before { opacity: 1; }

.nav-item.active {
  background: rgba(101, 60, 140, 0.18);
  color: #423053;
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.18);
}
.nav-item.active::before { opacity: 1; }

.nav-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1rem;
  border-radius: 8px;
}
.nav-item.active .nav-icon {
  background: rgba(168, 85, 247, 0.25);
  color: var(--necro-purple);
}

.nav-label {
  font-size: 0.95rem;
  font-weight: 600;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--necro-purple);
  box-shadow: 0 0 6px var(--necro-purple);
  flex-shrink: 0;
}

/* Footer */
.sidebar-footer {
  padding: 1rem 0.85rem;
  border-top: 1px solid var(--glass-border);
  overflow: hidden;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(248, 113, 113, 0.3);
  background: rgba(248, 113, 113, 0.08);
  color: #f87171;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  width: 100%;
  transition: background 0.2s;
}
.logout-btn:hover { background: rgba(248, 113, 113, 0.18); }

.uid-text {
  font-size: 0.68rem;
  color: var(--necro-text-muted);
  margin: 0.75rem 0 0;
  padding: 0 0.25rem;
  line-height: 1.5;
  overflow: hidden;
}
.uid-text span {
  font-family: monospace;
  color: rgba(168, 85, 247, 0.7);
  word-break: break-all;
}

/* ============================================================
   MAIN
   ============================================================ */
.account-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 1rem;
  color: var(--necro-text-muted);
}
.empty-icon { font-size: 3rem; color: var(--necro-purple); }

/* Topbar */
.account-topbar {
  display: flex;
  align-items: flex-end;
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid var(--glass-border);
  background: rgba(232, 226, 221, 0.75);
  backdrop-filter: blur(8px);
}

.topbar-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: var(--necro-text-muted);
  margin-bottom: 0.35rem;
}
.breadcrumb-sep { color: var(--glass-border); }
.breadcrumb-current { color: var(--necro-purple); font-weight: 600; }

.topbar-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--necro-text, #424242);
  margin: 0;
  letter-spacing: 0.02em;
}

/* Content */
.account-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.content-card {
  background: rgba(237, 233, 229, 0.75);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg, 16px);
  padding: 2rem;
  min-height: 60vh;
  backdrop-filter: blur(6px);
}

/* ============================================================
   FORM STYLES
   ============================================================ */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-field label {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--necro-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.form-field--full { grid-column: 1 / -1; }

.disabled-input { opacity: 0.5; }

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--glass-border);
}

/* ============================================================
   REVIEWS
   ============================================================ */
.reviews-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--glass-border);
}

.reviews-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--necro-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.text-yellow { color: #facc15; }

.reviews-list { display: flex; flex-direction: column; gap: 0.75rem; }

.review-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  padding: 1rem 1.25rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.review-link {
  font-weight: 700;
  color: var(--necro-purple);
  font-size: 0.95rem;
  display: block;
  text-decoration: none;
}
.review-link:hover { color: var(--necro-green); }

.review-date {
  font-size: 0.75rem;
  color: var(--necro-text-muted);
}

.review-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.review-comment {
  font-size: 0.9rem;
  color: var(--necro-text-muted);
  font-style: italic;
  margin: 0;
}

.reviews-empty {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: rgba(255,255,255,0.03);
  border: 1px dashed var(--glass-border);
  border-radius: 10px;
  color: var(--necro-text-muted);
  font-style: italic;
  font-size: 0.9rem;
}

/* ============================================================
   TICKETS
   ============================================================ */
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
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

.ticket-left {
  flex: 1;
  padding: 1rem;
  border-right: 2px dashed #ccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ticket-event { font-size: 0.65rem; font-weight: 800; color: #a855f7; letter-spacing: 1px; }
.ticket-type  { font-size: 1.1rem; font-weight: 900; text-transform: uppercase; margin: 0.5rem 0; }
.ticket-info  { display: flex; gap: 1rem; font-size: 0.8rem; }
.info-group   { display: flex; flex-direction: column; }
.info-group .label { color: #888; font-size: 0.6rem; text-transform: uppercase; }
.info-group .value { font-weight: 600; }
.ticket-uuid  { font-family: monospace; font-size: 0.5rem; color: #aaa; margin-top: 0.5rem; }

.ticket-right {
  width: 90px;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

.qr-code-placeholder { font-size: 2.5rem; color: #333; margin-bottom: 0.5rem; }
.ticket-price         { font-weight: 800; font-size: 1rem; }

.ticket-stub {
  position: absolute;
  right: 82px;
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
  background: rgba(30, 27, 46, 0.7);
  border-radius: 50%;
  left: 0;
}
.ticket-stub::before { top: 0; transform: translateY(-50%); }
.ticket-stub::after  { bottom: 0; transform: translateY(50%); }

/* ============================================================
   ACTIVITES / RESERVATIONS
   ============================================================ */
.reservations-list { display: flex; flex-direction: column; gap: 0.75rem; }

.resa-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(168, 85, 247, 0.07);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 10px;
  padding: 1rem 1.25rem;
}

.resa-title { font-weight: 700; color: var(--necro-text); font-size: 1rem; }
.resa-date  { font-size: 0.8rem; color: var(--necro-text-muted); }

.prestate-info-card {
  background: rgba(168, 85, 247, 0.07);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  color: var(--necro-text-muted);
}
.text-green { color: var(--necro-green); }
.text-white { color: var(--necro-text); }
.font-bold  { font-weight: 700; }
.mt-4       { margin-top: 1rem; }

/* ============================================================
   SECURITE
   ============================================================ */
.security-hint { color: var(--necro-text-muted); margin-bottom: 1.5rem; font-size: 0.9rem; }

.security-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 480px;
}

/* ============================================================
   EMPTY STATES
   ============================================================ */
.empty-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  color: var(--necro-text-muted);
  font-style: italic;
}
.empty-icon-sm { font-size: 2.5rem; color: var(--necro-purple); }

/* ============================================================
   TRANSITIONS
   ============================================================ */
.section-fade-enter-active,
.section-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.section-fade-enter-from { opacity: 0; transform: translateY(8px); }
.section-fade-leave-to   { opacity: 0; transform: translateY(-6px); }

.fade-label-enter-active,
.fade-label-leave-active { transition: opacity 0.18s ease; }
.fade-label-enter-from,
.fade-label-leave-to     { opacity: 0; }

.fade-in { animation: fadeIn 0.4s ease-in-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ============================================================
   DEEP OVERRIDES PrimeVue
   ============================================================ */
:deep(.p-inputtext),
:deep(.p-textarea) {
  background: rgba(255, 255, 255, 0.7) !important;
  border-color: var(--glass-border) !important;
  color: var(--necro-text) !important;
  font-family: 'Rajdhani', sans-serif !important;
  font-size: 0.95rem !important;
}
:deep(.p-inputtext:focus),
:deep(.p-textarea:focus) {
  border-color: var(--necro-purple) !important;
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.25) !important;
}
:deep(.p-password-input) {
  background: rgba(255, 255, 255, 0.7) !important;
  border-color: var(--glass-border) !important;
  color: var(--necro-text) !important;
  font-family: 'Rajdhani', sans-serif !important;
}
:deep(.p-button) {
  font-family: 'Rajdhani', sans-serif !important;
  font-weight: 600 !important;
}
:deep(.p-datatable-thead > tr > th) {
  background: rgba(204, 204, 204, 0.3) !important;
  color: var(--necro-text-muted) !important;
  font-family: 'Rajdhani', sans-serif !important;
  font-size: 0.82rem !important;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-color: var(--glass-border) !important;
}
:deep(.p-datatable-tbody > tr) {
  background: transparent !important;
  color: var(--necro-text) !important;
  font-family: 'Rajdhani', sans-serif !important;
  font-size: 0.95rem !important;
  border-color: rgba(255,255,255,0.04) !important;
}
:deep(.p-datatable-tbody > tr:hover) {
  background: rgba(168,85,247,0.08) !important;
}
:deep(.p-dialog) {
  background: rgba(20, 17, 38, 0.98) !important;
  border: 1px solid var(--glass-border) !important;
  border-radius: var(--radius-lg, 16px) !important;
  backdrop-filter: blur(20px) !important;
}
:deep(.p-dialog-header) {
  background: transparent !important;
  color: var(--necro-text, #333333) !important;
  font-family: 'Rajdhani', sans-serif !important;
  border-bottom: 1px solid var(--glass-border) !important;
}
:deep(.p-dialog-content) { background: transparent !important; color: var(--necro-text, #424242) !important; }
:deep(.p-dialog-footer) {
  background: transparent !important;
  border-top: 1px solid var(--glass-border) !important;
  display: flex; justify-content: flex-end; gap: 0.5rem;
}
</style>