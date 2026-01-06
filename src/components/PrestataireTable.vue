<template>
  <div class="admin-prestataire-manager card">
    <DataTable
        v-model:filters="filters"
        :value="data"
        paginator
        :rows="10"
        dataKey="id"
        filterDisplay="row"
        :loading="loading"
        :globalFilterFields="['name', 'Champ1', 'prestataireName', 'email', 'category']"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold uppercase text-white m-0">
            {{ mode === 'prestations' ? 'Liste des Prestations' : 'Liste des Prestataires' }}
          </h3>
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Recherche globale..." />
          </IconField>
        </div>
      </template>

      <template #empty> Aucun résultat trouvé. </template>

      <Column field="name" :header="mode === 'prestations' ? 'Prestation' : 'Nom'" sortable style="min-width: 12rem">
        <template #body="{ data }">
          <router-link v-if="mode === 'prestations'" :to="{ name: 'PrestationDetail', params: { id: data.id } }" class="text-purple-400 font-bold hover:text-purple-300 no-underline">
            {{ data.name }}
          </router-link>
          <span v-else>{{ data.name }}</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="Filtrer par nom"
              class="p-column-filter"
          />
        </template>
      </Column>

      <Column v-if="mode === 'prestations'" field="Champ1" header="Zone" sortable style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.Champ1 }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="Filtrer..."
              class="p-column-filter"
          />
        </template>
      </Column>

      <Column v-if="mode === 'prestations'" field="prestataireName" header="Prestataire lié" sortable style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.prestataireName }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="Filtrer..."
              class="p-column-filter"
          />
        </template>
      </Column>

      <Column v-if="mode === 'prestataires'" field="email" header="Email" sortable style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.email }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="Filtrer..."
              class="p-column-filter"
          />
        </template>
      </Column>

      <Column field="category" header="Catégorie" :showFilterMenu="false" style="min-width: 12rem">
        <template #body="{ data }">
          <span class="font-bold">{{ data.category }}</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select
              v-model="filterModel.value"
              @change="filterCallback()"
              :options="uniqueCategories"
              placeholder="Choisir une catégorie"
              style="min-width: 12rem"
              :showClear="true"
          >
            <template #option="slotProps">
              {{ slotProps.option }}
            </template>
          </Select>
        </template>
      </Column>

    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api'; // Or 'primevue/api' depending on version
import { prestations, prestataires } from '@/datasource/data.js';

import { DataTable, Column, InputText, Select, IconField, InputIcon} from 'primevue';

const props = defineProps({
  mode: {
    type: String,
    default: 'prestations' // 'prestations' or 'prestataires'
  }
});

const loading = ref(true);

const data = computed(() => {
  if (props.mode === 'prestataires') {
    return prestataires;
  }
  return prestations.map(p => {
    const prestataire = prestataires.find(pr => pr.id === p.prestataireId);
    return {
      ...p,
      prestataireName: prestataire ? prestataire.name : 'Indépendant'
    };
  });
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  Champ1: { value: null, matchMode: FilterMatchMode.CONTAINS },
  prestataireName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  category: { value: null, matchMode: FilterMatchMode.EQUALS }
});

// 2. Extract unique categories dynamically from the data for the dropdown
const uniqueCategories = computed(() => {
  const currentData = data.value;
  if (!currentData || currentData.length === 0) return [];
  // Create a Set to get unique values, then convert back to array
  const categories = [...new Set(currentData.map(item => item.category))];
  return categories.sort();
});

onMounted(() => {
  // Simulate a small delay or just stop loading immediately since data is local
  loading.value = false;
});
</script>

<style scoped>
.admin-prestataire-manager {
  font-family: Arial, Helvetica, sans-serif;
  padding: 1rem;
}

/* Optional: Helper to space out the search icon */
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.justify-end {
  justify-content: flex-end;
}
.gap-2 {
  gap: 0.5rem;
}
</style>