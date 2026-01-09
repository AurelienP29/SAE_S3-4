import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/authStore.js'
import {users} from '@/datasource/data.js'

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

        const user = users.find(
            u => u.email === email.value && u.password === password.value
        )

        if (user) {
            authStore.login(user)
            router.push({name: 'Home'})
        } else {
            passwordError.value = 'Email ou mot de passe incorrect.'
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

        //TODO:
        // Simulation ouverture
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

    function handleGoogleCallback(response) {
        // TODO: fenêtre de connection -> refus
        /*
        console.log("Google response:", response);
        authStore.login({ name: "Google User", role: "visiteur" });
        */
        try {
            // Décodage du JWT renvoyé par Google
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const googleUser = JSON.parse(jsonPayload);

            const user = {
                id: googleUser.sub,
                name: googleUser.name,
                email: googleUser.email,
                picture: googleUser.picture,
                role: 'visiteur',
                roles: ['visiteur']
            };

            authStore.login(user);
            router.push({name: 'Home'});
        } catch (e) {
            console.error("Erreur lors du décodage du token Google", e);
        }
    }

    return {
        email,
        password,
        emailError,
        passwordError,
        handleLogin,
        goToCreateAccount,
        handleSocialLogin,
        handleGoogleCallback
    }
}
