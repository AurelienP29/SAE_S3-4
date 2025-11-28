<template>
  <div class="login-container">
    <h1>Connexion Necronomi'con</h1>

    <div class="login-card">
      <div class="form-group">
        <label>Email</label>
        <input
            type="email"
            v-model="email"
            placeholder="Entrez votre email..."
            @keyup.enter="handleLogin"
        >
      </div>

      <div class="form-group">
        <button @click="handleLogin" class="btn-login">Se connecter</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/authStore.js'

const email = ref('')
const router = useRouter()
const authStore = useAuthStore()

function handleLogin() {
  if (email.value) {
    authStore.login(email.value)
    router.push({name: 'Account'})
  } else {
    alert("Merci d'entrer un email valide.")
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  min-height: 60vh;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  padding: 12px;
  margin-top: 10px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-login {
  padding: 12px 30px;
  background-color: #4e1a3d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.btn-login:hover {
  background-color: #bd2cd1;
}
</style>