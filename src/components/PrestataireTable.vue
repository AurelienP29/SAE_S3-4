<template>
  <div class="admin-prestataire-manager card">
    <DataTable
        v-model:filters="filters"
        :value="prestations"
        paginator
        :rows="10"
        dataKey="id"
        filterDisplay="row"
        :loading="loading"
        :globalFilterFields="['name', 'Champ1', 'Champ2', 'category']"
    >
      <template #header>
        <div class="flex justify-end">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Recherche globale..." />
          </IconField>
        </div>
      </template>

      <template #empty> Aucun prestataire trouvé. </template>

      <Column field="name" header="Nom" sortable style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.name }}
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

      <Column field="Champ1" header="Champ1" sortable style="min-width: 12rem">
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

      <Column field="Champ2" header="Champ2" sortable style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.Champ2 }}
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
import { prestations } from '@/datasource/data.js';

import { DataTable, Column, InputText, Select, IconField, InputIcon} from 'primevue';

const loading = ref(true);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  Champ1: { value: null, matchMode: FilterMatchMode.CONTAINS },
  Champ2: { value: null, matchMode: FilterMatchMode.CONTAINS },
  category: { value: null, matchMode: FilterMatchMode.EQUALS }
});

// 2. Extract unique categories dynamically from the data for the dropdown
const uniqueCategories = computed(() => {
  if (!prestations || prestations.length === 0) return [];
  // Create a Set to get unique values, then convert back to array
  const categories = [...new Set(prestations.map(item => item.category))];
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
.justify-end {
  justify-content: flex-end;
}
.gap-2 {
  gap: 0.5rem;
}
</style>