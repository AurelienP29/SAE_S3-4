<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2 class="text-center mb-4">Créer un compte</h2>

      <div class="p-fluid">
        <div class="field mb-4">
          <label for="name" class="block mb-2">Nom complet</label>
          <InputText
            id="name"
            v-model="name"
            type="text"
            placeholder="Votre nom"
            :class="{ 'p-invalid': nameError }"
            class="loginInputField"
          />
          <div v-if="nameError" style="color: red;">{{ nameError }}</div>
        </div>

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
            :feedback="true"
            toggleMask
            placeholder="Votre mot de passe"
            :class="{ 'p-invalid': passwordError }"
            class="loginInputField"
            fluid
            promptLabel="Entrez un mot de passe"
            weakLabel="Faible"
            mediumLabel="Moyen"
            strongLabel="Fort"
          />
          <div v-if="passwordError" style="color: red;">{{ passwordError }}</div>
        </div>

        <div class="field mb-4">
          <label for="confirmPassword" class="block mb-2">Confirmer le mot de passe</label>
          <Password
            id="confirmPassword"
            v-model="confirmPassword"
            :feedback="false"
            toggleMask
            placeholder="Confirmez votre mot de passe"
            :class="{ 'p-invalid': confirmPasswordError }"
            class="loginInputField"
            fluid
          />
          <div v-if="confirmPasswordError" style="color: red;">{{ confirmPasswordError }}</div>
        </div>

        <Button label="S'inscrire" icon="pi pi-user-plus" @click="handleRegister" />

        <div class="divider">
          <span>{{ lang('register.with.social') }}</span>
        </div>

        <div class="social-login-grid">
          <div id="google-register-btn" class="social-btn google-btn-container"></div>
          
          <div class="social-icons-row mt-3">
            <Button icon="pi pi-github" severity="secondary" rounded outlined @click="handleSocialLogin('GitHub')" />
            <Button icon="pi pi-facebook" severity="secondary" rounded outlined @click="handleSocialLogin('Facebook')" />
            <Button icon="pi pi-twitter" severity="secondary" rounded outlined @click="handleSocialLogin('Twitter')" />
          </div>
        </div>

        <div class="mt-4 text-center">
          <Button
            label=" Déjà un compte ? Se connecter"
            icon="pi pi-sign-in"
            class="p-button-text"
            @click="goToLogin"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { translations } from '@/datasource/lang.js'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { users } from '@/datasource/data.js'
import { useLoginService } from '@/services/loginService.js'

const authStore = useAuthStore()
const lang = (key) => {
  return translations[authStore.currentLanguage][key] || key
}

const { handleSocialLogin, handleGoogleCallback } = useLoginService()

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

onMounted(() => {
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      callback: handleGoogleCallback,
      auto_select: false,
      cancel_on_tap_outside: true
    });
    
    window.google.accounts.id.renderButton(
      document.getElementById("google-register-btn"),
      { theme: "outline", size: "large", width: "100%", text: "signup_with", shape: "rectangular" }
    );
  }
})

function validate() {
  let isValid = true
  nameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''

  if (!name.value) {
    nameError.value = 'Le nom est obligatoire.'
    isValid = false
  }

  if (!email.value) {
    emailError.value = "L'email est obligatoire."
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = "Veuillez entrer une adresse email valide."
    isValid = false
  } else if (users.find(u => u.email === email.value)) {
    emailError.value = "Cet email est déjà utilisé."
    isValid = false
  }

  if (!password.value) {
    passwordError.value = 'Le mot de passe est obligatoire.'
    isValid = false
  }

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Les mots de passe ne correspondent pas.'
    isValid = false
  }

  return isValid
}

function handleRegister() {
  if (!validate()) return

  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name: name.value,
    email: email.value,
    password: password.value,
    role: 'visiteur',
    roles: ['visiteur']
  }

  users.push(newUser)

  router.push({ name: 'Login' })
}

function goToLogin() {
  router.push({ name: 'Login' })
}

// function handleSocialLogin(provider) {
//   // Simulation d'une connexion sociale
//   const socialUser = {
//     id: 999,
//     name: `Social User (${provider})`,
//     email: `social@${provider.toLowerCase()}.com`,
//     role: 'visiteur',
//     roles: ['visiteur']
//   }
//   authStore.login(socialUser)
//   router.push({ name: 'Home' })
// }
</script>

<style scoped src="@/assets/styles/LoginForm.css"></style>