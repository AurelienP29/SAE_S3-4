<template>
  <div class="success-page flex align-items-center justify-content-center">
    <div class="card shadow-4 p-6 text-center" style="max-width: 500px">
      <div class="success-icon mb-4">
        <i class="pi pi-check-circle text-7xl text-green-500"></i>
      </div>

      <h1 class="text-3xl font-bold mb-2">Paiement confirmé !</h1>
      <p class="text-600 mb-5">Merci pour votre achat. Vos billets sont désormais disponibles dans votre espace personnel.</p>

      <div class="flex flex-column gap-3">
        <Button
            label="Voir mes tickets"
            icon="pi pi-ticket"
            class="p-button-primary p-button-lg w-full"
            @click="goToAccount"
        />

        <p class="text-sm text-500 mt-4">
          Redirection automatique vers l'accueil dans <span class="font-bold text-primary">{{ countdown }}s</span>...
        </p>

        <Button
            label="Retourner à l'accueil maintenant"
            variant="text"
            class="p-button-secondary p-button-text"
            @click="goToHome"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const router = useRouter();
const countdown = ref(30);
let timer = null;

const goToHome = () => {
  if (timer) clearInterval(timer);
  router.push('/');
};

const goToAccount = () => {
  if (timer) clearInterval(timer);
  router.push('/account'); // Ou le chemin vers votre espace utilisateur
};

onMounted(() => {
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      goToHome();
    }
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.success-page {
  min-height: calc(100vh - 100px);
  background-color: #f8fafc;
}
.card {
  background: white;
  border-radius: 20px;
}
.success-icon {
  animation: scaleIn 0.5s ease-out;
}
@keyframes scaleIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>