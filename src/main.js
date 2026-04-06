import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import GoogleSignInPlugin from 'vue3-google-signin'
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import 'primeicons/primeicons.css';
import "/src/assets/styles/style.css";
import "primeflex/primeflex.css";

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false,
        },
    },
});

app.use(GoogleSignInPlugin, {
    clientId: "54870244538-qhsj5p7mdf81mdsc8rel3pcthpg3knk8.apps.googleusercontent.com",
})

app.use(router)
app.use(ToastService);
app.use(ConfirmationService);
app.use(DialogService);

app.mount('#app')
