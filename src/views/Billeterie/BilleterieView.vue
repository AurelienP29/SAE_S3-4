<template>
  <div class="billeterie-page">
    <h1 class="banner">Billetterie</h1>
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
  </div>
</template>

<script setup>
import {useAuthStore} from '@/stores/authStore.js'
import {useCartStore} from "@/stores/cartStore.js";
import Button from 'primevue/button';

const cartStore = useCartStore()
const authStore = useAuthStore()

const ticketsTypes = authStore.ticketsTypes;

const handleAddToCart = (ticket) => {
  cartStore.addToCart(ticket, authStore.user?.id)
}
</script>

<style scoped>
.billeterie-page {
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

.tickets-grid {
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

.description {
  color: #666;
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.price {
  font-size: 1.1rem;
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
