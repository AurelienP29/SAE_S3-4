<template>
  <div class="admin-account-manager">
    <h1 class="mb-4">Gestion des comptes</h1>

    <DataTable
        :value="accounts"
        dataKey="id"
        paginator
        :rows="10"
        responsiveLayout="scroll"
        :loading="loading"
        class="p-datatable-sm"
    >
      <Column field="name" header="Nom" sortable/>
      <Column field="email" header="Email" sortable/>
      <Column field="role" header="Rôle principal" sortable>
        <template #body="slotProps">
          <span class="capitalize">{{ slotProps.data.role }}</span>
        </template>
      </Column>
      <Column header="Actions" :exportable="false" style="width: 10rem">
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

    <!-- Dialogue d'édition -->
    <Dialog
        v-model:visible="dialogVisible"
        :header="'Modifier le compte : ' + form.name"
        :modal="true"
        :style="{ width: '600px' }"
        :closable="false"
    >
      <div class="p-fluid grid">
        <div class="field col-12 md:col-6 mb-3">
          <label for="acc-name" class="font-bold">Nom</label>
          <InputText id="acc-name" v-model="form.name" :class="{ 'p-invalid': errors.name }" />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <div class="field col-12 md:col-6 mb-3">
          <label for="acc-email" class="font-bold">Email</label>
          <InputText id="acc-email" v-model="form.email" :class="{ 'p-invalid': errors.email }" />
          <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
        </div>

        <div class="field col-12 md:col-6 mb-3">
          <label for="acc-role" class="font-bold">Rôle principal</label>
          <Dropdown
              id="acc-role"
              v-model="form.role"
              :options="roleOptions"
              optionlabel=" label"
              optionValue="value"
              placeholder="Sélectionner un rôle"
          />
        </div>

        <div class="field col-12 md:col-6 mb-3">
          <label for="acc-phone" class="font-bold">Téléphone</label>
          <InputText id="acc-phone" v-model="form.phone" />
        </div>

        <div class="field col-12 mb-3">
          <label for="acc-desc" class="font-bold">Bio / Description</label>
          <Textarea id="acc-desc" v-model="form.description" rows="3" />
        </div>
      </div>

      <template #footer>
        <Button label=" Annuler" icon="pi pi-times" text @click="closeDialog" />
        <Button label=" Enregistrer" icon="pi pi-check" severity="primary" @click="saveAccount" />
      </template>
    </Dialog>

    <!-- Dialogue de confirmation de suppression -->
    <Dialog
        v-model:visible="deleteDialogVisible"
        header="Confirmer la suppression"
        :modal="true"
        :style="{ width: '450px' }"
    >
      <div class="flex align-items-center justify-content-center">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--necro-green)" />
        <span v-if="selectedAccount">
          Voulez-vous vraiment supprimer le compte <b>{{ selectedAccount.name }}</b> ?
          <br><br>
          <small v-if="selectedAccount.role === 'prestataire'" class="text-orange-400">
            <b>Attention :</b> Ce compte étant un prestataire, ses prestations et son profil public seront également supprimés.
          </small>
        </span>
      </div>

      <template #footer>
        <Button label=" Non" icon="pi pi-times" text @click="deleteDialogVisible = false" />
        <Button label=" Oui, supprimer" icon="pi pi-trash" severity="danger" @click="deleteAccount" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { DataTable, Button, Column, Dialog, InputText, Dropdown, Textarea } from "primevue";
import { useAdminAccountService } from '@/services/adminAccountService.js';

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