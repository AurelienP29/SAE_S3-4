<template>
  <div class="admin-activities-view">
    <Toast />
    <div class="header-card p-4 mb-4">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold">Gestion des Évènements</h1>
        <Button label="Nouvel Évènement" icon="pi pi-plus" severity="success" @click="openNew" />
      </div>
    </div>

    <div class="card p-4">
      <DataTable 
        :value="activityStore.activities" 
        :loading="activityStore.loading" 
        stripedRows 
        paginator 
        :rows="10"
        responsiveLayout="stack"
      >
        <Column field="titre" header="Titre" sortable></Column>
        <Column field="date" header="Date" sortable>
          <template #body="slotProps">
            {{ formatDate(slotProps.data.date) }}
          </template>
        </Column>
        <Column field="places" header="Places" sortable></Column>
        <Column field="prix" header="Prix" sortable>
            <template #body="slotProps">
                {{ slotProps.data.prix }}€
            </template>
        </Column>
        <Column header="Actions">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" severity="info" rounded outlined @click="editActivity(slotProps.data)" />
              <Button icon="pi pi-trash" severity="danger" rounded outlined @click="confirmDelete(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Dialog Création/Edition -->
    <Dialog v-model:visible="activityDialog" :style="{width: '450px'}" header="Détails de l'évènement" :modal="true" class="p-fluid">
      <div class="field mb-4">
        <label for="titre" class="font-bold">Titre</label>
        <InputText id="titre" v-model.trim="activity.titre" required="true" autofocus :class="{'p-invalid': submitted && !activity.titre}" />
        <small class="p-error" v-if="submitted && !activity.titre">Le titre est requis.</small>
      </div>

      <div class="field mb-4">
        <label for="description" class="font-bold">Description</label>
        <Textarea id="description" v-model="activity.description" required="false" rows="3" cols="20" />
      </div>

      <div class="formgrid grid gap-4">
        <div class="field col mb-4">
          <label for="places" class="font-bold">Places Max</label>
          <InputNumber id="places" v-model="activity.places" />
        </div>
        <div class="field col mb-4">
          <label for="prix" class="font-bold">Prix (€)</label>
          <InputNumber id="prix" v-model="activity.prix" mode="currency" currency="EUR" locale="fr-FR" />
        </div>
      </div>

      <div class="field mb-4">
        <label for="date" class="font-bold">Date et Heure</label>
        <DatePicker id="date" v-model="activity.date" showTime hourFormat="24" :manualInput="false" />
      </div>

      <template #footer>
        <Button label="Annuler" icon="pi pi-times" text @click="hideDialog"/>
        <Button label="Enregistrer" icon="pi pi-check" text @click="saveActivity" />
      </template>
    </Dialog>

    <!-- Dialog Suppression -->
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmation" :modal="true">
      <div class="flex align-items-center justify-content-center">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="activity">Êtes-vous sûr de vouloir supprimer <b>{{activity.titre}}</b> ?</span>
      </div>
      <template #footer>
        <Button label="Non" icon="pi pi-times" text @click="deleteDialog = false"/>
        <Button label="Oui" icon="pi pi-check" text @click="deleteActivity" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useActivityStore } from '@/stores/activityStore';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import DatePicker from 'primevue/datepicker';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const activityStore = useActivityStore();
const toast = useToast();

onMounted(() => {
  activityStore.fetchActivities();
});

const activityDialog = ref(false);
const deleteDialog = ref(false);
const activity = ref({});
const submitted = ref(false);

const openNew = () => {
    activity.value = {
        titre: '',
        description: '',
        places: 0,
        prix: 0,
        date: new Date()
    };
    submitted.value = false;
    activityDialog.value = true;
};

const hideDialog = () => {
    activityDialog.value = false;
    submitted.value = false;
};

const saveActivity = async () => {
    submitted.value = true;

    if (activity.value.titre.trim()) {
        try {
            if (activity.value._id) {
                await activityStore.updateActivity(activity.value._id, activity.value);
                toast.add({severity:'success', summary: 'Succès', detail: 'Activité mise à jour', life: 3000});
            } else {
                await activityStore.addActivity(activity.value);
                toast.add({severity:'success', summary: 'Succès', detail: 'Activité créée', life: 3000});
            }

            activityDialog.value = false;
            activity.value = {};
        } catch (err) {
            console.error(err);
            toast.add({severity:'error', summary: 'Erreur', detail: err.message || 'Échec de l\'opération', life: 5000});
        }
    }
};

const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return isNaN(d.getTime()) ? date : d.toLocaleString('fr-FR');
};

const editActivity = (data) => {
    activity.value = { ...data };
    // Convert string date to Date object for DatePicker
    const d = new Date(activity.value.date);
    activity.value.date = isNaN(d.getTime()) ? new Date() : d;
    activityDialog.value = true;
};

const confirmDelete = (data) => {
    activity.value = data;
    deleteDialog.value = true;
};

const deleteActivity = async () => {
    try {
        await activityStore.deleteActivity(activity.value._id);
        toast.add({severity:'success', summary: 'Succès', detail: 'Activité supprimée', life: 3000});
        deleteDialog.value = false;
        activity.value = {};
    } catch (err) {
        console.error(err);
        toast.add({severity:'error', summary: 'Erreur', detail: 'Échec de la suppression', life: 5000});
    }
};
</script>

<style scoped>
.admin-activities-view {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
}

.header-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card {
  background: var(--surface-card);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

:deep(.p-datatable-header) {
    background: transparent;
    border: none;
}

:deep(.p-dialog-footer) {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}
</style>
