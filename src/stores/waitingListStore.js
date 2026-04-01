import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useWaitingListStore = defineStore('waitingList', () => {
    const waitingList = ref([])
    const loading = ref(false)
    const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/waitingList`

    async function fetchWaitingList() {
        loading.value = true
        try {
            console.log('Fetching waitingList from:', API_URL)
            const response = await fetch(API_URL, { credentials: 'include' })
            if (response.ok) {
                const data = await response.json()
                console.log('WaitingList data received:', data)
                if (data.waitingList) {
                    waitingList.value = data.waitingList.map(p => ({ ...p, id: p._id }))
                }
            }
        } catch (error) {
            console.error('Erreur chargement waitingList:', error)
        } finally {
            loading.value = false
        }
    }

    async function addRequest(request) {
        loading.value = true
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(request)
            })
            if (response.ok) {
                await fetchWaitingList()
            }
        } catch (error) {
            console.error('Erreur ajout demande:', error)
        } finally {
            loading.value = false
        }
    }

    async function deleteRequest(id) {
        loading.value = true
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (response.ok) {
                await fetchWaitingList()
            }
        } catch (error) {
            console.error('Erreur suppression demande:', error)
        } finally {
            loading.value = false
        }
    }

    return {
        waitingList,
        loading,
        fetchWaitingList,
        addRequest,
        deleteRequest
    }
})
