import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import emailjs from '@emailjs/browser'

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
            const templateParams = {
                salutation: this.user.name,
                activite: activite.titre,
                date: activite.date,
            }
            emailjs.send('service_2zpxqyi', 'template_ul9qm2l', templateParams)
                .then((response) => {
                    console.log('SUCCESS!', response.status, response.text);
                }, (err) => {
                    console.log('FAILED...', err);
                })
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
        ticketsTypes, //todo idem
        reservations,
        mesReservations,
        login,
        logout,
        setLanguage,
        reserverActivite,
        annulerReservation
    }
})