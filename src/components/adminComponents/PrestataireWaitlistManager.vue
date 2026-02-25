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
      <Column field="email" header="Email" sortable></Column>
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
import {waitingList, prestataires, initialPrestataires} from '@/datasource/data.mjs';
import {usePrestataireStore} from "@/stores/prestataire.js";
import { useAuthStore } from '@/stores/authStore.js';
import { translations } from '@/datasource/lang.js';

const authStore = useAuthStore();
const lang = (key) => {
  return translations[authStore.currentLanguage][key] || key;
};

const waitlist = waitingList;
const prestataireStore = usePrestataireStore()

const formatServices = (services) => {
  if (!Array.isArray(services) || services.length === 0) {
    return '-';
  }

  return services.map((service) => lang(`service.${service}`)).join(', ');
};

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
};
</script>

<style scoped>

</style>
