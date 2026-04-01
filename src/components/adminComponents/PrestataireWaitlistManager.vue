<template>
  <div class="card">
    <DataTable :value="waitlist" tableStyle="min-width: 50rem" paginator :rows="10">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">{{ lang('admin.providerManager.title') }}</span>
        </div>
      </template>
      <template #empty> {{ lang('admin.waitlist.empty') }} </template>

      <Column field="name" :header="lang('prestataire.colName')" sortable></Column>
      <Column field="email" :header="lang('admin.accountManager.colEmail')" sortable></Column>
      <Column field="category" :header="lang('prestataire.colCategory')" sortable>
        <template #body="slotProps">
          {{ lang('category.' + slotProps.data.category) }}
        </template>
      </Column>
      <Column :header="lang('admin.waitlist.colServices')">
        <template #body="slotProps">
          {{ formatServices(slotProps.data.services) }}
        </template>
      </Column>
      <Column field="requestDate" :header="lang('admin.waitlist.colDate')" sortable></Column>
      <Column :header="lang('admin.action')">
        <template #body="slotProps">
          <Button icon="pi pi-check" severity="success" class="mr-2" style="margin-right: 5px" @click="acceptPrestataire(slotProps.data)" v-tooltip.top="lang('admin.waitlist.accept')" />
          <Button icon="pi pi-times" severity="danger" @click="rejectPrestataire(slotProps.data)" v-tooltip.top="lang('admin.waitlist.reject')" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { DataTable, Column, Button } from 'primevue';
import {usePrestataireStore} from "@/stores/prestataire.js";
import {useWaitingListStore} from "@/stores/waitingListStore.js";
import { useAuthStore } from '@/stores/authStore.js';
import { translations } from '@/datasource/lang.js';
import emailjs from "@emailjs/browser";
import { onMounted, computed } from 'vue';

const authStore = useAuthStore();
const lang = (key) => {
  return translations[authStore.currentLanguage][key] || key;
};

const waitingListStore = useWaitingListStore();
const waitlist = computed(() => waitingListStore.waitingList);
const prestataireStore = usePrestataireStore();

onMounted(() => {
  waitingListStore.fetchWaitingList();
});

const formatServices = (services) => {
  if (!Array.isArray(services) || services.length === 0) {
    return '-';
  }

  return services.map((service) => lang(`service.${service}`)).join(', ');
};

const acceptPrestataire = async (prestataire) => {
  const newPrestataireData = { ...prestataire };
  delete newPrestataireData._id;
  delete newPrestataireData.id;
  delete newPrestataireData.requestDate;

  let randomPassword = Math.random().toString(36).slice(-8);

  try {
    // Tentative de création d'utilisateur
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const userRes = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: prestataire.name,
        email: prestataire.email,
        password: randomPassword,
        role: 'prestataire',
        phone: prestataire.phone || '',
        description: prestataire.description || ''
      })
    });

    if (!userRes.ok && userRes.status !== 409) {
      console.error('Erreur de création utilisateur');
    }
    
    // Si l'utilisateur existait (409), l'idéal serait de mettre à jour son rôle, 
    // mais on s'assure d'abord que le prestataire est ajouté en DB



    // Simulation de l'envoi d'email

    const translationMail = {
      fr: {
        salutations: "Bonjour ",
        introMsg : "C'est avec plaisir que je vous informe que votre demande de prestations a été acceptée et validée.",
        titreRecap : "Récapitulatif de votre prestation :",
        typeBoutique: "Type de boutique :",
        coreMsg: "Nous sommes impatients de commencer cette collaboration. La prochaine étape consiste à vous connecter à votre page de profil pour la personnaliser !",
        bouton: "Voir mon profil",
        mdp: "Votre mot de passe temporaire est :",
        identifiant: "Votre identifiant est :",
        outMsg: "A très vite, l'équipe Necronomi'con",
        droits: "Tous droits réservés",
        footerMsg: "Vous recevez cet email car une prestation a été validée avec votre adresse."
      },
      en : {
        salutations: "Hello ",
        introMsg : "We are happy to inform you that your prestation request has been accepted and validated.",
        titreRecap : "Your prestation summary :",
        typeBoutique: "Boutique type :",
        coreMsg: "We are excited to start this collaboration. The next step is to log in to your profile to customize it!",
        bouton: "See my profile",
        mdp: "Your temporary password is :",
        identifiant: "Your identifier is :",
        outMsg: "Stay tuned, the Necronomi'con team"
      }
    }

    const t = (key) => {
      return translationMail[authStore.currentLanguage]?.[key] || translationMail.fr[key]
    }

    const templateParam = {
      email: prestataire.email,
      name: prestataire.name,
      boutiqueType: prestataire.typeBoutique,
      dates: prestataire.dates,
      services: prestataire.services.map(service => lang(`service.${service}`)).join(', '),
      salutations: t('salutations') + prestataire.name,
      introMsg: t('introMsg'),
      titreRecap: t('titreRecap'),
      typeBoutique: t('typeBoutique') + prestataire.typeBoutique,
      coreMsg: t('coreMsg'),
      bouton: t('bouton'),
      mdp: t('mdp') + randomPassword,
      identifiant: t('identifiant') + prestataire.email,
      outMsg: t('outMsg'),
      droits: t('droits')
    }

    emailjs.send('service_c8v4m1m', 'template_n62o9zo', templateParam, '35QMzN_dvjeN3YUiG')
        .then((message) => {
              console.log('SUCCESS!', message);
            }, (error) => {
              console.log('FAILED...', error);
            }
        )

  // Ajout au store (gère l'API externe MongoDB)
  await prestataireStore.addPrestataire(newPrestataireData);
  await waitingListStore.deleteRequest(prestataire._id || prestataire.id);
  } catch (error) {
    console.error(error)
  }
};

const rejectPrestataire = async (prestataire) => {
  await waitingListStore.deleteRequest(prestataire._id || prestataire.id);
};
</script>

<style scoped>

</style>
