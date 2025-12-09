<template>
  <div class="card">
    <DataTable :value="waitlist" tableStyle="min-width: 50rem" paginator :rows="10">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">File d'attente Prestataires</span>
        </div>
      </template>
      <template #empty> Aucune demande en attente. </template>

      <Column field="name" header="Nom" sortable></Column>
      <Column field="email" header="Email" sortable></Column>
      <Column field="category" header="Catégorie" sortable></Column>
      <Column field="requestDate" header="Date de demande" sortable></Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button icon="pi pi-check" severity="success" class="mr-2" style="margin-right: 5px" @click="acceptPrestataire(slotProps.data)" v-tooltip.top="'Accepter'" />
          <Button icon="pi pi-times" severity="danger" @click="rejectPrestataire(slotProps.data)" v-tooltip.top="'Refuser'" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DataTable, Column, Button } from 'primevue';
import {waitingList as initialWaitlist, prestataires, initialPrestataires} from '@/datasource/data.js';
import {usePrestataireStore} from "@/stores/prestataire.js";

const waitlist = ref([...initialWaitlist]);
const prestataireStore = usePrestataireStore()


const acceptPrestataire = (prestataire) => {
  const newId = prestataires.length > 0 ? Math.max(...prestataires.map(p => p.id)) + 1 : 1;
  const newPrestataire = { ...prestataire, id: newId };
  delete newPrestataire.requestDate;

  prestataires.push(newPrestataire);
  initialPrestataires.push(newPrestataire);
  prestataireStore.addPrestataire(newPrestataire);
  removeFromWaitlist(prestataire.id);
};

const rejectPrestataire = (prestataire) => {
  removeFromWaitlist(prestataire.id);
};

const removeFromWaitlist = (id) => {
  waitlist.value = waitlist.value.filter(p => p.id !== id);
  
  const index = initialWaitlist.findIndex(p => p.id === id);
  if (index !== -1) initialWaitlist.splice(index, 1);
};
</script>

<style scoped>

</style>
