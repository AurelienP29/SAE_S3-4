import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/authStore.js'
import {users} from '@/datasource/data.mjs'

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

    async function handleLogin() {
        if (!validate()) return

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: email.value, password: password.value })
            })

            const data = await response.json()

            if (!response.ok) {
                passwordError.value = data.message || 'Email ou mot de passe incorrect.'
                return
            }

            authStore.login(data.user, data.token)
            router.push({name: 'Home'})
        } catch (err) {
            console.error('Login error:', err)
            passwordError.value = 'Erreur réseau. Veuillez réessayer.'
        }
    }

    function goToCreateAccount() {
        router.push({name: 'Register'})
    }

    function handleSocialLogin(provider) {
        if (provider === 'Google') {

            // [API GIS de google]
            console.log("Login via Google initié");
            return;
        }

        // Simulation ouverture, à changer
        const oauthUrls = {
            GitHub: 'https://github.com/login/oauth/authorize?client_id=YOUR_GITHUB_CLIENT_ID',
            Facebook: 'https://www.facebook.com/v12.0/dialog/oauth?client_id=YOUR_FB_CLIENT_ID',
            Twitter: 'https://twitter.com/i/oauth2/authorize?client_id=YOUR_TWITTER_CLIENT_ID'
        };

        if (oauthUrls[provider]) {

            alert(`Redirection vers le portail d'authentification ${provider}... (Simulation)`);
            setTimeout(() => {
                const socialUser = {
                    id: Date.now(),
                    name: `Utilisateur ${provider}`,
                    email: `contact@${provider.toLowerCase()}.com`,
                    role: 'visiteur',
                    roles: ['visiteur']
                };
                authStore.login(socialUser);
                router.push({name: 'Home'});
            });
        }
    }

    function handleGoogleLogin() {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
        window.location.href = `${API_URL}/auth/google`
    }

    return {
        email,
        password,
        emailError,
        passwordError,
        handleLogin,
        goToCreateAccount,
        handleSocialLogin,
        handleGoogleLogin
    }
}
