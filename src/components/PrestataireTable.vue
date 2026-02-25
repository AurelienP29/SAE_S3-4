<template>
  <div class="admin-prestataire-manager card">
    <DataTable v-model:filters="filters"
        dataKey="id"
        :value="data"
        :rows="10"
        :loading="loading"
        :globalFilterFields="['name', 'Champ1', 'prestataireName', 'email', 'category']"
        paginator
        filterDisplay="row"
    >
      <template #header>
        <div class="flex justify-between items-center">

          <h3 class="text-xl font-bold uppercase text-white m-0">
            {{ mode === 'prestations' ? lang('prestataire.servicesList') : lang('admin.providerManager.list') }}
          </h3>

          <IconField>
            <InputIcon>
              <i class="pi pi-search"/>
            </InputIcon>
            <InputText v-model="filters['global'].value" :placeholder="lang('globalSearch')"/>
          </IconField>
        </div>
      </template>

      <template #empty> {{ lang('noResults') }}</template>

      <Column field="name" :header="mode === 'prestations' ? lang('prestation') : lang('name')" sortable
              style="min-width: 12rem">
        <template #body="{ data }">
          <router-link v-if="mode === 'prestations'" :to="{ name: 'PrestationDetail', params: { id: data.id } }"
                       class="text-purple-400 font-bold hover:text-purple-300 no-underline">
            {{ data.name }}
          </router-link>
          <router-link v-else :to="{ name: 'PrestatairePublic', params: { id: data.id } }"
                       class="text-purple-400 font-bold hover:text-purple-300 no-underline">
            {{ data.name }}
          </router-link>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              :placeholder="lang('filterByName')"
              class="p-column-filter"
          />
        </template>
      </Column>

      <Column v-if="mode === 'prestations'" field="Champ1" :header="lang('zone')" sortable style="min-width: 12rem">
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

      <Column v-if="mode === 'prestations'" field="prestataireName" :header="lang('linkedProvider')" sortable
              style="min-width: 12rem">
        <template #body="{ data }">
          <!-- {{ data.Champ2 }} !-->
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

      <Column field="category" :header="lang('category')" :showFilterMenu="false" style="min-width: 12rem">
        <template #body="{ data }">
          <span class="font-bold">{{ lang('category.' + data.category) }}</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select
              v-model="filterModel.value"
              @change="filterCallback()"
              :options="uniqueCategories"
              :placeholder="lang('chooseCategory')"
              style="min-width: 12rem"
              :showClear="true"
          >
            <template #option="slotProps">
              {{ lang('category.' + slotProps.option) }}
            </template>
          </Select>
        </template>
      </Column>

    </DataTable>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import {FilterMatchMode} from '@primevue/core/api';
import {prestations, prestataires} from '@/datasource/data.js';
import {useAuthStore} from '@/stores/authStore.js';
import {translations} from '@/datasource/lang.js';

import {DataTable, Column, InputText, Select, IconField, InputIcon} from 'primevue';

const props = defineProps({
  mode: {
    type: String,
    default: 'prestations'
  }
});

const authStore = useAuthStore();
const lang = (key) => {
  return translations[authStore.currentLanguage][key] || key;
};

const loading = ref(true);

const data = computed(() => {
  // return props.mode === 'prestataires' ? prestataires : prestations;

  if (props.mode === 'prestataires') {
    return prestataires;
  }
  return prestations.map(p => {
    const prestataire = prestataires.find(pr => pr.id === p.prestataireId);
    return {
      ...p,
      prestataireName: prestataire ? prestataire.name : lang('independent')
    };
  });
});

const filters = ref({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  name: {value: null, matchMode: FilterMatchMode.CONTAINS},
  Champ1: {value: null, matchMode: FilterMatchMode.CONTAINS},
  prestataireName: {value: null, matchMode: FilterMatchMode.CONTAINS},
  email: {value: null, matchMode: FilterMatchMode.CONTAINS},
  category: {value: null, matchMode: FilterMatchMode.EQUALS}
});

const uniqueCategories = computed(() => {
  const currentData = data.value;
  if (!currentData || currentData.length === 0) return [];

  const categories = [...new Set(currentData.map(item => item.category))];
  return categories.sort();
});

onMounted(() => {

  loading.value = false;
});

</script>

<style scoped>
.admin-prestataire-manager {
  font-family: Arial, Helvetica, sans-serif;
  padding: 1rem;
}

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