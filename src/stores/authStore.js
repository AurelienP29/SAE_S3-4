import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    // On initialise l'utilisateur depuis le localStorage s'il existe
    const storedUser = localStorage.getItem('user')
    const user = ref(storedUser ? JSON.parse(storedUser) : null)
    
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


    function login(userData) {
        const newUser = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            roles: userData.roles || [userData.role]
        }
        
        user.value = newUser
        localStorage.setItem('user', JSON.stringify(newUser))
    }

    function logout() {
        user.value = null
        localStorage.removeItem('user')
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