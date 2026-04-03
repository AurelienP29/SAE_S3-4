<template>
  <div class="admin-shell">
    <Toast />
    <div class="admin-content">
      <div class="content-card">
        <div class="flex justify-between items-center top-row mb-4">
          <h1>Gestion des Évènements</h1>
          <Button label="Nouvel Évènement" icon="pi pi-plus" severity="secondary" @click="openNew" />
        </div>

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
                <Button icon="pi pi-pencil" text rounded severity="info" @click="editActivity(slotProps.data)" />
                <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(slotProps.data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
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
@import "@/assets/main.css";

/* Shell & Content Base */
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: var(--necro-bg);
  font-family: "Rajdhani", sans-serif;
  justify-content: center;
  padding: 2rem 1rem;
}

.admin-content {
  width: 100%;
  max-width: 1200px;
}

.content-card {
  background: rgba(237, 233, 229, 0.75);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg, 16px);
  padding: 2rem;
  min-height: 60vh;
  backdrop-filter: blur(6px);
}

.top-row {
  margin-bottom: 2rem;
}

/* ============================================================
   DEEP OVERRIDES
   ============================================================ */
:deep(h1) {
  font-family: "Rajdhani", sans-serif !important;
  font-size: 1.3rem !important;
  font-weight: 700 !important;
  color: var(--necro-text-muted) !important;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 2px solid rgba(168, 85, 247, 0.2);
  padding-bottom: 0.4rem;
  margin-bottom: 0 !important;
  margin-top: 0 !important;
}

:deep(.p-datatable-thead > tr > th) {
  background: rgba(204, 204, 204, 0.3) !important;
  color: var(--necro-text-muted) !important;
  font-family: "Rajdhani", sans-serif !important;
  font-size: 0.82rem !important;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-color: var(--glass-border) !important;
  font-weight: 700 !important;
}

:deep(.p-datatable-tbody > tr) {
  background: transparent !important;
  color: var(--necro-text, #0b0b0b) !important;
  border-color: rgba(255, 255, 255, 0.04) !important;
  font-family: "Rajdhani", sans-serif !important;
  font-size: 0.97rem !important;
  transition: background 0.15s;
}

:deep(.p-datatable-tbody > tr:nth-child(even)) {
  background: rgba(255, 255, 255, 0.023) !important;
}

:deep(.p-datatable-tbody > tr:hover) {
  background: rgba(168, 85, 247, 0.09) !important;
}

:deep(.p-paginator) {
  background: transparent !important;
  color: var(--necro-text-muted) !important;
  border: none !important;
  font-family: "Rajdhani", sans-serif !important;
}

:deep(.p-paginator .p-paginator-page.p-highlight) {
  background: var(--necro-purple) !important;
  color: white !important;
  border-radius: 6px;
}

:deep(.p-button) {
  font-family: "Rajdhani", sans-serif !important;
  font-weight: 600 !important;
  font-size: 0.9rem !important;
}

:deep(.p-dialog) {
  background: rgba(20, 17, 38, 0.98) !important;
  border: 1px solid var(--glass-border) !important;
  border-radius: var(--radius-lg, 16px) !important;
  backdrop-filter: blur(20px) !important;
}

:deep(.p-dialog-header) {
  background: transparent !important;
  color: var(--necro-text, #333333) !important;
  font-family: "Rajdhani", sans-serif !important;
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  border-bottom: 1px solid var(--glass-border) !important;
}

:deep(.p-dialog-content) {
  background: transparent !important;
  color: var(--necro-text, #424242) !important;
}

:deep(.p-dialog-footer) {
  background: transparent !important;
  border-top: 1px solid var(--glass-border) !important;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

:deep(.p-inputtext),
:deep(.p-textarea) {
  background: rgba(253, 253, 253, 0.7) !important;
  border-color: var(--glass-border) !important;
  color: var(--necro-text) !important;
  font-family: "Rajdhani", sans-serif !important;
}

:deep(.p-inputtext:focus),
:deep(.p-textarea:focus) {
  border-color: var(--necro-purple) !important;
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.25) !important;
}
</style>
