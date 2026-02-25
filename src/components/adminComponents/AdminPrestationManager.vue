<template>
  <div class="admin-prestation-manager">
    <h1 class="mb-4">Gestion des prestations</h1>

    <h1 class="mb-2">Liste d'attente</h1>
    <div class="flex align-items-center gap-2 tab-header">
    </div>
    <div class="tab-content">
      <PrestationWaitlistManager/>
    </div>

    <h1 class="mb-2">Liste des prestations</h1>
    <Toolbar class="mb-3">
      <template #start>
        <Button
            label=" Nouvelle prestation"
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
      <Column field="name" header="Nom" sortable/>
      <Column field="Champ1" header="Zone" sortable/>
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
        :header="isEditMode ? 'Modifier une prestation' : 'Nouvelle prestation'"
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
          <label for="zone">Zone</label>
          <InputText id="zone" v-model="form.Champ1" :class="{ 'p-invalid': errors.Champ1 }"/>
          <small v-if="errors.Champ1" style="color: red;">{{ errors.Champ1 }}</small>
        </div>

        <div class="field col-12 md:col-6">
          <label for="category">Catégorie</label>
          <Dropdown
              id="category"
              v-model="form.category"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner"
          />
        </div>

        <div class="field col-12 md:col-6">
          <label for="prestataire">Prestataire</label>
          <Dropdown
              id="prestataire"
              v-model="form.prestataireId"
              :options="prestataires"
              optionLabel="name"
              optionValue="id"
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
            @click="savePrestation"
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
        Voulez-vous vraiment supprimer la prestation
        <strong>{{ selectedToDelete?.name }}</strong> ?
      </p>

      <template #footer>
        <Button label=" Annuler" icon="pi pi-times" text @click="deleteDialogVisible = false"/>
        <Button
            label=" Supprimer"
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

import {useAdminPrestationService} from '/src/services/adminPrestationService.js'
import PrestationWaitlistManager from "@/components/adminComponents/PrestationWaitlistManager.vue";

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
