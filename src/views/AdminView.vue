<template>
  <div class="admin-shell">
    <!-- ========== SIDEBAR ========== -->
    <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- Sidebar Header -->
      <div class="sidebar-brand">
        <transition name="fade-label">
          <div v-if="!sidebarCollapsed" class="brand-text">
            <span class="brand-title">Espace Admin</span>
          </div>
        </transition>
      </div>

      <!-- Collapse toggle -->
      <button
        class="sidebar-collapse-btn"
        @click="sidebarCollapsed = !sidebarCollapsed"
        :title="sidebarCollapsed ? 'Ouvrir' : 'Réduire'"
      >
        <i
          class="pi"
          :class="sidebarCollapsed ? 'pi-chevron-right' : 'pi-chevron-left'"
        ></i>
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
          <transition name="fade-label">
            <span v-if="!sidebarCollapsed" class="nav-label">{{
              item.label
            }}</span>
          </transition>
          <transition name="fade-label">
            <span
              v-if="!sidebarCollapsed && activeSection === item.key"
              class="nav-active-dot"
            ></span>
          </transition>
        </div>
      </nav>

      <!-- Sidebar footer -->
      <div class="sidebar-footer" v-if="!sidebarCollapsed">
        <div class="sidebar-user">
          <i class="pi pi-user sidebar-user-icon"></i>
          <div class="sidebar-user-info">
            <span class="sidebar-user-name">{{ authStore.user?.name }}</span>
            <span class="sidebar-user-role">{{ authStore.user?.role }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- ========== MAIN CONTENT ========== -->
    <main class="admin-main">
      <!-- Top bar -->
      <header class="admin-topbar">
        <div class="topbar-left">
          <h1 class="topbar-title">{{ currentItem?.label }}</h1>
        </div>
      </header>

      <!-- Section content -->
      <div class="admin-content">
        <Transition name="section-fade" mode="out-in">
          <div v-if="activeSection === 'carte'" key="carte" class="map-section-wrapper">
            <InteractiveMap
              :current-user="authStore.user"
              :enable-actions="true"
            />
          </div>
        </Transition>

        <div v-if="activeSection !== 'carte'" class="content-card">
          <Transition name="section-fade" mode="out-in">
            <div :key="activeSection">
              <AdminPrestationManager v-if="activeSection === 'prestations'" />
              <PrestataireManager     v-else-if="activeSection === 'prestataires'" />
              <AccountManager         v-else-if="activeSection === 'comptes'" />
              <AdminStatsView         v-else-if="activeSection === 'stats'" />
              <AdminSiteSettingsManager v-else-if="activeSection === 'settings'" />
            </div>
          </Transition>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import PrestataireManager from "@/components/adminComponents/AdminPrestataireManager.vue";
import InteractiveMap from "@/components/InteractiveMap.vue";
import AccountManager from "@/components/adminComponents/AdminAccountManager.vue";
import AdminPrestationManager from "@/components/adminComponents/AdminPrestationManager.vue";
import AdminStatsView from "@/components/adminComponents/AdminStatsView.vue";
import AdminSiteSettingsManager from "@/components/adminComponents/AdminSiteSettingsManager.vue";

import { useAuthStore } from "@/stores/authStore.js";
import { translations } from "@/datasource/lang.js";

const authStore = useAuthStore();
const route = useRoute();
const lang = (key) => translations[authStore.currentLanguage]?.[key] || key;

const sidebarCollapsed = ref(false);
const activeSection = ref("prestations");

const navItems = [
  { key: "prestations", icon: "pi-list", label: lang("admin.prestations") },
  { key: "prestataires", icon: "pi-id-card", label: lang("admin.providers") },
  { key: "carte", icon: "pi-map", label: lang("admin.map") },
  { key: "comptes", icon: "pi-users", label: lang("admin.accounts") },
  { key: "stats", icon: "pi-chart-bar", label: lang("admin.stats.tab") },
  { key: "settings", icon: "pi-cog", label: lang("settings") },
];

const updateSectionFromQuery = () => {
  if (route.query.section && navItems.some(i => i.key === route.query.section)) {
    activeSection.value = route.query.section;
  }
};

onMounted(updateSectionFromQuery);

watch(() => route.query.section, updateSectionFromQuery);

const currentItem = computed(() =>
  navItems.find((i) => i.key === activeSection.value),
);
</script>

<style scoped>
@import "@/assets/main.css";

/* ============================================================
   SHELL LAYOUT
   ============================================================ */
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: var(--necro-bg);
  font-family: "Rajdhani", sans-serif;
}

/* ============================================================
   SIDEBAR
   ============================================================ */
.admin-sidebar {
  width: 260px;
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

.admin-sidebar.collapsed {
  width: 68px;
}

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.5rem 1.1rem 1rem;
  border-bottom: 1px solid var(--glass-border);
  overflow: hidden;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow: hidden;
  white-space: nowrap;
}

.brand-title {
  font-size: 1.33rem;
  font-weight: 600;
  color: var(--necro-purple);
  letter-spacing: 0.05em;
  line-height: 1.6;
  text-transform: uppercase;
}

/* Collapse button */
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
  transition:
    background 0.2s,
    color 0.2s,
    box-shadow 0.2s;
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
  transition:
    background 0.2s,
    color 0.2s,
    box-shadow 0.2s;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.nav-item::before {
  content: "";
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

.nav-item:hover::before {
  opacity: 1;
}

.nav-item.active {
  background: rgba(101, 60, 140, 0.18);
  color: #423053;
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.18);
}

.nav-item.active::before {
  opacity: 1;
}

.nav-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1rem;
  border-radius: 8px;
  transition: background 0.2s;
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

.sidebar-footer {
  padding: 1rem 0.85rem;
  border-top: 1px solid var(--glass-border);
  overflow: hidden;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  border-radius: 10px;
  padding: 0.6rem 0.5rem;
}

.sidebar-user-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(168, 85, 247, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: var(--necro-purple);
  flex-shrink: 0;
}

.sidebar-user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-user-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--necro-text, #6c6c6c);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-user-role {
  font-size: 0.72rem;
  color: var(--necro-text-muted);
  text-transform: capitalize;
}

/* ============================================================
   MAIN AREA
   ============================================================ */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-x: hidden;
}

/* Top bar */
.admin-topbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid var(--glass-border);
  background: rgba(232, 226, 221, 0.75);
  backdrop-filter: blur(8px);
  gap: 1rem;
  flex-wrap: wrap;
}

.topbar-title {
  font-family: "Rajdhani", sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--necro-text, #f1f5f9);
  margin: 0;
  letter-spacing: 0.02em;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.topbar-badge {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.82rem;
  color: var(--necro-text-muted);
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.25);
  border-radius: 20px;
  padding: 0.3rem 0.85rem;
}

.text-muted {
  color: var(--necro-text-muted);
}

@keyframes pulsate {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}
.pulse-green {
  color: var(--necro-green, #22c55e);
  font-size: 0.55rem;
  animation: pulsate 2s ease-in-out infinite;
}

/* Content */
.admin-content {
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

.map-section-wrapper {
  width: 100%;
}

/* ============================================================
   TRANSITIONS
   ============================================================ */
.section-fade-enter-active,
.section-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.section-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.section-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.fade-label-enter-active,
.fade-label-leave-active {
  transition: opacity 0.18s ease;
}
.fade-label-enter-from,
.fade-label-leave-to {
  opacity: 0;
}

/* ============================================================
   DEEP OVERRIDES — Tables et titres enfants
   ============================================================ */
:deep(h1) {
  font-family: "Rajdhani", sans-serif !important;
  font-size: 1.3rem !important;
  font-weight: 700 !important;
  color: var(--necro-text-muted) !important;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 2px solid rgba(168, 85, 247, 0.2);
  padding-bottom: 0.4rem;
  margin-bottom: 1rem !important;
}

:deep(.p-datatable-thead > tr > th) {
  background: rgba(204, 204, 204, 0.3) !important;
  color: var(--necro-text-muted) !important;
  font-family: "Rajdhani", sans-serif !important;
  font-size: 0.82rem !important;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-color: var(--glass-border) !important;
  font-weight: 700 !important;
}

:deep(.p-datatable-tbody > tr) {
  background: transparent !important;
  color: var(--necro-text, #0b0b0b) !important;
  border-color: rgba(255, 255, 255, 0.04) !important;
  font-family: "Rajdhani", sans-serif !important;
  font-size: 0.97rem !important;
  transition: background 0.15s;
}

:deep(.p-datatable-tbody > tr:nth-child(even)) {
  background: rgba(255, 255, 255, 0.023) !important;
}

:deep(.p-datatable-tbody > tr:hover) {
  background: rgba(168, 85, 247, 0.09) !important;
}

:deep(.p-paginator) {
  background: transparent !important;
  color: var(--necro-text-muted) !important;
  border: none !important;
  font-family: "Rajdhani", sans-serif !important;
}

:deep(.p-paginator .p-paginator-page.p-highlight) {
  background: var(--necro-purple) !important;
  color: white !important;
  border-radius: 6px;
}

:deep(.p-toolbar) {
  background: transparent !important;
  border: 1px solid var(--glass-border) !important;
  border-radius: 10px !important;
  padding: 0.75rem 1rem !important;
}

:deep(.p-button) {
  font-family: "Rajdhani", sans-serif !important;
  font-weight: 600 !important;
  font-size: 0.9rem !important;
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
  font-family: "Rajdhani", sans-serif !important;
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  border-bottom: 1px solid var(--glass-border) !important;
}

:deep(.p-dialog-content) {
  background: transparent !important;
  color: var(--necro-text, #424242) !important;
}

:deep(.p-dialog-footer) {
  background: transparent !important;
  border-top: 1px solid var(--glass-border) !important;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

:deep(.p-inputtext),
:deep(.p-textarea) {
  background: rgba(253, 253, 253, 0.7) !important;
  border-color: var(--glass-border) !important;
  color: var(--necro-text) !important;
  font-family: "Rajdhani", sans-serif !important;
}

:deep(.p-inputtext:focus),
:deep(.p-textarea:focus) {
  border-color: var(--necro-purple) !important;
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.25) !important;
}

:deep(.p-select),
:deep(.p-dropdown) {
  background: rgba(11, 9, 20, 0.7) !important;
  border-color: var(--glass-border) !important;
  color: var(--necro-text) !important;
}
</style>
