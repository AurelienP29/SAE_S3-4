<!-- TODO: ajouter version anglaise du texte créé par le prestataire qu'il peut modifier / ajouter; Possibilité d'ajouter des images -->

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
              <div class="flex items-center gap-4">
                <p class="text-xl text-green-400 font-medium flex items-center gap-2">
                  <i class="pi pi-map-marker"></i> {{ prestation.Champ1 }}
                </p>
                <div v-if="averageRating > 0" class="flex items-center gap-2 bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/30">
                  <Rating v-model="averageRating" readonly :cancel="false" />
                  <span class="text-yellow-400 font-bold">{{ averageRating }}</span>
                </div>
              </div>
            </div>

            <div v-if="prestataire" class="prestataire-card p-4 rounded-lg bg-black/30 border border-purple-500/30">
              <p class="text-xs text-gray-400 uppercase font-bold mb-1">Proposé par</p>
              <h3 class="text-lg font-bold text-white">{{ prestataire.name }}</h3>
              <p class="text-sm text-gray-300">{{ prestataire.email }}</p>
            </div>
          </div>

          <div class="content-display text-gray-200 leading-relaxed mb-10" v-html="detailContent"></div>

          <!-- Section Reviews -->
          <div class="reviews-section mt-10 border-t border-purple-500/20 pt-8">
            <h2 class="text-2xl font-bold text-purple-400 mb-6 uppercase tracking-wider flex items-center gap-3">
              <i class="pi pi-comments"></i> Avis des visiteurs ({{ prestationReviews.length }})
            </h2>

            <!-- Formulaire pour ajouter un avis -->
            <div v-if="authStore.isAuthenticated && !canEdit && !hasLeftReview" class="add-review-box p-4 rounded-lg bg-purple-900/20 border border-purple-500/30 mb-8">
              <h3 class="text-lg font-bold text-white mb-3">Laisser un avis</h3>
              <div class="flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="text-gray-300">Note :</span>
                  <Rating v-model="newReview.rating" :cancel="false" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-gray-300">Votre commentaire :</label>
                  <Textarea v-model="newReview.comment" rows="3" class="w-full bg-black/40 text-white border-purple-500/30" />
                </div>
                <div class="flex justify-end">
                  <Button label=" Publier mon avis" icon="pi pi-send" severity="primary" @click="submitReview" :disabled="!newReview.rating" />
                </div>
              </div>
            </div>

            <!-- Liste des avis -->
            <div v-if="prestationReviews.length > 0" class="flex flex-col gap-6">
              <div v-for="review in prestationReviews" :key="review.id" class="review-item p-4 rounded-lg bg-black/20 border border-white/5 transition-all hover:border-purple-500/30">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center gap-3">
                    <Avatar :label="review.userName.charAt(0).toUpperCase()" shape="circle" class="bg-purple-600 text-white" />
                    <div>
                      <div class="font-bold text-white">{{ review.userName }}</div>
                      <div class="text-xs text-gray-500">{{ review.date }}</div>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <Rating v-model="review.rating" readonly :cancel="false" />
                    <div v-if="canManageReview(review)" class="flex gap-2">
                      <Button icon="pi pi-pencil" text rounded severity="info" size="small" @click="editReview(review)" v-if="review.userId === authStore.user?.id" />
                      <Button icon="pi pi-trash" text rounded severity="danger" size="small" @click="confirmDeleteReview(review.id)" />
                    </div>
                  </div>
                </div>
                <p class="text-gray-300 leading-relaxed italic">"{{ review.comment }}"</p>
              </div>
            </div>
            <div v-else class="text-gray-500 italic p-4 text-center">
              Soyez le premier à donner votre avis sur cette prestation !
            </div>
          </div>
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

      <!-- Dialog Modification Review -->
      <Dialog v-model:visible="editReviewDialog" header="Modifier mon avis" modal class="p-fluid" style="width: 450px">
        <div class="flex flex-col gap-4 mt-2">
          <div class="flex items-center gap-3">
            <span class="font-bold">Note :</span>
            <Rating v-model="selectedReview.rating" :cancel="false" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-bold">Commentaire :</label>
            <Textarea v-model="selectedReview.comment" rows="4" />
          </div>
        </div>
        <template #footer>
          <Button label=" Annuler" icon="pi pi-times" text @click="editReviewDialog = false" />
          <Button label=" Enregistrer" icon="pi pi-check" @click="saveReviewEdit" />
        </template>
      </Dialog>

      <ConfirmDialog />
      <Toast />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore.js';
import { useReviewStore } from '@/stores/reviewStore.js';
import { prestations, prestataires } from '@/datasource/data.js';
import { prestationsDetails } from '@/datasource/prestations_data.js'

import { 
  Button, Message, Toast, Rating, Textarea, Avatar, 
  ConfirmDialog, Dialog 
} from 'primevue';
import Editor from 'primevue/editor';

import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const reviewStore = useReviewStore();
const toast = useToast();
const confirm = useConfirm();

const loading = ref(true);
const prestation = ref(null);
const prestataire = ref(null);
const detailContent = ref('');
const isEditing = ref(false);
const editContent = ref('');

const prestationId = parseInt(route.params.id);


// Reviews
const prestationReviews = computed(() => reviewStore.getReviewsByPrestation(prestationId));
// const averageRating = computed(() => {
//   const total = prestationReviews.value.reduce((acc, r) => acc + r.rating, 0);
//   return total / prestationReviews.value.length;
// });
const averageRating = computed(() => parseFloat(reviewStore.getAverageRating(prestationId)));
const hasLeftReview = computed(() => {
  if (!authStore.isAuthenticated) return false;
  return prestationReviews.value.some(r => r.userId === authStore.user.id);
});

const newReview = reactive({
  rating: 0,
  comment: ''
});

const editReviewDialog = ref(false);
const selectedReview = reactive({
  id: null,
  rating: 0,
  comment: ''
});

function submitReview() {
  if (!newReview.rating) return;
  
  reviewStore.addReview({
    prestationId: prestationId,
    userId: authStore.user.id,
    userName: authStore.user.name,
    rating: newReview.rating,
    comment: newReview.comment
  });
  
  newReview.rating = 0;
  newReview.comment = '';
  toast.add({ severity: 'success', summary: 'Avis publié', detail: 'Merci pour votre retour !', life: 3000 });
}

function canManageReview(review) {
  if (!authStore.isAuthenticated) return false;
  
  // L'auteur peut modifier/supprimer
  if (review.userId === authStore.user.id) return true;
  
  // Le prestataire peut supprimer les avis sur ses prestations
  if (authStore.user.email === prestataire.value?.email) return true;
  
  return false;
}

function editReview(review) {
  selectedReview.id = review.id;
  selectedReview.rating = review.rating;
  selectedReview.comment = review.comment;
  editReviewDialog.value = true;
}

function saveReviewEdit() {
  reviewStore.updateReview(selectedReview.id, {
    rating: selectedReview.rating,
    comment: selectedReview.comment
  });
  editReviewDialog.value = false;
  toast.add({ severity: 'success', summary: 'Succès', detail: 'Avis mis à jour', life: 3000 });
}

function confirmDeleteReview(id) {
  confirm.require({
    message: 'Voulez-vous vraiment supprimer cet avis ?',
    header: 'Confirmation de suppression',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      reviewStore.deleteReview(id);
      toast.add({ severity: 'info', summary: 'Supprimé', detail: 'L\'avis a été supprimé', life: 3000 });
    }
  });
}


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
