import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    const users = ref([])
    const loading = ref(false)
    const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/users`

    async function fetchUsers() {
        loading.value = true
        try {
            console.log('Fetching users from:', API_URL)
            const response = await fetch(API_URL, { credentials: 'include' })
            if (response.ok) {
                const data = await response.json()
                console.log('Users data received:', data)
                if (data.users) {
                    users.value = data.users.map(u => ({ ...u, id: u._id }))
                }
            }
        } catch (error) {
            console.error('Erreur chargement utilisateurs:', error)
        } finally {
            loading.value = false
        }
    }

    async function addUser(user) {
        loading.value = true
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(user)
            })
            if (response.ok) {
                await fetchUsers()
            }
        } catch (error) {
            console.error('Erreur ajout utilisateur:', error)
        } finally {
            loading.value = false
        }
    }

    async function updateUser(updatedUser) {
        loading.value = true
        try {
            const id = updatedUser.id || updatedUser._id
            const { id: _, _id: __, ...data } = updatedUser
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data)
            })
            if (response.ok) {
                await fetchUsers()
            }
        } catch (error) {
            console.error('Erreur mise à jour utilisateur:', error)
        } finally {
            loading.value = false
        }
    }

    async function deleteUser(id) {
        loading.value = true
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (response.ok) {
                await fetchUsers()
            }
        } catch (error) {
            console.error('Erreur suppression utilisateur:', error)
        } finally {
            loading.value = false
        }
    }

    return {
        users,
        loading,
        fetchUsers,
        addUser,
        updateUser,
        deleteUser
    }
})
