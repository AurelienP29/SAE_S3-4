<template>
  <div class="prestation-detail-view p-4 min-h-screen bg-necro-bg">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <i class="pi pi-spin pi-spinner"></i>
    </div>

    <div v-else-if="!prestation" class="text-center">
      <Message severity="error" class="mb-4">Prestation introuvable.</Message>
      <Button label=" Retour à l'accueil" icon="pi pi-home" @click="goTo('Home')" />
    </div>

    <div v-else class="max-w-5xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <Button icon="pi pi-arrow-left" label=" Retour" class="p-button-text text-white" @click="goTo('Home')" />
        
        <div v-if="canEdit" class="flex gap-2">
          <Button 
            v-if="!isEditing" 
            label="  Modifier"
            icon="pi pi-pencil" 
            severity="warn" 
            @click="isEditing = true" 
          />
          <template v-else>
            <Button 
              label=" Annuler"
              icon="pi pi-times" 
              severity="secondary" 
              text 
              @click="cancelEdit" 
            />
            <Button 
              label=" Sauvegarder"
              icon="pi pi-check" 
              severity="success" 
              @click="saveContent" 
            />
          </template>
        </div>
      </div>

      <div class="g-panel p-6 md:p-10 mb-8 relative">
        <div v-if="!isEditing">
          <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-4">
            <div>
              <span class="inline-block px-3 py-1 rounded bg-purple-900/50 text-purple-300 text-sm font-bold uppercase tracking-wider mb-2">
                {{ prestation.category }}
              </span>
              <h1 class="text-4xl md:text-5xl font-bold text-white mb-2 uppercase tracking-tight">
                {{ prestation.name }}
              </h1>
              <p class="text-xl text-green-400 font-medium flex items-center gap-2">
                <i class="pi pi-map-marker"></i> {{ prestation.Champ1 }}
              </p>
            </div>

            <div v-if="prestataire" class="prestataire-card p-4 rounded-lg bg-black/30 border border-purple-500/30">
              <p class="text-xs text-gray-400 uppercase font-bold mb-1">Proposé par</p>
              <h3 class="text-lg font-bold text-white">{{ prestataire.name }}</h3>
              <p class="text-sm text-gray-300">{{ prestataire.email }}</p>
            </div>
          </div>

          <div class="content-display text-gray-200 leading-relaxed" v-html="detailContent"></div>
        </div>

        <div v-else>
          <h2 class="text-2xl font-bold text-purple-400 mb-4 uppercase">Mode Édition</h2>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="font-bold text-gray-300">Contenu de la prestation (WYSIWYG)</label>
              <Editor v-model="editContent" editorStyle="height: 400px" />
            </div>
          </div>
        </div>
      </div>

      <Toast />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore.js';
import { prestations, prestataires } from '@/datasource/data.js';
import { prestationsDetails } from '@/datasource/prestations_data.js';
import { Button, Message, Toast } from 'primevue';
import Editor from 'primevue/editor';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const loading = ref(true);
const prestation = ref(null);
const prestataire = ref(null);
const detailContent = ref('');
const isEditing = ref(false);
const editContent = ref('');

const prestationId = parseInt(route.params.id);


onMounted(() => {
  setTimeout(() => {
    prestation.value = prestations.find(p => p.id === prestationId);
    
    if (prestation.value) {
      prestataire.value = prestataires.find(pr => pr.id === prestation.value.prestataireId);
      
      const detail = prestationsDetails.find(d => d.id === prestationId);
      detailContent.value = detail ? detail.content : '<p>Aucune description détaillée disponible pour le moment.</p>';
      editContent.value = detailContent.value;
    }
    
    loading.value = false;
  }, 300);
});


const canEdit = computed(() => {
  if (!authStore.isAuthenticated || !prestation.value || !prestataire.value) return false;

  //seul presta lié avec prestation peut modif
  return authStore.user.email === prestataire.value.email;
});

function cancelEdit() {
  editContent.value = detailContent.value;
  isEditing.value = false;
}

function saveContent() {
  const index = prestationsDetails.findIndex(d => d.id === prestationId);
  if (index !== -1) {
    prestationsDetails[index].content = editContent.value;
  } else {
    prestationsDetails.push({
      id: prestationId,
      content: editContent.value
    });
  }
  
  detailContent.value = editContent.value;
  isEditing.value = false;
  toast.add({ severity: 'success', summary: 'Succès', detail: 'Prestation mise à jour', life: 3000 });
}

function goTo(routeName) {
  router.push({name: routeName})
}
</script>



<style scoped>
.prestation-detail-view {
  color: #f1f5f9;
}

.g-panel {
  background: rgba(30, 27, 46, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.g-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--necro-accent), var(--necro-glow));
  border-radius: 16px 16px 0 0;
}


</style>
