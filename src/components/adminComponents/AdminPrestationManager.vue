<template>
  <div class="admin-prestataire-manager">
    <h1 class="mb-4">Gestion des prestataires</h1>

    <h1 class="mb-2">Liste d'attente</h1>
    <div class="flex align-items-center gap-2 tab-header">
    </div>
    <div class="tab-content">
      <PrestationWaitlistManager/>
    </div>

    <h1 class="mb-2">Liste des prestataires</h1>
    <Toolbar class="mb-3">
      <template #start>
        <Button
            label=" Nouveau prestataire"
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
      <Column field="name" header="Nom" sortable/>
      <Column field="email" header="Email" sortable/>
      <Column field="phone" header="Téléphone"/>
      <Column field="category" header="Catégorie"/>
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

<!-- Create -->
    <Dialog
        v-model:visible="dialogVisible"
        :header="isEditMode ? 'Modifier un prestataire' : 'Nouveau prestataire'"
        :modal="true"
        :style="{ width: '700px' }"
        :closable="false"
    >
      <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="name">Nom</label>
          <InputText id="name" v-model="form.name" :class="{ 'p-invalid': errors.name }"/>
          <small v-if="errors.name" style="color: red;">{{ errors.name }}</small>
        </div>

        <div class="field col-12 md:col-6">
          <label for="email">Email</label>
          <InputText id="email" v-model="form.email" :class="{ 'p-invalid': errors.email }"/>
          <small v-if="errors.email" style="color: red;">{{ errors.email }}</small>
        </div>

        <div class="field col-12 md:col-6">
          <label for="phone">Téléphone</label>
          <InputText id="phone" v-model="form.phone"/>
        </div>

        <div class="field col-12 md:col-6">
          <label for="category">Catégorie</label>
          <Dropdown
              id="category"
              v-model="form.category"
              :options="categoryOptions"
              optionlabel=" label"
              optionValue="value"
              placeholder="Sélectionner"
          />
        </div>

        <div class="field col-12">
          <label>Description</label>
          <Editor v-model="form.description" editorStyle="height: 200px"/>
        </div>
      </div>

      <template #footer>
        <Button label=" Annuler" icon="pi pi-times" text @click="closeDialog"/>
        <Button
            :label=" isEditMode ? 'Mettre à jour' : 'Créer'"
            icon="pi pi-check"
            severity="primary"
            @click="savePrestataire"
        />
      </template>
    </Dialog>

<!-- Confirm del -->
    <Dialog
        v-model:visible="deleteDialogVisible"
        header="Confirmer la suppression"
        :modal="true"
        :style="{ width: '450px' }"
    >
      <p>
        Voulez-vous vraiment supprimer le prestataire
        <strong>{{ selectedToDelete?.name }}</strong> ?
      </p>

      <template #footer>
        <Button label=" Annuler" icon="pi pi-times" text @click="deleteDialogVisible = false"/>
        <Button
            label=" Supprimer"
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
import PrestationWaitlistManager from "@/components/adminComponents/PrestationWaitlistManager.vue";

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