<template>
  <div class="activities-page">
    <h1 class="banner">Programme & Réservations</h1>

    <div class="activities-grid">
      <div v-for="act in activityStore.activities" :key="act._id" class="activity-card">
        <h3>{{ act.titre }}</h3>
        <p class="date">{{ formatDate(act.date) }}</p>
        <p>Places disponibles : <strong>{{ act.places }}</strong></p>

        <div class="actions">
          <button
              v-if="authStore.user"
              @click="handleReservation(act._id)"
              class="btn-reserve"
              :disabled="isAlreadyReserved(act._id)"
              :class="{ 'btn-disabled': isAlreadyReserved(act._id) }"
          >
            {{ isAlreadyReserved(act._id) ? 'Déjà réservé' : 'Réserver ma place' }}
          </button>

          <div v-else class="warning">
            <router-link :to="{name: 'Login'}">Connectez-vous</router-link>
            pour réserver
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useAuthStore} from '@/stores/authStore.js'
import {useCartStore} from "@/stores/cartStore.js";
import {useActivityStore} from '@/stores/activityStore.js';
import {onMounted} from "vue";
import Button from 'primevue/button';

const cartStore = useCartStore()
const authStore = useAuthStore()
const activityStore = useActivityStore()


onMounted(() => {
  activityStore.fetchActivities();
});

function handleReservation(id) {
  const success = authStore.reserverActivite(id)
  if (!success) {
    console.error("Erreur réservation")
  }
}

const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return isNaN(d.getTime()) ? date : d.toLocaleString('fr-FR');
};

const isAlreadyReserved = (actId) => {
  if (!authStore.user || !authStore.user.reservations) return false;
  return authStore.user.reservations.some(r => (r.activite._id || r.activite.id) === actId);
};

</script>

<style scoped>
.activities-page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.banner {
  background: linear-gradient(90deg, #2d2d4d 0%, #4e1a3d 100%);
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: center;
  width: 100%;
  max-width: 900px;
}

.activities-grid, .tickets-grid {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1200px;
}

.activity-card {
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
  width: 280px;
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s;
}

.activity-card:hover {
  transform: translateY(-5px);
}

.activity-card h3 {
  color: #2d2d4d;
  margin-bottom: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.date {
  color: #666;
  margin-bottom: 15px;
}

.actions {
  margin-top: 20px;
}

.btn-reserve {
  background-color: #2d2d4d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  transition: background 0.3s;
}

.btn-reserve:hover:not(:disabled) {
  background-color: #bd2cd1;
}

.btn-disabled {
  background-color: #888 !important;
  cursor: not-allowed;
  opacity: 0.7;
}

.warning {
  color: #e74c3c;
  font-size: 0.9rem;
}

.warning a {
  color: #e74c3c;
  font-weight: bold;
  text-decoration: underline;
}
</style>