import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { users } from '@/datasource/data.js'

export function useLoginService() {
  const router = useRouter()
  const authStore = useAuthStore()

  const email = ref('')
  const password = ref('')
  const emailError = ref('')
  const passwordError = ref('')

  function validate() {
    let isValid = true
    emailError.value = ''
    passwordError.value = ''

    if (!email.value) {
      emailError.value = 'Veuillez entrer un email.'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      emailError.value = 'Veuillez entrer une adresse email valide (ex: exemple@test.com).'
      isValid = false
    }

    if (!password.value) {
      passwordError.value = 'Veuillez entrer un mot de passe.'
      isValid = false
    }

    return isValid
  }

  function handleLogin() {
    if (!validate()) return

    // Simulation d'appel API pour trouver l'utilisateur
    const user = users.find(
      u => u.email === email.value && u.password === password.value
    )

    if (user) {
      // Connexion réussie
      authStore.login(user)
      router.push({ name: 'Home' })
    } else {
      // Échec de connexion
      passwordError.value = 'Email ou mot de passe incorrect.'
    }
  }

  function goToCreateAccount() {
    router.push({ name: 'Register' })
  }

  return {
    email,
    password,
    emailError,
    passwordError,
    handleLogin,
    goToCreateAccount
  }
}
