<template>
  <div class="admin-prestataire-manager">
    <h1 class="mb-4">{{ lang('admin.providerManager.title') }}</h1>

    <h1 class="mb-2">{{ lang('admin.providerManager.waitlist') }}</h1>
    <div class="flex align-items-center gap-2 tab-header">
    </div>
    <div class="tab-content">
      <PrestataireWaitlistManager/>
    </div>

    <h1 class="mb-2">{{ lang('admin.providerManager.list') }}</h1>
    <!--
    <div class="p-4 bg-gray-800 rounded">Legacy provider list</div>
    !-->
    <Toolbar class="mb-3">
      <template #start>
        <Button
            :label="' ' + lang('admin.providerManager.new')"
            icon="pi pi-plus"
            severity="secondary"
            @click="openCreateDialog"
        />
      </template>
    </Toolbar>
    <DataTable
        :value="prestataires"
        dataKey="id"
        paginator
        :rows="10"
        responsiveLayout="scroll"
        :loading="loading"
    >
      <Column field="name" :header="lang('prestataire.colName')" sortable/>
      <Column field="email" header="Email" sortable/>
      <Column field="phone" :header="lang('prestataire.phone')"/>
      <Column field="category" :header="lang('prestataire.colCategory')">
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

    <!-- Dialogue create/ -->
    <Dialog
        v-model:visible="dialogVisible"
        :header="isEditMode ? lang('admin.providerManager.edit') : lang('admin.providerManager.new')"
        :modal="true"
        :style="{ width: '700px' }"
        :closable="false"
    >
      <!-- 
        <div class="field">
          <div class="field col-12 md:col-6">
            <label for="name">{{ lang('prestataire.colName') }}</label>
            <InputText id="name" v-model="form.name" :class="{ 'p-invalid': errors.name }"/>
            <small v-if="errors.name" style="color: red;">{{ errors.name }}</small>
          </div>

          <div class="field col-12 md:col-6">
            <label for="email">Email</label>
            <InputText id="email" v-model="form.email" :class="{ 'p-invalid': errors.email }"/>
            <small v-if="errors.email" style="color: red;">{{ errors.email }}</small>
          </div>
        </div>
      !-->
      <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="name">{{ lang('prestataire.colName') }}</label>
          <InputText id="name" v-model="form.name" :class="{ 'p-invalid': errors.name }"/>
          <small v-if="errors.name" style="color: red;">{{ errors.name }}</small>
        </div>

        <div class="field col-12 md:col-6">
          <label for="email">Email</label>
          <InputText id="email" v-model="form.email" :class="{ 'p-invalid': errors.email }"/>
          <small v-if="errors.email" style="color: red;">{{ errors.email }}</small>
        </div>

        <div class="field col-12 md:col-6">
          <label for="phone">{{ lang('prestataire.phone') }}</label>
          <InputText id="phone" v-model="form.phone"/>
        </div>

        <div class="field col-12 md:col-6">
          <label for="category">{{ lang('prestataire.colCategory') }}</label>
          <Dropdown
              id="category"
              v-model="form.category"
              :options="translatedCategoryOptions"
              optionlabel=" label"
              optionValue="value"
              placeholder="Sélectionner"
          />
        </div>

        <div class="field col-12">
          <label>{{ lang('prestataire.description') }}</label>
          <Editor v-model="form.description" editorStyle="height: 200px"/>
        </div>
      </div>

      <template #footer>
        <Button :label="' ' + lang('cancel')" icon="pi pi-times" text @click="closeDialog"/>
        <Button
            :label="' ' + (isEditMode ? lang('save') : lang('admin.providerManager.new'))"
            icon="pi pi-check"
            severity="primary"
            @click="savePrestataire"
        />
      </template>
    </Dialog>

    <!-- Confirm dialogue -->
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
            @click="deletePrestataire"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import {DataTable, Column, Toolbar, Button, Dialog, InputText, Dropdown} from 'primevue'
import Editor from 'primevue/editor'

import {useAdminPrestataireService} from '/src/services/adminPrestataireService.js'
import PrestataireWaitlistManager from "@/components/adminComponents/PrestataireWaitlistManager.vue";
import { useAuthStore } from '@/stores/authStore.js';
import { translations } from '@/datasource/lang.js';

import { ref, computed } from 'vue';

const authStore = useAuthStore();
const lang = (key) => {
  return translations[authStore.currentLanguage][key] || key;
};

const translatedCategoryOptions = computed(() => {
  return categoryOptions.map(opt => ({
    ...opt,
    label: lang(`category.${opt.value}`)
  }));
});

const {
  prestataires,
  loading,
  dialogVisible,
  deleteDialogVisible,
  isEditMode,
  selectedToDelete,
  form,
  errors,
  categoryOptions,
  openCreateDialog,
  openEditDialog,
  closeDialog,
  savePrestataire,
  confirmDelete,
  deletePrestataire
} = useAdminPrestataireService()
</script>