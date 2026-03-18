<template>
  <div class="admin-prestation-manager">
    <h1 class="mb-4">{{ lang('admin.prestations') }}</h1>

    <h1 class="mb-2">{{ lang('admin.providerManager.waitlist') }}</h1>
    <div class="flex align-items-center gap-2 tab-header">
    </div>
    <div class="tab-content">
      <PrestationWaitlistManager/>
    </div>

    <h1 class="mb-2">{{ lang('prestataire.servicesList') }}</h1>
    <Toolbar class="mb-3">
      <template #start>
        <Button
            :label="' ' + lang('prestataire.newService')"
            icon="pi pi-plus"
            severity="secondary"
            @click="openCreateDialog"
        />
      </template>
    </Toolbar>
    <DataTable
        :value="prestations"
        dataKey="id"
        paginator
        :rows="10"
        responsiveLayout="scroll"
        :loading="loading"
    >
      <Column field="name" :header="lang('prestation.colName')" sortable/>
      <Column field="Champ1" :header="lang('prestation.colZone')" sortable/>
      <Column field="category" :header="lang('prestation.colCategory')">
        <template #body="slotProps">
          {{ lang('category.' + slotProps.data.category) }}
        </template>
      </Column>
      <Column :header="lang('admin.action')" :exportable="false" style="width: 10rem">
        <template #body="slotProps">
          <Button
              icon="pi pi-pencil"
              rounded
              text
              severity="info"
              class="mr-2"
              @click="openEditDialog(slotProps.data)"
          />
          <Button
              icon="pi pi-trash"
              rounded
              text
              severity="danger"
              @click="confirmDelete(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

<!-- Create -->
    <Dialog
        v-model:visible="dialogVisible"
        :header="isEditMode ? lang('prestataire.editService') : lang('prestataire.newService')"
        :modal="true"
        :style="{ width: '700px' }"
        :closable="false"
    >
      <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="name">{{ lang('prestation.colName') }}</label>
          <InputText id="name" v-model="form.name" :class="{ 'p-invalid': errors.name }"/>
          <small v-if="errors.name" style="color: red;">{{ errors.name }}</small>
        </div>

        <div class="field col-12 md:col-6">
          <label for="zone">{{ lang('prestation.colZone') }}</label>
          <InputText id="zone" v-model="form.Champ1" :class="{ 'p-invalid': errors.Champ1 }"/>
          <small v-if="errors.Champ1" style="color: red;">{{ errors.Champ1 }}</small>
        </div>

        <div class="field col-12 md:col-6">
          <label for="category">{{ lang('prestation.colCategory') }}</label>
          <Dropdown
              id="category"
              v-model="form.category"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="lang('admin.accountManager.rolePlaceholder')"
          />
        </div>

        <div class="field col-12 md:col-6">
          <label for="prestataire">{{ lang('admin.providers') }}</label>
          <Dropdown
              id="prestataire"
              v-model="form.prestataireId"
              :options="prestataires"
              optionLabel="name"
              optionValue="id"
              :placeholder="lang('admin.accountManager.rolePlaceholder')"
          />
        </div>

        <div class="field col-12">
          <label>{{ lang('prestation.description') }}</label>
          <Editor v-model="form.description" editorStyle="height: 200px"/>
        </div>
      </div>

      <template #footer>
        <Button :label="' ' + lang('cancel')" icon="pi pi-times" text @click="closeDialog"/>
        <Button
            :label="' ' + (isEditMode ? lang('save') : lang('admin.providerManager.new'))"
            icon="pi pi-check"
            severity="primary"
            @click="savePrestation"
        />
      </template>
    </Dialog>

<!-- Confirm del -->
    <Dialog
        v-model:visible="deleteDialogVisible"
        :header="lang('admin.providerManager.confirmDelete')"
        :modal="true"
        :style="{ width: '450px' }"
    >
      <p>
        {{ lang('admin.providerManager.deletePrompt') }}
        <strong>{{ selectedToDelete?.name }}</strong> ?
      </p>

      <template #footer>
        <Button :label="' ' + lang('cancel')" icon="pi pi-times" text @click="deleteDialogVisible = false"/>
        <Button
            :label="' ' + lang('delete')"
            icon="pi pi-trash"
            severity="danger"
            @click="deletePrestation"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import {DataTable, Column, Toolbar, Button, Dialog, InputText, Dropdown} from 'primevue'
import Editor from 'primevue/editor'

import {useAdminPrestationService} from '@/services/adminPrestationService.js'
import PrestationWaitlistManager from "@/components/adminComponents/PrestationWaitlistManager.vue";
import { useAuthStore } from '@/stores/authStore.js';
import { translations } from '@/datasource/lang.js';

const authStore = useAuthStore();
const lang = (key) => {
  return translations[authStore.currentLanguage][key] || key;
};

const {
  prestations,
  loading,
  dialogVisible,
  deleteDialogVisible,
  isEditMode,
  selectedToDelete,
  form,
  errors,
  categoryOptions,
  prestataires,
  openCreateDialog,
  openEditDialog,
  closeDialog,
  savePrestation,
  confirmDelete,
  deletePrestation
} = useAdminPrestationService()
</script>
