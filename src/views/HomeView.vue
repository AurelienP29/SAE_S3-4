<template>
  <div class="necro-layout">

    <header class="hero-section" style="background-image: url('/src/assets/images/homeView/conPic2.jpg');">
      <div class="hero-overlay"></div>

      <div class="hero-content">
        <div class="banner-wrapper fade-in-down">
          <img src="/public/images/home-banner.jpg" alt="Necronomi'con Banner" class="floating-banner">
        </div>

        <h1 class="glitch-title fade-in-up" :data-text="texts.banner">{{ texts.banner }}</h1>

        <div class="scroll-indicator">
          <span>﹀</span>
        </div>
      </div>
    </header>

    <main class="main-container">

      <section class="grid-row scroll-reveal">
        <div class="text-col">
          <h2 class="neon-title">{{ texts.intro }}</h2>
          <div class="glass-text-box">
            <p>{{ texts.description }}</p>
          </div>
        </div>
        <div class="visual-col center-content">
          <div class="deco-circle">
            <span class="emoji">👾</span>
          </div>
        </div>
      </section>

      <section class="grid-row scroll-reveal">

        <div class="visual-col map-container">
          <div class="map-frame">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2690.089298896684!2d6.8599186124863225!3d47.604953271069576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47923e1b276a30bb%3A0x2104ccadfe33b055!2sL&#39;%20AtraXion%20-%20Parc%20des%20Expositions%20de%20Belfort%20-%20H%C3%A9ricourt%20-%20Montb%C3%A9liard!5e0!3m2!1sfr!2sfr!4v1760515696559!5m2!1sfr!2sfr"
                width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>

        <div class="text-col sticky-col" style="max-width: 100%; max-height: 100%;">
          <h2 class="neon-title">{{ texts.locationTitle }}</h2>
          <p class="mb-4">{{ texts.mapTitle }}</p>
          <div class="map-actions">
            <InteractiveMap
                :current-user="authStore.user"
                :enable-actions="false"
            />
          </div>
        </div>
      </section>

      <section class="full-width-row scroll-reveal">
        <div class="glass-panel-wide">
          <PrestataireTable mode="prestations"/>
        </div>
      </section>

      <section class="full-width-row scroll-reveal">
        <div class="glass-panel-wide">
          <PrestataireTable mode="prestataires"/>
        </div>
      </section>


      <section class="grid-row scroll-reveal">
        <div class="visual-col center-content">
          <div class="deco-square">
            <span class="emoji">
              <img src="/src/assets/images/question-mark-8127954_640.png" alt="Question Mark" height="100px" width="100%"/>
            </span>
          </div>
        </div>
        <div class="text-col">
          <h2 class="neon-title">{{ texts.originTitle }}</h2>
          <div class="glass-text-box">
            {{ texts.originDescription }}
          </div>
        </div>
      </section>

    </main>

    <div class="section-separator"></div>

    <footer class="supporters-section">
      <h2 class="section-title dark-text">{{ texts.supportersTitle }}</h2>
      <div class="carousel-wrapper">
        <InfiniteCarousel :items="supporterItems" duration="60s"/>
      </div>
    </footer>

  </div>
</template>

<script setup>
import PrestataireTable from "@/components/PrestataireTable.vue";
import {useAuthStore} from '@/stores/authStore.js';
import {mainPageTextPresentation} from '@/datasource/data.mjs';
import {computed, onMounted} from 'vue';
import InfiniteCarousel from '@/components/homeComponents/infiniteCarousel.vue';
import InteractiveMap from "@/components/InteractiveMap.vue";

const authStore = useAuthStore();

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  });

  const hiddenElements = document.querySelectorAll('.scroll-reveal');
  hiddenElements.forEach((el) => observer.observe(el));
});

const texts = computed(() => {
  // return mainPageTextPresentation.fr;
  return mainPageTextPresentation[authStore.currentLanguage] || mainPageTextPresentation.fr;
});


const getImageUrl = (path) => {
  return new URL(`/src/assets/images/homeView/supporters/${path}`, import.meta.url).href;
};
const supporters = [
  {link: 'https://www.dagoma3d.com/', imgName: 'dagoma-baseline.png'},
  {link: 'https://cybersecurite.trinaps.com/', imgName: 'Trinaps_logo_RVB_transparent_500px.png'},
  {link: 'https://www.europe2.fr/', imgName: 'Europe_2_2023_-.svg_.png'},
  {link: 'https://www.belfort.fr/', imgName: 'vdf3.png'},
  {link: 'https://www.territoiredebelfort.fr/', imgName: 'cd90.png'},
  {link: 'http://www.univ-fcomte.fr/', imgName: 'ufc-ok.png'},
  {link: 'http://www.iut-bm.univ-fcomte.fr/', imgName: 'IUTBM.png'},
  {link: 'http://www.lpmosel.fr/', imgName: 'LPMOSEL.png'},
  {link: 'https://www.avantagesjeunes.com/', imgName: 'AvantagesJeunes.jpg'},
  {link: 'https://letrois.info/', imgName: 'letrois-e1562845802515.png'},
  {link: 'http://www.alaconquetedelest.fr/', imgName: 'Conquetedelest.jpg'},
  {link: 'http://latraxion.com/', imgName: 'Atraxion-e1575534618439.jpg'},
  {link: 'http://www.tnt-events.fr/', imgName: 'TNT.jpg'},
  {link: 'https://www.creditmutuel.fr/home/index.html', imgName: 'CreditMutuel.jpg'},
  {link: 'http://www.cfcosplay.com/', imgName: 'cfc-2-e1575534693739.png'},
  {link: 'https://wilout.com/', imgName: 'wilout-necro.png'},
  {link: 'https://fcbs.fr/', imgName: 'fcbs-ok2.png'},
];

const supporterItems = supporters.map(s => ({...s, src: getImageUrl(s.imgName)}));
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Rajdhani:wght@400;500;700&display=swap');

/* --- VARIABLES --- */
:root {
  --necro-bg: #000000;
  --necro-accent: #a855f7; /* Purple */
  --necro-glow: #22c55e; /* Green */
  --necro-text: #f1f5f9;
  --glass-bg: rgba(30, 27, 46, 0.6);
  --glass-border: rgba(168, 85, 247, 0.2);
}

.necro-layout {
  background-color: var(--necro-bg);
  min-height: 100vh;
  color: var(--necro-text);
  font-family: 'Rajdhani', sans-serif;
  overflow-x: hidden;
}

/* --- HERO SECTION --- */
.hero-section {
  position: relative;
  height: 93vh;
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Parallax */
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(11, 9, 20, 0.3) 0%, #0b0914 100%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 20px;
}

.floating-banner {
  max-width: 800px;
  width: 90vw;
  border-radius: 12px;
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.4);
  transform: perspective(1000px) rotateX(5deg);
  transition: transform 0.3s ease;
}

.floating-banner:hover {
  transform: perspective(1000px) rotateX(0deg) scale(1.02);
}

.glitch-title {
  font-family: 'Press Start 2P', monospace;
  font-size: 1.8rem;
  color: #fff;
  text-shadow: 4px 4px 0px var(--necro-accent);
  margin-top: 2rem;
}

.scroll-indicator {
  margin-top: 4rem;
  font-size: 2rem;
  animation: bounce 2s infinite;
  opacity: 0.7;
}

/* --- MAIN LAYOUT (ZIG ZAG GRID) --- */
.main-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 8rem; /* Large spacing for clean look */
}

.grid-row {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Split screen */
  gap: 4rem;
  align-items: center;
}

.full-width-row {
  width: 100%;
}

/* --- COMPONENTS --- */

/* Glass Text Box */
.glass-text-box {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  font-size: 1.2rem;
}

/* Green accent line on left of text */
.glass-text-box::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10%;
  bottom: 10%;
  width: 4px;
  background: var(--necro-glow);
  border-radius: 0 5px 5px 0;
}

.neon-title {
  font-family: 'Press Start 2P', cursive;
  color: var(--necro-accent);
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

/* Map specific styling */
.map-container {
  height: auto;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #333;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}


/* Decorative Circles/Squares */
.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.deco-circle, .deco-square {
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--necro-glow);
  box-shadow: 0 0 50px rgba(34, 197, 94, 0.1);
  font-size: 5rem;
  animation: float 6s ease-in-out infinite;
}

.deco-circle {
  border-radius: 50%;
}

.deco-square {
  border-radius: 12px;
  border-color: var(--necro-accent);
}

/* Prestataire Table Wrapper */
.glass-panel-wide {
  background: rgba(216, 216, 216, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1rem;
}

/* --- FOOTER --- */
.section-separator {
  height: 80px;
  background: linear-gradient(to top right, transparent 49%, #f8fafc 50%);
  margin-top: 4rem;
}

.supporters-section {
  background-color: #f8fafc;
  padding: 2rem 0 4rem;
}

.section-title.dark-text {
  color: #1e1b2e;
  text-align: center;
  font-family: 'Press Start 2P';
  margin-bottom: 2rem;
}

/* --- ANIMATIONS & TRANSITIONS --- */

/* Initial Loading Animations */
.fade-in-down {
  animation: fadeDown 1s ease-out forwards;
  opacity: 0;
}

.fade-in-up {
  animation: fadeUp 1s ease-out 0.3s forwards;
  opacity: 0;
}

@keyframes fadeDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* Scroll Reveal Logic */
.scroll-reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease-out;
}

.scroll-reveal.active {
  opacity: 1;
  transform: translateY(0);
}

/* --- RESPONSIVE --- */
@media (max-width: 900px) {
  .hero-section {
    height: 75vh;
    background-attachment: scroll;
  }

  .grid-row {
    grid-template-columns: 1fr; /* Stack vertically on mobile */
    gap: 3rem;
  }

  /* Reorder mobile: Visuals usually look better AFTER text on mobile, or Before?
     Let's put Text first for readability. */
  .text-col {
    order: 1;
  }

  .visual-col {
    order: 2;
    margin-bottom: 2rem;
  }

  .floating-banner {
    width: 95vw;
  }

  .glitch-title {
    font-size: 1.2rem;
  }

  .glass-text-box {
    padding: 1.5rem;
  }
}

body {
  margin: 0;
}
</style>