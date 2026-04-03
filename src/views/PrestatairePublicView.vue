<template>
  <div class="prestataire-public-layout">
    <!-- Overlay image or texture -->
    <div class="bg-overlay"></div>

    <div v-if="loading" class="loading-state">
      <i class="pi pi-spin pi-spinner loading-icon"></i>
      <p>Chargement du profil...</p>
    </div>

    <div v-else-if="!prestataire" class="empty-state">
      <i class="pi pi-exclamation-circle error-icon"></i>
      <h2>{{ lang('prestataire.not_found') || 'Prestataire non trouvé' }}</h2>
      <button class="action-btn text-btn" @click="router.push('/')">
        <i class="pi pi-home"></i> {{ lang('home.return') || 'Retour' }}
      </button>
    </div>

    <div v-else class="content-wrapper">
      
      <!-- HEADER CARD -->
      <header class="profile-header glass-panel fade-in-up">
        <div class="header-inner">
          <div class="avatar-container">
            <Avatar v-if="prestataire.picture" :image="prestataire.picture" size="xlarge" shape="circle" class="profile-avatar-img" />
            <Avatar v-else :label="prestataire.name.charAt(0).toUpperCase()" size="xlarge" shape="circle" class="profile-avatar-init" />
            <div class="glow-ring"></div>
          </div>
          <div class="header-info">
            <h1 class="glitch-title" :data-text="prestataire.name">{{ prestataire.name }}</h1>
            <Tag :value="lang('category.' + prestataire.category)" class="category-tag mb-3" />
            <div class="contact-info">
              <span v-if="prestataire.phone"><i class="pi pi-phone"></i> {{ prestataire.phone }}</span>
              <span v-if="prestataire.email" class="spacer">|</span>
              <span v-if="prestataire.email"><i class="pi pi-envelope"></i> {{ prestataire.email }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- TWO COLUMNS LAYOUT -->
      <div class="profile-grid">
        
        <!-- MAIN COLUMN -->
        <main class="main-column">
          <!-- Presentation -->
          <section class="glass-panel text-section fade-in-up delay-1">
            <h2 class="neon-title">{{ lang('prestataire.public.presentation') || 'Présentation' }}</h2>
            <div class="divider"></div>
            <div class="prose-content" v-html="prestataire.publicPageText || prestataire.description"></div>
          </section>

          <!-- Images Gallery -->
          <section v-if="prestataire.publicPageImages && prestataire.publicPageImages.length" class="glass-panel text-section fade-in-up delay-2 mt-4">
            <h2 class="neon-title">Galerie</h2>
            <div class="divider"></div>
            <div class="gallery-grid">
              <div v-for="(img, idx) in prestataire.publicPageImages" :key="idx" class="gallery-item">
                <img :src="img" alt="Gallery image" class="gallery-img" />
              </div>
            </div>
          </section>
        </main>

        <!-- SIDEBAR -->
        <aside class="sidebar-column fade-in-up delay-[2]">
          
          <!-- Services -->
          <div class="glass-panel sidebar-panel">
            <h3 class="panel-title"><i class="pi pi-box mr-2"></i>{{ lang('prestataire.services') || 'Nos Prestations' }}</h3>
            <div class="divider"></div>
            
            <ul v-if="services.length > 0" class="services-list">
              <li v-for="service in services" :key="service.id" class="service-item">
                <div class="service-info">
                  <span class="service-name">{{ service.name }}</span>
                  <span class="service-cat">{{ lang('category.' + service.category) }}</span>
                </div>
                <button class="icon-btn" @click="router.push({ name: 'PrestationDetail', params: { id: service.id } })" title="Voir les détails">
                  <i class="pi pi-arrow-right"></i>
                </button>
              </li>
            </ul>
            <div v-else class="empty-services">
               {{ lang('noResults') || 'Aucune prestation disponible' }}
            </div>
          </div>

          <!-- Actions -->
          <div class="glass-panel sidebar-panel actions-panel mt-4">
             <button class="action-btn w-full mb-3 btn-contact">
               <i class="pi pi-envelope"></i> {{ lang('contactUs') || 'Nous contacter' }}
             </button>
             <button class="action-btn text-btn w-full" @click="router.back()">
               <i class="pi pi-arrow-left"></i> {{ lang('home.return') || 'Retour' }}
             </button>
          </div>
        </aside>

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
import { prestations } from '@/datasource/data.mjs';
import { Avatar, Tag, Button } from 'primevue';

const route = useRoute();
const router = useRouter();
const prestataireStore = usePrestataireStore();
const authStore = useAuthStore();

const prestataire = ref(null);
const loading = ref(true);

const lang = (key) => {
  return translations[authStore.currentLanguage]?.[key] || key;
};

const services = computed(() => {
  if (!prestataire.value) return [];
  return prestations.filter(p => p.prestataireId === prestataire.value.id);
});

onMounted(async () => {
  const id = route.params.id;
  loading.value = true;
  prestataire.value = await prestataireStore.fetchPrestataireById(id);
  loading.value = false;
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Rajdhani:wght@400;500;600;700&display=swap');

/* --- MAIN LAYOUT --- */
.prestataire-public-layout {
  min-height: 100vh;
  background-color: #f9f7f5; /* Light theme beige */
  color: #334155;
  font-family: 'Rajdhani', sans-serif;
  position: relative;
  overflow-x: hidden;
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 20%, rgba(168, 85, 247, 0.08) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* --- STATE BLOCKS --- */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1.5rem;
  z-index: 10;
}
.loading-icon { font-size: 3rem; color: #a855f7; }
.empty-state h2 { font-size: 2rem; font-family: 'Rajdhani', sans-serif; color: #1e293b; text-transform: uppercase; }
.error-icon { font-size: 4rem; color: #ef4444; }

/* --- GLASS PANELS --- */
.glass-panel {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(168, 85, 247, 0.15);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.glass-panel:hover {
  box-shadow: 0 15px 40px rgba(168, 85, 247, 0.1);
  border-color: rgba(168, 85, 247, 0.3);
}

/* --- HEADER --- */
.profile-header {
  padding: 3rem;
  overflow: hidden;
  position: relative;
}
.header-inner {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 3rem;
}

.avatar-container {
  position: relative;
  flex-shrink: 0;
}
:deep(.profile-avatar-img), :deep(.profile-avatar-init) {
  width: 130px !important;
  height: 130px !important;
  border: 3px solid #a855f7;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
  background: #4c1d95;
  color: white;
  font-size: 3.5rem;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  z-index: 2;
}

/* Subtle glow behind avatar */
.glow-ring {
  position: absolute;
  top: -10px; left: -10px; right: -10px; bottom: -10px;
  border-radius: 50%;
  background: conic-gradient(rgba(168,85,247,0), rgba(168,85,247,0.4), rgba(168,85,247,0));
  animation: spin 4s linear infinite;
  z-index: 1;
}
@keyframes spin { 100% { transform: rotate(360deg); } }

.header-info {
  display: flex; flex-direction: column; align-items: flex-start;
}
.glitch-title {
  font-family: 'Press Start 2P', monospace;
  font-size: 2.2rem;
  color: #1e293b;
  text-shadow: 2px 2px 0px rgba(168, 85, 247, 0.4);
  margin: 0 0 1rem 0;
  line-height: 1.5;
  text-transform: uppercase;
}
:deep(.category-tag) {
  background: rgba(168, 85, 247, 0.2);
  color: #6b656b;
  border: 1px solid rgba(168, 85, 247, 0.4);
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.3rem 1rem;
}
.contact-info {
  display: flex; align-items: center; gap: 1rem;
  font-size: 1.1rem; color: #475569; font-style: italic; font-weight: 500;
}
.contact-info i { color: #a855f7; margin-right: 0.3rem; }
.spacer { color: rgba(0,0,0,0.15); }

/* --- GRID LAYOUT --- */
.profile-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}
.main-column, .sidebar-column {
  display: flex; flex-direction: column;
}

/* --- TYPOGRAPHY & SECTIONS --- */
.neon-title {
  font-family: 'Press Start 2P', monospace;
  color: #a855f7;
  font-size: 1.2rem;
  text-transform: uppercase;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}
.divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(168, 85, 247, 0.5) 0%, transparent 100%);
  margin-bottom: 1.5rem;
}

/* Rich Text Content */
.prose-content {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #334155;
}
.prose-content :deep(p) { margin-bottom: 1.5rem; }
.prose-content :deep(a) { color: #c084fc; text-decoration: underline; }
.prose-content :deep(a:hover) { color: #d8b4fe; }

/* Gallery */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}
.gallery-item {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(168, 85, 247, 0.2);
  aspect-ratio: 4/3;
  position: relative;
}
.gallery-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.gallery-item:hover .gallery-img {
  transform: scale(1.08);
}

/* --- SIDEBAR --- */
.sidebar-panel { padding: 2rem; }
.panel-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.5rem; font-weight: 700; color: #1e293b;
  margin: 0 0 1rem 0; text-transform: uppercase; letter-spacing: 0.05em;
  display: flex; align-items: center;
}
.services-list {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 0.8rem;
}
.service-item {
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 0.8rem 1rem;
  border-radius: 10px;
  transition: background 0.2s;
}
.service-item:hover {
  background: rgba(168, 85, 247, 0.1);
  border-color: rgba(168, 85, 247, 0.3);
}
.service-info {
  display: flex; flex-direction: column; gap: 0.2rem;
}
.service-name { font-weight: 600; font-size: 1.1rem; color: #1e293b; }
.service-cat { font-size: 0.85rem; color: #a855f7; text-transform: uppercase; font-weight: 700; }

.icon-btn {
  background: rgba(168,85,247,0.15); color: #d8b4fe;
  border: 1px solid rgba(168,85,247,0.3);
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s;
}
.icon-btn:hover { background: #a855f7; color: white; transform: translateX(3px); }

.empty-services {
  color: #64748b; font-style: italic; font-size: 1.1rem; opacity: 0.8;
}

/* --- BUTTONS --- */
.action-btn {
  display: flex; align-items: center; justify-content: center; gap: 0.6rem;
  padding: 0.8rem 1.5rem; border-radius: 8px; font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem; font-weight: 700; text-transform: uppercase; cursor: pointer;
  border: none; transition: all 0.2s;
}
.btn-contact {
  background: linear-gradient(135deg, #a855f7, #6d28d9); color: white;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
}
.btn-contact:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(168, 85, 247, 0.5); }

.text-btn {
  background: rgba(0,0,0,0.03); color: #475569;
  border: 1px solid rgba(0,0,0,0.08);
}
.text-btn:hover { background: rgba(0,0,0,0.06); color: #0f172a; }

.w-full { width: 100%; }
.mb-3 { margin-bottom: 0.8rem; }
.mt-4 { margin-top: 1.25rem; }
.mr-2 { margin-right: 0.5rem; }

/* --- ANIMATIONS --- */
.fade-in-up {
  animation: fadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  opacity: 0; transform: translateY(30px);
}
.delay-1 { animation-delay: 0.15s; }
.delay-2 { animation-delay: 0.3s; }
@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

/* --- RESPONSIVE --- */
@media (max-width: 900px) {
  .profile-grid { grid-template-columns: 1fr; }
  .header-inner { flex-direction: column; text-align: center; gap: 1.5rem; }
  .header-info { align-items: center; text-align: center; }
  .contact-info { flex-direction: column; gap: 0.5rem; }
  .spacer { display: none; }
  .glitch-title { font-size: 1.8rem; }
  .prestataire-public-layout { padding: 2rem 1rem; }
}
</style>
