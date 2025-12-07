<template>
  <div class="admin-prestataire-manager">
    <DataTable
        :value="prestations"
        dataKey="id"
        paginator
        :rows="10"
        responsiveLayout="scroll"
        :loading="loading"
    >
      <Column field="name" header="Nom" sortable/>
      <Column field="Champ1" header="Champ1" sortable/>
      <Column field="Champ2" header="Champ2"/>
      <Column field="category" header="Catégorie"/>
    </DataTable>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import DataTable from 'primevue/datatable'

import Column from 'primevue/column'
const loading = ref(false)

import { prestations } from '@/datasource/data.js'
</script>

<style scoped>
.admin-prestataire-manager {
  padding: 1rem;
}
</style>
