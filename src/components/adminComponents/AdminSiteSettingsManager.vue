<template>
  <div class="admin-site-settings">
    <div class="flex justify-content-between align-items-center mb-4">
      <h1 class="m-0">{{ lang('admin.settings.title') || 'Paramètres du Site' }}</h1>
      <Button 
        :label="lang('save') || 'Sauvegarder'" 
        icon="pi pi-check" 
        severity="success" 
        :loading="settingsStore.loading"
        @click="saveSettings" 
      />
    </div>

    <div v-if="settingsStore.loading && !settingsStore.settings" class="flex justify-content-center p-5">
      <ProgressSpinner />
    </div>

    <div v-else-if="settingsStore.settings" class="grid p-fluid">
      <!-- Texts Section -->
      <div class="col-12">
        <Panel :header="lang('admin.settings.texts') || 'Textes de la page d\'accueil'" class="mb-4">
          <div class="grid">
            <div class="field col-12 mb-3">
              <label for="banner" class="font-bold">Bannière (Hero Title)</label>
              <InputText id="banner" v-model="form.homeTexts.banner" class="w-full" />
            </div>
            <div class="field col-12 mb-3">
              <label for="intro" class="font-bold">Introduction</label>
              <InputText id="intro" v-model="form.homeTexts.intro" class="w-full" />
            </div>
            <div class="field col-12 mb-3">
              <label for="description" class="font-bold">Description</label>
              <Textarea id="description" v-model="form.homeTexts.description" rows="8" class="w-full" />
            </div>
            <div class="field col-12 md:col-6 mb-3">
              <label for="locationTitle" class="font-bold">Titre Emplacement</label>
              <InputText id="locationTitle" v-model="form.homeTexts.locationTitle" class="w-full" />
            </div>
            <div class="field col-12 md:col-6 mb-3">
              <label for="mapTitle" class="font-bold">Titre Carte</label>
              <InputText id="mapTitle" v-model="form.homeTexts.mapTitle" class="w-full" />
            </div>
            <div class="field col-12 md:col-6 mb-3">
              <label for="originTitle" class="font-bold">Titre Origine</label>
              <InputText id="originTitle" v-model="form.homeTexts.originTitle" class="w-full" />
            </div>
            <div class="field col-12 mb-3">
              <label for="originDescription" class="font-bold">Description Origine</label>
              <Textarea id="originDescription" v-model="form.homeTexts.originDescription" rows="8" class="w-full" />
            </div>
            <div class="field col-12 mb-3">
              <label for="supportersTitle" class="font-bold">Titre Partenaires</label>
              <InputText id="supportersTitle" v-model="form.homeTexts.supportersTitle" class="w-full" />
            </div>
          </div>
        </Panel>
      </div>

      <!-- Appearance Section -->
      <div class="col-12 md:col-6">
        <Panel :header="lang('admin.settings.appearance') || 'Apparence & Polices'" class="mb-4">
          <div class="field mb-3">
            <label for="primaryFont" class="font-bold">Police Primaire (Titres)</label>
            <InputText id="primaryFont" v-model="form.fonts.primary" placeholder="'Press Start 2P', cursive" class="w-full" />
          </div>
          <div class="field mb-3">
            <label for="secondaryFont" class="font-bold">Police Secondaire (Texte)</label>
            <InputText id="secondaryFont" v-model="form.fonts.secondary" placeholder="'Rajdhani', sans-serif" class="w-full" />
          </div>
        </Panel>
      </div>

      <!-- Images Section -->
      <div class="col-12 md:col-6">
        <Panel :header="lang('admin.settings.images') || 'Images du site'" class="mb-4">
          <div class="field mb-3">
            <label for="heroBackground" class="font-bold">Image de fond Hero (URL)</label>
            <InputText id="heroBackground" v-model="form.images.heroBackground" class="w-full" />
            <div class="mt-2 text-center">
              <img :src="form.images.heroBackground" alt="Preview" style="max-height: 100px; border-radius: 8px;" v-if="form.images.heroBackground" />
            </div>
          </div>
          <div class="field mb-3">
            <label for="bannerImage" class="font-bold">Image de la bannière flottante (URL)</label>
            <InputText id="bannerImage" v-model="form.images.bannerImage" class="w-full" />
            <div class="mt-2 text-center">
              <img :src="form.images.bannerImage" alt="Preview" style="max-height: 100px; border-radius: 8px;" v-if="form.images.bannerImage" />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Button, InputText, Textarea, Panel, ProgressSpinner } from 'primevue';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAuthStore } from '@/stores/authStore';
import { translations } from '@/datasource/lang.js';

const settingsStore = useSettingsStore();
const authStore = useAuthStore();

const lang = (key) => {
  return translations[authStore.currentLanguage]?.[key] || key;
};

const form = ref({
  homeTexts: {},
  fonts: {},
  images: {}
});

onMounted(async () => {
  if (!settingsStore.settings) {
    await settingsStore.fetchSettings();
  }
  syncForm();
});

const syncForm = () => {
  if (settingsStore.settings) {
    form.value = JSON.parse(JSON.stringify(settingsStore.settings));
  }
};

watch(() => settingsStore.settings, syncForm, { deep: true });

const saveSettings = async () => {
  const success = await settingsStore.updateSettings(form.value);
  if (success) {
    // Note: In a real app we might use a Toast component here
    alert('Paramètres mis à jour avec succès');
  } else {
    alert('Erreur lors de la mise à jour: ' + (settingsStore.error || 'Erreur inconnue'));
  }
};
</script>

<style scoped>
.admin-site-settings {
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 2rem;
}

.grid {
  margin-top: 0;
}

.field {
  margin-bottom: 1.5rem !important; /* Aère les champs */
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--necro-text);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.p-panel) {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid var(--glass-border);
    margin-bottom: 1rem;
}

:deep(.p-panel-header) {
    background: rgba(168, 85, 247, 0.15);
    color: var(--necro-text);
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700;
    border-bottom: 1px solid var(--glass-border);
}

:deep(.p-inputtext),
:deep(.p-textarea) {
    background: #ffffff !important; /* Fond blanc */
    color: #333333 !important;    /* Texte sombre pour lisibilité */
    border: 1px solid #ced4da !important;
    padding: 0.75rem !important;  /* Aère le texte à l'intérieur */
    font-family: 'Rajdhani', sans-serif !important;
    border-radius: 6px !important;
}

:deep(.p-inputtext:focus),
:deep(.p-textarea:focus) {
    border-color: var(--necro-purple) !important;
    box-shadow: 0 0 0 0.2rem rgba(168, 85, 247, 0.25) !important;
}
</style>
