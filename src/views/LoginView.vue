<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2 class="text-center mb-4">Connexion</h2>

      <div class="p-fluid">
        <div class="field mb-4">
          <label for="email" class="block mb-2">Email</label>
          <InputText
            id="email"
            v-model="email"
            type="text"
            placeholder="exemple@test.com"
            :class="{ 'p-invalid': emailError }"
            class="loginInputField"
          />
          <div v-if="emailError" style="color: red;">{{ emailError }}</div>
        </div>

        <div class="field mb-4">
          <label for="password" class="block mb-2">Mot de passe</label>
          <Password
            id="password"
            v-model="password"
            :feedback="false"
            toggleMask
            placeholder="Votre mot de passe"
            :class="{ 'p-invalid': passwordError }"
            class="loginInputField"
          />
          <div v-if="passwordError" style="color: red;">{{ passwordError }}</div>
        </div>

        <Button label="Se connecter" icon="pi pi-sign-in" @click="handleLogin" />

        <div class="mt-3 text-center">
          <Button
            label="Créer un compte"
            icon="pi pi-user-plus"
            class="p-button-text"
            @click="goToCreateAccount"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useLoginService } from '@/services/loginService.js'

const {
  email,
  password,
  emailError,
  passwordError,
  handleLogin,
  goToCreateAccount
} = useLoginService()
</script>

<style scoped src="@/assets/styles/LoginForm.css"></style>