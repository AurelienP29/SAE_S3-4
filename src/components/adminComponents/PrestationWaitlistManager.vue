<template>
  <div class="card">
    <DataTable :value="waitlist" tableStyle="min-width: 50rem" paginator :rows="10">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">{{ lang('admin.waitlist.title') }}</span>
        </div>
      </template>
      <template #empty> {{ lang('admin.prestationWaitlist.empty') }} </template>

      <Column field="name" :header="lang('prestation.colName')" sortable></Column>
      <Column field="Champ1" :header="lang('prestation.colZone')" sortable></Column>
      <Column field="category" :header="lang('prestation.colCategory')" sortable>
        <template #body="slotProps">
          {{ lang('category.' + slotProps.data.category) }}
        </template>
      </Column>
      <Column field="requestDate" :header="lang('admin.waitlist.colDate')" sortable></Column>
      <Column :header="lang('admin.action')">
        <template #body="slotProps">
          <Button icon="pi pi-check" severity="success" class="mr-2" style="margin-right: 5px" @click="acceptPrestation(slotProps.data)" v-tooltip.top="lang('admin.waitlist.accept')" />
          <Button icon="pi pi-times" severity="danger" @click="rejectPrestation(slotProps.data)" v-tooltip.top="lang('admin.waitlist.reject')" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DataTable, Column, Button } from 'primevue';
import {prestationWaitingList as initialWaitlist, prestations} from '@/datasource/data.mjs';
import {usePrestationStore} from "@/stores/prestation.js";
import { useAuthStore } from '@/stores/authStore.js';
import { translations } from '@/datasource/lang.js';

const authStore = useAuthStore();
const lang = (key) => {
  return translations[authStore.currentLanguage][key] || key;
};

const waitlist = ref([...initialWaitlist]);
const prestationStore = usePrestationStore()


const acceptPrestation = (prestation) => {
    // prestations.push(prestation);
  const newId = prestations.length > 0 ? Math.max(...prestations.map(p => p.id)) + 1 : 1;
  const newPrestation = { ...prestation, id: newId };
  delete newPrestation.requestDate;

  prestations.push(newPrestation);
  prestationStore.addPrestation(newPrestation);
  removeFromWaitlist(prestation.id);
};

const rejectPrestation = (prestation) => {
  removeFromWaitlist(prestation.id);
};

const removeFromWaitlist = (id) => {
  waitlist.value = waitlist.value.filter(p => p.id !== id);
  
  const index = initialWaitlist.findIndex(p => p.id === id);
  if (index !== -1) initialWaitlist.splice(index, 1);
};
</script>

<style scoped>

</style>
