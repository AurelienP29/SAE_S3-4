<template>
  <div class="admin-account-manager">
    <h1 class="mb-4">{{ lang('admin.accountManager.title') }}</h1>

    <DataTable class="p-datatable-sm"
               :value="accounts"
               :rows="10"
               dataKey="id"
               responsiveLayout="scroll"
               :loading="loading"
               paginator
    >
      <Column field="name" :header="lang('admin.accountManager.colName')" sortable/>
      <Column field="email" :header="lang('admin.accountManager.colEmail')" sortable/>
      <Column field="role" :header="lang('admin.accountManager.colRole')" sortable>
        <template #body="slotProps">
          <span class="capitalize">{{ slotProps.data.role }}</span>
        </template>
      </Column>
      <Column :header="lang('admin.accountManager.colActions')" :exportable="false" style="width: 10rem">
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

    <!-- Modif dialog -->
    <Dialog v-model:visible="dialogVisible"
            :header="lang('admin.accountManager.editTitle') + form.name"
            :modal="true"
            :style="{ width: '600px' }"
            :closable="false"
    >
      <div class="p-fluid grid">
        <div class="field col-12 md:col-6 mb-3">
          <label for="acc-name" class="font-bold">{{ lang('admin.accountManager.colName') }}</label>
          <InputText id="acc-name" v-model="form.name" :class="{ 'p-invalid': errors.name }"/>

          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <div class="field col-12 md:col-6 mb-3">
          <label for="acc-email" class="font-bold">{{ lang('admin.accountManager.colEmail') }}</label>
          <InputText id="acc-email" v-model="form.email" :class="{ 'p-invalid': errors.email }"/>

          <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
        </div>

        <div class="field col-12 md:col-6 mb-3">
          <label for="acc-role" class="font-bold">{{ lang('admin.accountManager.roleLabel') }}</label>
          <Dropdown
              id="acc-role"
              v-model="form.role"
              :options="roleOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="lang('admin.accountManager.rolePlaceholder')"
          />
        </div>

        <div class="field col-12 md:col-6 mb-3">
          <label for="acc-phone" class="font-bold">{{ lang('account.phone') }}</label>
          <InputText id="acc-phone" v-model="form.phone"/>
        </div>

        <div class="field col-12 mb-3">
          <label for="acc-desc" class="font-bold block mb-2">{{ lang('account.description') }}</label>
          <Textarea id="acc-desc" v-model="form.description" rows="3" class="w-full"/>
        </div>
      </div>

      <template #footer>
        <Button :label="' ' + lang('cancel')" icon="pi pi-times" text @click="closeDialog"/>
        <Button :label="' ' + lang('save')" icon="pi pi-check" severity="primary" @click="saveAccount"/>
      </template>
    </Dialog>

    <!-- Dialogue de confirmation de suppression -->
    <Dialog
        v-model:visible="deleteDialogVisible"
        :header="lang('admin.accountManager.confirmDelete')"
        :modal="true"
        :style="{ width: '450px' }"
    >
      <div class="flex align-items-center justify-content-center">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--necro-green)"/>
        <span v-if="selectedAccount">
          {{ lang('admin.accountManager.deletePrompt') }} <b>{{ selectedAccount.name }}</b> ?
          <br><br>
          <small v-if="selectedAccount.role === 'prestataire'" class="text-orange-400">
            <b>Attention :</b> {{ lang('admin.accountManager.deleteWarning') }}
          </small>
        </span>
      </div>

      <template #footer>
        <Button :label="' ' + lang('cancel')" icon="pi pi-times" text @click="deleteDialogVisible = false"/>
        <Button :label="' ' + lang('delete')" icon="pi pi-trash" severity="danger" @click="deleteAccount"/>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import {DataTable, Button, Column, Dialog, InputText, Dropdown, Textarea} from "primevue";
import {useAdminAccountService} from '@/services/adminAccountService.js';
import {useAuthStore} from '@/stores/authStore.js';
import {translations} from '@/datasource/lang.js';

const authStore = useAuthStore();

const lang = (key) => {
  return translations[authStore.currentLanguage][key] || key;
};

const {
  accounts,
  loading,
  dialogVisible,
  deleteDialogVisible,
  isEditMode,
  selectedAccount,
  form,
  errors,
  roleOptions,
  openEditDialog,
  closeDialog,
  saveAccount,
  confirmDelete,
  deleteAccount
} = useAdminAccountService();
</script>