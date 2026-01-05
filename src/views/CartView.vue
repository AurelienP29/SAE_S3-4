<template>
  <div class="cart-page-container">
    <h1 class="cart-title">Mon Panier</h1>

    <div v-if="cartStore.itemsCount === 0" class="empty-cart-msg">
      Votre panier est vide.
    </div>

    <div v-else class="cart-content">
      <div v-for="item in cartStore.items" :key="item.uuid" class="cart-item">
        <div class="item-details">
          <span class="item-label">{{ item.label }}</span>
          <span class="item-price">{{ item.price }}</span>
        </div>
        <button class="btn-remove" @click="cartStore.removeFromCart(item.uuid)">
          <i class="pi pi-trash"></i> Supprimer
        </button>
      </div>

      <div class="cart-summary">
        <hr>
        <h3 class="total-text">Total : <span>{{ cartStore.totalAmount }}€</span></h3>
        <div class="cart-actions">
          <button @click="cartStore.clearCart()" class="btn-clear">Vider le panier</button>
          <button class="btn-validate">Valider la commande</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore.js'
const cartStore = useCartStore()
</script>

<style scoped>
.cart-page-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  color: #2d2d4d; /* Force la couleur du texte en sombre */
}

.cart-title {
  text-align: center;
  margin-bottom: 30px;
  color: #2d2d4d;
}

.empty-cart-msg {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  padding: 40px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.item-label {
  font-weight: bold;
  font-size: 1.1rem;
}

.item-price {
  margin-left: 15px;
  color: #bd2cd1;
  font-weight: 600;
}

.btn-remove {
  background: none;
  border: 1px solid #ff4d4d;
  color: #ff4d4d;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #ff4d4d;
  color: white;
}

.cart-summary {
  margin-top: 30px;
  text-align: right;
}

.total-text {
  font-size: 1.5rem;
  margin: 20px 0;
}

.total-text span {
  color: #bd2cd1;
}

.cart-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.btn-clear {
  background: #eee;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-validate {
  background: #2d2d4d;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.btn-validate:hover {
  background: #bd2cd1;
}
</style>