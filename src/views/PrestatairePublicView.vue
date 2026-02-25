<template>
  <div class="prestataire-public-container p-4 min-h-screen bg-[#0b0914] text-[#f1f5f9]">
    <div v-if="loading" class="flex flex-col items-center justify-center h-64">
      <i class="pi pi-spin pi-spinner text-4xl text-purple-500"></i>
    </div>

    <div v-else-if="!prestataire" class="flex flex-col items-center justify-center h-64">
      <h2 class="text-2xl font-bold text-red-400 mb-4">{{ lang('prestataire.not_found') || 'Prestataire non trouvé' }}</h2>
      <Button :label="lang('home.return') || 'Retour'" icon="pi pi-home" @click="router.push('/')" />
    </div>

    <div v-else class="max-w-5xl mx-auto">
      <!-- Header Section -->
      <div class="header-glass p-8 rounded-xl mb-8 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
        <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <Avatar v-if="prestataire.picture" :image="prestataire.picture" size="xlarge" shape="circle" class="w-32 h-32 border-2 border-purple-500" />
          <Avatar v-else :label="prestataire.name.charAt(0).toUpperCase()" size="xlarge" shape="circle" class="w-32 h-32 text-4xl bg-purple-600 border-2 border-purple-500" />
          
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-4xl font-bold text-white mb-2 uppercase tracking-tighter">{{ prestataire.name }}</h1>
            <Tag :value="lang('category.' + prestataire.category)" severity="secondary" class="mb-4" />
            <p class="text-xl text-gray-300 italic">{{ prestataire.phone }} | {{ prestataire.email }}</p>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Main Content (2/3) -->
        <div class="md:col-span-2 flex flex-col gap-8">
          <!-- Custom Page Content -->
          <div class="content-glass p-6 rounded-xl border border-purple-500/20">
            <h2 class="text-2xl font-bold text-purple-400 mb-6 uppercase border-b border-purple-500/30 pb-2">
              {{ lang('prestataire.public.presentation') || 'Présentation' }}
            </h2>
            <div class="prose prose-invert max-w-none" v-html="prestataire.publicPageText || prestataire.description"></div>
            
            <div v-if="prestataire.publicPageImages && prestataire.publicPageImages.length" class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div v-for="(img, index) in prestataire.publicPageImages" :key="index" class="rounded-lg overflow-hidden border border-purple-500/20">
                  <img :src="img" class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
               </div>
            </div>
          </div>
        </div>

        <!-- Sidebar (1/3) -->
        <div class="flex flex-col gap-8">
           <!-- Services -->
           <div class="content-glass p-6 rounded-xl border border-purple-500/20">
             <h3 class="text-xl font-bold text-purple-400 mb-4 uppercase">{{ lang('prestataire.services') }}</h3>
             <ul class="list-none p-0 flex flex-col gap-3">
               <li v-for="service in services" :key="service.id" class="p-3 bg-white/5 rounded border border-white/10 flex justify-between items-center">
                 <span>{{ service.name }}</span>
                 <Button icon="pi pi-arrow-right" text rounded size="small" @click="router.push({ name: 'PrestationDetail', params: { id: service.id } })" />
               </li>
               <li v-if="services.length === 0" class="text-gray-500 italic">{{ lang('noResults') }}</li>
             </ul>
           </div>

           <!-- Contact / Actions -->
           <div class="content-glass p-6 rounded-xl border border-purple-500/20">
             <Button :label="lang('contactUs') || 'Nous contacter'" icon="pi pi-envelope" class="w-full mb-3" severity="help" />
             <Button :label="lang('home.return') || 'Retour'" icon="pi pi-arrow-left" class="w-full" text @click="router.back()" />
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePrestataireStore } from '@/stores/prestataire.js';
import { useAuthStore } from '@/stores/authStore.js';
import { translations } from '@/datasource/lang.js';
import { prestations } from '@/datasource/data.js';
import { Avatar, Tag, Button } from 'primevue';

const route = useRoute();
const router = useRouter();
const prestataireStore = usePrestataireStore();
const authStore = useAuthStore();

const prestataire = ref(null);
const loading = ref(true);

const lang = (key) => {
  return translations[authStore.currentLanguage][key] || key;
};

const services = computed(() => {
  if (!prestataire.value) return [];
  return prestations.filter(p => p.prestataireId === prestataire.value.id);
});

onMounted(() => {
  const id = route.params.id;
  prestataire.value = prestataireStore.getPrestataireById(id);
  loading.value = false;
});
</script>

<style scoped>
.header-glass, .content-glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}

.prose :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}
</style>
