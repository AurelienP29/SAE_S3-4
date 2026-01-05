<template>
  <div class="activities-page">
    <h1 class="banner">Tickets d'entrée</h1>
    <div class="tickets-grid">
      <div v-for="ticket in ticketsTypes" :key="ticket.id" class="activity-card ticket-card">
        <h3>{{ ticket.label }}</h3>
        <p class="description">{{ ticket.description }}</p>
        <p class="price">Prix : <strong>{{ ticket.price }}</strong></p>

        <div class="actions">
          <button
              v-if="authStore.user"
              @click="handleAddToCart(ticket)"
              class="btn-reserve"
          >
            Ajouter au panier
          </button>

          <div v-else class="warning">
            <router-link :to="{name: 'Login'}">Connectez-vous</router-link>
            pour acheter
          </div>
        </div>
      </div>
    </div>
    <h1 class="banner">Programme & Réservations</h1>

    <div class="activities-grid">
      <div v-for="act in authStore.activities" :key="act.id" class="activity-card">
        <h3>{{ act.titre }}</h3>
        <p class="date">{{ act.date }}</p>
        <p>Places disponibles : <strong>{{ act.places }}</strong></p>

        <div class="actions">
          <button
              v-if="authStore.user"
              @click="handleReservation(act.id)"
              class="btn-reserve"
          >
            Réserver ma place
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
import {ref} from "vue";

const cartStore = useCartStore()
const authStore = useAuthStore()
const ticketsTypes = authStore.ticketsTypes;

function handleReservation(id) {
  const success = authStore.reserverActivite(id)
  if (!success) {
    console.error("Erreur réservation")
  }
}

const handleAddToCart = (ticket) => {
  cartStore.addToCart(ticket, authStore.user?.id)
}

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

.btn-reserve:hover {
  background-color: #bd2cd1;
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