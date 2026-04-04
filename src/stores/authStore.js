import {ref, computed} from 'vue'
import { defineStore } from 'pinia'
import emailjs from '@emailjs/browser'
import { useActivityStore } from '@/stores/activityStore.js'

export const useAuthStore = defineStore('auth', () => {
    const storedUser = localStorage.getItem('user')
    const user = ref(storedUser ? JSON.parse(storedUser) : null)
    
    const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/users`
    const currentLanguage = ref('fr')
    // Pour l'admin: a aggregateur de toutes les réservations, mais en vrai on va utiliser le profile pour le visiteur
    const reservations = ref([])

    // TODO Stockage temporaire des activités, a modifier après
    const activities = ref([
        { id: 1, titre: "Concours Cosplay", places: 50, date: "Samedi 14h" },
        { id: 2, titre: "Conférence Lovecraft", places: 20, date: "Samedi 16h" },
        { id: 3, titre: "Tournoi Smash Bros", places: 32, date: "Dimanche 10h" },
        { id: 4, titre: "Atelier Maquillage FX", places: 10, date: "Dimanche 14h" }
    ])

    //TODO Stockage temporaire des billets
    const ticketsTypes = ref([
        {id:1 , label: "Tarif réduit" , price: "12€" , description:"Pour les étudiants, personnes au chômage, personne à mobilité réduite et/ou retraitée", cout: 12},
        {id:2 , label: "Tarif plein" , price: "20€", cout:20},
        {id:3 , label: "Tarif enfant de moins de 14 ans", price: "10€", description: "Enfant et adolescent de moins de 14 ans inclus", cout:10},
        {id:4 , label: "Enfant de moins de 5 ans", price:"Gratuit", description: "Enfant de moins de 5 ans inclus",cout:0}
    ])

    const isAuthenticated = computed(() => user.value !== null)

    const userRole = computed(() => user.value?.role || null)

    const mesReservations = computed(() => {
        if (!user.value) return []
        return user.value.reservations || []
    })


    const storedToken = localStorage.getItem('token')
    const token = ref(storedToken || null)

    function login(userData, jwtToken) {
        const newUser = {
            id: userData._id || userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            roles: userData.roles || [userData.role],
            phone: userData.phone || '',
            description: userData.description || '',
            picture: userData.picture || '',
            reservations: userData.reservations || [],
            tickets: userData.tickets || []
        }
        
        user.value = newUser
        localStorage.setItem('user', JSON.stringify(newUser))

        if (jwtToken) {
            token.value = jwtToken
            localStorage.setItem('token', jwtToken)
        }
    }

    function updateUser(updatedData) {
        if (user.value) {
            user.value = { ...user.value, ...updatedData }
            localStorage.setItem('user', JSON.stringify(user.value))
        }
    }

    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    function setLanguage(lang) {
        currentLanguage.value = lang
    }

    async function reserverActivite(activiteId) {
        if (!user.value) return false

        console.log("Tentative de réservation, act:", activiteId)
        
        const activityStore = useActivityStore()
        const activite = activities.value.find(a => a.id === activiteId) || activityStore?.activities?.find(a => a._id === activiteId) || { id: activiteId, titre: 'Activité', date: new Date().toLocaleDateString() }

        try {
            const response = await fetch(`${API_URL}/${user.value.id}/reservations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activite })
            })
            if (response.ok) {
                const data = await response.json()
                // Update local user
                updateUser({ reservations: data.user.reservations })
                
                // Mettre à jour le compteur en direct
                if (activityStore.activities) {
                    const actIdx = activityStore.activities.findIndex(a => a._id === activiteId || a.id === activiteId);
                    if (actIdx !== -1 && activityStore.activities[actIdx].places > 0) {
                        activityStore.activities[actIdx].places -= 1;
                    }
                }

                alert(`Réservation enregistrée !`)
               
                return true
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`Réservation impossible : ${errorData.error || response.statusText}`);
                return false;
            }
        } catch(e) {
            console.error(e)
            alert("Erreur de connexion au serveur !");
        }
        return false
    }

    async function annulerReservation(reservationId) {
        if (!user.value) return false

        console.log("Tentative de suppression de réservation:", reservationId)
        try {
            const response = await fetch(`${API_URL}/${user.value.id}/reservations/${reservationId}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                const currentRes = user.value.reservations || []
                const resToDelete = currentRes.find(r => r.id === reservationId || r.id === parseInt(reservationId));

                updateUser({ reservations: currentRes.filter(r => r.id !== reservationId && r.id !== parseInt(reservationId)) })
                
                // Mettre à jour le compteur en direct
                const activityStore = useActivityStore()
                if (resToDelete && activityStore.activities) {
                    const actId = resToDelete.activite._id || resToDelete.activite.id;
                    const actIdx = activityStore.activities.findIndex(a => a._id === actId || a.id === actId);
                    if (actIdx !== -1) {
                        activityStore.activities[actIdx].places += 1;
                    }
                }

                alert("Réservation annulée !")
                return true
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`Annulation impossible : ${errorData.error || response.statusText}`);
                return false;
            }
        } catch(e) {
            console.error(e)
            alert("Erreur de connexion au serveur !");
        }
        return false
    }

    async function acheterBillets(tickets) {
        if (!user.value) return false

        console.log("Tentative d'achat de billets:", tickets)
        try {
            const response = await fetch(`${API_URL}/${user.value.id}/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tickets })
            })
            if (response.ok) {
                const data = await response.json()
                updateUser({ tickets: data.user.tickets })
                console.log("Billets ajoutés avec succès dans le state local", data.user.tickets)
                return true
            } else {
                const errText = await response.text();
                console.error("API Error when adding tickets:", response.status, errText);
                alert("Erreur de sauvegarde: le serveur a refusé les billets. " + response.status);
            }
        } catch(e) {
            console.error("Fetch threw an error:", e)
            alert("Erreur de connexion au serveur !");
        }
        return false
    }

    return {
        user,
        token,
        isAuthenticated,
        userRole,
        currentLanguage,
        activities, // TODO Pareil, stockage des activités temporaire
        ticketsTypes, //todo idem
        reservations,
        mesReservations,
        login,
        updateUser,
        logout,
        setLanguage,
        reserverActivite,
        annulerReservation,
        acheterBillets
    }
})