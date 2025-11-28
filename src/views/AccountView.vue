<template>
  <div class="profile-container">

    <div v-if="authStore.user" class="profile-card">
      <div class="header">
        <h1>Bienvenue, {{ authStore.user.name }}</h1>
        <span class="badge">{{ authStore.user.role.toUpperCase() }}</span>
      </div>

      <hr>

      <div v-if="authStore.user.role === 'visiteur'" class="section">
        <h2>Mes Réservations</h2>

        <ul class="reservation-list">
          <li v-for="resa in authStore.mesReservations" :key="resa.id" class="resa-item">
            <div class="resa-info">
              <strong>{{ resa.activite.titre }}</strong>
              <br>
              <span class="date">{{ resa.activite.date }} (Réservé le {{ resa.dateReservation }})</span>
            </div>

            <button @click="handleCancel(resa.id)" class="btn-cancel">
              Annuler
            </button>
          </li>
        </ul>

        <p v-if="authStore.mesReservations.length === 0">Aucune réservation pour le moment.</p>

        <button @click="$router.push({name: 'Activities'})" class="action-btn">Voir les activités</button>
      </div>

      <div v-if="authStore.user.role === 'organisateur'" class="section">
        <h2>Administration - Suivi global</h2>
        <table class="admin-table">
          <thead>
          <tr>
            <th>Client (Email)</th>
            <th>Activité</th>
            <th>Date Réservation</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="resa in authStore.reservations" :key="resa.id">
            <td>{{ resa.userEmail }}</td>
            <td>{{ resa.activite.titre }}</td>
            <td>{{ resa.dateReservation }}</td>
            <td>
              <button @click="handleCancel(resa.id)" class="btn-cancel-small">X</button>
            </td>
          </tr>
          <tr v-if="authStore.reservations.length === 0">
            <td colspan="4" style="text-align:center">Aucune réservation.</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div v-if="authStore.user.role === 'prestataire'" class="section">
        <h2>Espace Prestataire</h2>
        <div class="info-box">
          <p>Statut du stand : <strong>Validé</strong></p>
          <p>Emplacement : <strong>Hall B - Stand 12</strong></p>
        </div>
      </div>

      <div class="footer">
        <button class="logout-btn" @click="handleLogout">Se déconnecter</button>
      </div>
    </div>

    <div v-else class="not-connected">
      <p>Vous n'êtes pas connecté.</p>
      <button @click="$router.push({name: 'Login'})" class="login-link">Aller à la connexion</button>
    </div>

  </div>
</template>

<script setup>
import {useAuthStore} from '@/stores/authStore.js'
import {useRouter} from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/')
}

function handleCancel(id) {
  if (confirm("Voulez-vous vraiment annuler cette réservation ?")) {
    authStore.annulerReservation(id)
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.profile-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  background-color: #2d2d4d;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
}

.reservation-list {
  list-style: none;
  padding: 0;
}

.resa-item {
  background: #f4f4f4;
  margin-bottom: 10px;
  padding: 15px;
  border-left: 5px solid #bd2cd1;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resa-info {
  display: flex;
  flex-direction: column;
}

.date {
  color: #666;
  font-size: 0.9rem;
}

.btn-cancel {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-cancel:hover {
  background-color: #ee5253;
}

.btn-cancel-small {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 30px;
  width: 100%;
}

.action-btn {
  background-color: #2d2d4d;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 10px;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.admin-table th, .admin-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.admin-table th {
  background-color: #2d2d4d;
  color: white;
}

.not-connected {
  text-align: center;
  margin-top: 100px;
}

.login-link {
  background-color: #2d2d4d;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1.2rem;
}
</style>