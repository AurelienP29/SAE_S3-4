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
            fluid
          />
          <div v-if="passwordError" style="color: red;">{{ passwordError }}</div>
        </div>

        <Button label=" Se connecter" icon="pi pi-sign-in" @click="handleLogin" />

        <div class="divider">
          <span>{{ lang('login.with.social') }}</span>
        </div>

        <div class="social-login-grid">
          <!-- <button @click="handleGoogleLogin">Google</button> !-->

          <div id="google-login-btn" class="social-btn google-btn-container"></div>
          
          <div class="social-icons-row mt-3">
            <Button icon="pi pi-github" severity="secondary" rounded outlined @click="handleSocialLogin('GitHub')" />
            <Button icon="pi pi-facebook" severity="secondary" rounded outlined @click="handleSocialLogin('Facebook')" />
            <Button icon="pi pi-twitter" severity="secondary" rounded outlined @click="handleSocialLogin('Twitter')" />
          </div>
        </div>

        <div class="mt-4 text-center">
          <Button
            label=" Créer un compte"
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
import { useAuthStore } from '@/stores/authStore.js'
import { translations } from '@/datasource/lang.js'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const lang = (key) => {
  return translations[authStore.currentLanguage][key] || key
}

const {
  email,
  password,
  emailError,
  passwordError,
  handleLogin,
  goToCreateAccount,
  handleSocialLogin,
  handleGoogleCallback
} = useLoginService()

onMounted(() => {
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // À remplacer par un vrai ID
      callback: handleGoogleCallback,
      auto_select: false,
      cancel_on_tap_outside: true
    });
    
    window.google.accounts.id.renderButton(
      document.getElementById("google-login-btn"),
      { theme: "outline", size: "large", width: "100%", text: "signin_with", shape: "rectangular" }
    );
    
    // Optionnel
    // window.google.accounts.id.prompt();
  }
})
</script>

<style scoped src="@/assets/styles/LoginForm.css"></style>