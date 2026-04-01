<template>
  <div class="about-container p-5 md:p-8">
    <!-- Hero Section -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 pb-2" style="color: var(--primary-color);">
        {{ lang('about.title') || 'À Propos de la Nécronomi\'Con' }}
      </h1>
      <p class="text-xl max-w-4xl mx-auto line-height-3 text-700 mt-0">
        {{ lang('about.subtitle') || "Découvrez l'événement geek incontournable du Nord Franche-Comté, créé par des passionnés pour des passionnés." }}
      </p>
    </div>

    <!-- The Team Section -->
    <div class="grid grid-nogutter align-items-center mb-8 surface-section border-round elevation-2 p-5 lg:p-7 shadow-3">
      <div class="col-12 lg:col-6 pr-0 lg:pr-6 mb-5 lg:mb-0">
        <h2 class="text-2xl md:text-3xl mb-4 text-900" style="line-height: 1.4;">
          <i class="pi pi-users mr-3 text-primary text-3xl"></i>
          {{ lang('about.team.title') || 'L\'Équipe Nécronomi\'Con' }}
        </h2>
        <p class="text-lg line-height-4 text-700 mb-4">
          La Nécronomi'Con est née d'un projet initié par des étudiants ambitieux de l'<strong>IUT Nord Franche-Comté</strong>.
          Notre équipe regroupe des profils variés, tous unis par une même passion : la culture geek, la pop-culture, le jeu vidéo et la culture japonaise.
        </p>
        <p class="text-lg line-height-4 text-700 mb-0">
          Chaque année, nous nous efforçons de créer un espace d'échange, de créativité et de divertissement où se rencontrent artistes, créateurs professionnels et amateurs.
          En partenariat avec des acteurs institutionnels et associatifs de la région, nos bénévoles mettent tout en œuvre pour vous offrir une expérience unique à l'Andelnans.
        </p>
      </div>
      <div class="col-12 lg:col-6 text-center">
        <img :src="equipeImage" alt="L'équipe Nécronomi'Con" class="w-full max-w-full border-round-xl shadow-4" style="max-height: 400px; object-fit: cover;" />
        <div class="mt-4 text-600 font-italic">Une communauté soudée et passionnée</div>
      </div>
    </div>

    <!-- History Timeline Section -->
    <div class="mb-8 p-5 lg:p-7 surface-section border-round shadow-3 elevation-2 border-1 surface-border">
      <div class="text-center mb-6">
        <h2 class="text-2xl md:text-4xl mb-4 text-900">
          <i class="pi pi-history mr-3 text-primary text-3xl"></i>
          Notre Histoire
        </h2>
        <p class="text-lg text-600 max-w-3xl mx-auto">
          De l'idée étudiante à l'un des plus grands rassemblements geeks de la région.
        </p>
      </div>

      <Timeline :value="timelineEvents" align="alternate" class="customized-timeline">
        <template #marker="slotProps">
          <span class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1" :style="{ backgroundColor: slotProps.item.color }">
            <i :class="slotProps.item.icon"></i>
          </span>
        </template>
        <template #content="slotProps">
          <div class="p-4 shadow-2 border-round surface-card mb-4 mt-2 transition-all transition-duration-300 hover:shadow-5" style="border: 1px solid var(--surface-border)">
            <div class="text-xl font-bold text-900 mb-2" style="font-family: 'Rajdhani', sans-serif;">{{ slotProps.item.status }}</div>
            <div class="text-primary mb-2 font-italic font-bold">{{ slotProps.item.date }}</div>
            <p class="text-700 m-0 line-height-3">{{ slotProps.item.text }}</p>
          </div>
        </template>
      </Timeline>
    </div>

    <!-- FAQ Section -->
    <div class="mb-8 p-5 lg:p-7 surface-section border-round shadow-3 elevation-2 border-1 surface-border">
      <div class="text-center mb-6">
        <h2 class="text-2xl md:text-4xl mb-4 text-900">
          <i class="pi pi-question-circle mr-3 text-primary text-3xl"></i>
          Questions Fréquentes (FAQ)
        </h2>
        <p class="text-lg text-600 max-w-3xl mx-auto">
          Toutes les réponses pour préparer votre visite à la Nécronomi'Con.
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div v-for="(faq, index) in faqItems" :key="index" class="mb-3 border-round border-1 surface-border surface-card overflow-hidden shadow-1 transition-all transition-duration-300 hover:border-primary">
          <div 
            class="p-4 flex align-items-center justify-content-between cursor-pointer select-none surface-50"
            @click="toggleFaq(index)"
          >
            <h3 class="m-0 text-xl font-bold text-800" style="font-family: 'Rajdhani', sans-serif;">{{ faq.question }}</h3>
            <i :class="['pi text-primary transition-all transition-duration-300', activeFaq === index ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
          </div>
          <div 
            class="faq-content surface-card" 
            :class="{ 'is-open': activeFaq === index }"
          >
            <p class="p-4 m-0 text-700 line-height-4 text-lg border-top-1 surface-border">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sponsors & Partners Section -->
    <div class="text-center mb-6">
      <h2 class="text-2xl md:text-4xl mb-4 text-900">
        {{ lang('about.sponsors.title') || 'Nos Partenaires et Sponsors' }}
      </h2>
      <p class="text-lg text-600 mb-6 max-w-3xl mx-auto">
        {{ lang('about.sponsors.subtitle') || 'Cet événement ne serait pas possible sans le soutien précieux de nos partenaires locaux et institutionnels.' }}
      </p>

      <div class="grid justify-content-center">
        <!-- Sponsor 1 -->
        <div v-for="sponsor in sponsors" :key="sponsor.name" class="col-12 sm:col-6 lg:col-3 p-3">
          <a :href="sponsor.url" target="_blank" rel="noopener noreferrer" class="no-underline">
            <div class="sponsor-card surface-card border-round p-5 h-full flex flex-column justify-content-center align-items-center transition-all transition-duration-300 hover:shadow-5 shadow-2 cursor-pointer border-1 surface-border">
              <img :src="sponsor.logo" :alt="sponsor.name" class="sponsor-logo mb-3" />
              <span class="text-xl font-semibold text-900 mt-auto text-center">{{ sponsor.name }}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore.js';
import { translations } from '@/datasource/lang.js';
import { Card, Timeline } from 'primevue';

import atraxionLogo from '@/assets/images/homeView/supporters/Atraxion-e1575534618439.jpg';
import creditMutuelLogo from '@/assets/images/homeView/supporters/CreditMutuel.jpg';
import iutBmLogo from '@/assets/images/homeView/supporters/IUTBM.png';
import vdfLogo from '@/assets/images/homeView/supporters/vdf3.png';
import ufcLogo from '@/assets/images/homeView/supporters/ufc-ok.png';
import cd90Logo from '@/assets/images/homeView/supporters/cd90.png';
import wiloutLogo from '@/assets/images/homeView/supporters/wilout-necro.png';
import europe2Logo from '@/assets/images/homeView/supporters/Europe_2_2023_-.svg_.png';
import equipeImage from '@/assets/images/equipe_soude.jpg';

const authStore = useAuthStore();

const lang = (key) => {
  return translations[authStore.currentLanguage]?.[key] || '';
};

const sponsors = [
  { name: 'IUT Nord Franche-Comté', url: 'https://www.iut-nfc.univ-fcomte.fr/', logo: iutBmLogo },
  { name: 'Ville de Belfort', url: 'https://www.belfort.fr/', logo: vdfLogo },
  { name: 'L\'AtraXion', url: 'https://www.latraxion.com/', logo: atraxionLogo },
  { name: 'Crédit Mutuel', url: 'https://www.creditmutuel.fr/', logo: creditMutuelLogo },
  { name: 'Conseil Départemental 90', url: 'https://www.territoiredebelfort.fr/', logo: cd90Logo },
  { name: 'Université de Franche-Comté', url: 'https://www.univ-fcomte.fr/', logo: ufcLogo },
  { name: 'Wilout', url: 'https://wilout.com/', logo: wiloutLogo },
  { name: 'Europe 2', url: 'https://www.europe2.fr/', logo: europe2Logo }
];

const timelineEvents = [
  { status: 'Création du projet', date: '2017', icon: 'pi pi-star', color: '#a855f7', text: 'Des étudiants de l\'IUT Nord Franche-Comté lancent le projet associatif.' },
  { status: 'L\'AtraXion', date: '2019', icon: 'pi pi-building', color: '#ec4899', text: 'L\'événement prend de l\'ampleur et s\'installe au Parc des expos l\'AtraXion à Andelnans.' },
  { status: 'Record d\'affluence', date: '2024', icon: 'pi pi-users', color: '#8b5cf6', text: 'Environ 8 500 visiteurs se rassemblent pour célébrer la pop culture et le jeu vidéo.' },
  { status: 'Saison 8', date: 'Avril 2026', icon: 'pi pi-calendar', color: '#10b981', text: 'Prochaine édition avec un programme encore plus grandiose et immersif !' }
];

const activeFaq = ref(null);

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index;
};

const faqItems = [
  {
    question: "Où et quand se déroule la Nécronomi'Con ?",
    answer: "L'événement se déroule traditionnellement au printemps (avril) au Parc des Expositions L'AtraXion, à Andelnans (près de Belfort)."
  },
  {
    question: "L'événement est-il accessible aux personnes à mobilité réduite (PMR) ?",
    answer: "Oui, tout à fait ! Le Parc des Expositions L'AtraXion est de plain-pied et dispose d'infrastructures adaptées et facilitées pour permettre à tout le monde de profiter de l'événement dans les meilleures conditions."
  },
  {
    question: "Peut-on venir en Cosplay ? Y a-t-il des règles spécifiques ?",
    answer: "Évidemment ! Le cosplay est au cœur de notre événement. Un vestiaire spécifique est mis à disposition. Veillez simplement à ce que vos répliques d'armes respectent les normes de sécurité en vigueur (pas d'armes contondantes en métal, ni d'armes à feu fonctionnelles)."
  },
  {
    question: "Peut-on acheter ses billets sur place ?",
    answer: "Vous pouvez acheter l'entrée sur place aux guichets dédiés, cependant nous recommandons fortement la billetterie en ligne pour éviter de longues files d'attente à l'entrée."
  },
  {
    question: "Comment puis-je devenir bénévole (staff) pour la Nécronomi'Con ?",
    answer: "Nous adorons accueillir de nouveaux passionnés dans notre grande famille ! Rendez-vous sur notre page 'Contactez nous' pour nous envoyer un petit message et proposer votre aide."
  }
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Rajdhani:wght@400;500;700&display=swap');

.about-container {
  font-family: 'Rajdhani', sans-serif;
  min-height: calc(100vh - 80px); /* Adjust based on navbar height */
  animation: fadeIn 0.5s ease-out;
}

h1, h2 {
  font-family: 'Press Start 2P', cursive;
  font-weight: normal; /* Press Start 2P is bold by default and only supports weight 400 */
}

.sponsor-card {
  transform: translateY(0);
}

.sponsor-logo {
  max-height: 80px;
  max-width: 100%;
  object-fit: contain;
}

.sponsor-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary-color) !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.faq-content {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-content.is-open {
  max-height: 300px;
  opacity: 1;
}
</style>
