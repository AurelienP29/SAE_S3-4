import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const currentLanguage = ref('fr')
    const reservations = ref([])

    // TODO Stockage temporaire des activités, a modifier après
    const activities = ref([
        { id: 1, titre: "Concours Cosplay", places: 50, date: "Samedi 14h" },
        { id: 2, titre: "Conférence Lovecraft", places: 20, date: "Samedi 16h" },
        { id: 3, titre: "Tournoi Smash Bros", places: 32, date: "Dimanche 10h" },
        { id: 4, titre: "Atelier Maquillage FX", places: 10, date: "Dimanche 14h" }
    ])

    const isAuthenticated = computed(() => user.value !== null)

    const userRole = computed(() => user.value?.role || null)

    const mesReservations = computed(() => {
        if (!user.value) return []
        return reservations.value.filter(r => r.userEmail === user.value.email)
    })


    function login(email) {
        let role
        let nom

        if (email.includes('admin')) {
            role = 'organisateur'
            nom = 'Organisateur'
        } else if (email.includes('prestataire')) {
            role = 'prestataire'
            nom = 'Prestataire'
        } else {
            role = 'visiteur'
            nom = 'Visiteur'
        }

        user.value = {
            email: email,
            name: nom,
            role: role,
            roles: [role]
        }
    }

    function logout() {
        user.value = null
    }

    function setLanguage(lang) {
        currentLanguage.value = lang
    }

    function reserverActivite(activiteId) {
        if (!user.value) return false

        const activite = activities.value.find(a => a.id === activiteId)

        if (activite) {
            reservations.value.push({
                id: Date.now(),
                userEmail: user.value.email,
                activite: activite,
                dateReservation: new Date().toLocaleDateString()
            })

            alert(`Réservation enregistrée`)
            // TODO Envoyer un mail de confirmation de réservation
            return true
        }
        return false
    }

    function annulerReservation(reservationId) {
        const index = reservations.value.findIndex(r => r.id === reservationId)
        if (index !== -1) {
            reservations.value.splice(index, 1)
            return true
        }
        return false
    }

    return {
        user,
        isAuthenticated,
        userRole,
        currentLanguage,
        activities, // TODO Pareil, stockage des activités temporaire
        reservations,
        mesReservations,
        login,
        logout,
        setLanguage,
        reserverActivite,
        annulerReservation
    }
})