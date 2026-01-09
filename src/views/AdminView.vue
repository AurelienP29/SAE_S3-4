<template>
  <div class="necro-layout admin-view">

    <div class="container">
      <div class="necro-card admin-panel fade-in-up">

        <div class="header-section">
          <h1 class="text-3xl m-0 title-font">
            <i class="pi pi-cog spin-hover text-green mr-2" style="font-size: 1em; justify-content: center; margin: 0 1rem 0 0;"></i>
            <span class="text-purple">{{ lang('admin.title') }}</span>
          </h1>
          <p class="text-muted mt-2">
            {{ lang('admin.subtitle') }}
          </p>
        </div>

        <TabView v-model:activeIndex="activeTab" class="necro-tabs">
          <!-- 
          <TabPanel header="Prestations">
             <PrestataireManager />
          </TabPanel>
          !-->
          <TabPanel>
            <template #header>
              <div class="flex align-items-center gap-2 tab-header">
                <i class="pi pi-users" />
                <span class="font-bold">{{ lang('admin.providers') }}</span>
              </div>
            </template>
            <div class="tab-content">
              <PrestataireManager />
            </div>
          </TabPanel>

          <TabPanel lazy>
            <template #header>
              <div class="flex align-items-center gap-2 tab-header">
                <i class="pi pi-map" />
                <span class="font-bold">{{ lang('admin.map') }}</span>
              </div>
            </template>
            <div class="tab-content">
              <InteractiveMap
                  :current-user="authStore.user"
                  :enable-actions="true"
              />
            </div>
          </TabPanel>

          <TabPanel lazy>
            <template #header>
              <div class="flex align-items-center gap-2 tab-header">
                <i class="pi pi-users" />
                <span class="font-bold">{{ lang('admin.accounts') }}</span>
              </div>
            </template>
            <div class="tab-content">
              <AccountManager />
            </div>
          </TabPanel>

        </TabView>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import { TabPanel, TabView } from 'primevue';

import PrestataireManager from '@/components/adminComponents/AdminPrestataireManager.vue';
import InteractiveMap from "@/components/InteractiveMap.vue";
import {useAuthStore} from "@/stores/authStore.js";
import { translations } from '@/datasource/lang.js';

import AccountManager from '@/components/adminComponents/AdminAccountManager.vue';

const authStore = useAuthStore();

const lang = (key) => {
  return translations[authStore.currentLanguage][key] || key;
};

const activeTab = ref(0);
</script>

<style scoped>
@import '@/assets/main.css';

.admin-view {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.admin-panel {
  width: 100%;
  max-width: 1400px; /* Wide panel for data tables */
  padding: 0; /* Let inner elements handle padding */
  overflow: hidden; /* Contains the tab borders */
}

.header-section {
  padding: 2rem;
  border-bottom: 1px solid var(--glass-border);
  background: rgba(0, 0, 0, 0.2);
}

.title-font {
  font-family: 'Press Start 2P', cursive;
  line-height: 1.5;
}

.text-muted {
  color: var(--necro-text-muted);
}

.text-green { color: var(--necro-green); }
.text-purple { color: var(--necro-purple); }

/* --- PRIMEVUE TABVIEW OVERRIDES --- */
/* We use :deep() to target child components style */

:deep(.p-tabview-nav) {
  background: transparent !important;
  border-color: var(--glass-border) !important;
  padding-left: 1rem;
}

:deep(.p-tabview-nav li .p-tabview-nav-link) {
  background: transparent !important;
  color: var(--necro-text-muted) !important;
  border-color: transparent !important;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  border-radius: 6px 6px 0 0;
}

/* Hover State */
:deep(.p-tabview-nav li:not(.p-highlight):hover .p-tabview-nav-link) {
  color: var(--necro-text) !important;
  background: rgba(255, 255, 255, 0.05) !important;
}

/* Active State */
:deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  color: var(--necro-green) !important; /* Green text for active */
  border-bottom-color: var(--necro-purple) !important; /* Purple underline */
  background: rgba(168, 85, 247, 0.1) !important; /* Subtle purple bg */
}

/* Tab Content Area */
:deep(.p-tabview-panels) {
  background: transparent !important;
  color: var(--necro-text);
  padding: 2rem;
}

/* --- ANIMATIONS & UTILS --- */
.spin-hover:hover {
  animation: spin 2s linear infinite;
}

@keyframes spin { 100% { transform: rotate(360deg); } }

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.placeholder-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  border: 2px dashed var(--glass-border);
  border-radius: var(--radius-md);
  color: var(--necro-text-muted);
}
</style>