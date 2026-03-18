import {ref} from 'vue'
import {defineStore} from 'pinia'
import {prestataires as initialPrestataires} from '@/datasource/data.mjs'

export const usePrestataireStore = defineStore('prestataire', () => {
    const prestataires = ref([])
    const loading = ref(false)
    const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/prestataires`

    async function fetchPrestataires() {
        loading.value = true
        try {
            console.log('Fetching prestataires from:', API_URL)
            const response = await fetch(API_URL, { credentials: 'include' })
            if (response.ok) {
                const data = await response.json()
                console.log('Prestataires data received:', data)
                if (data.prestataires) {
                  prestataires.value = data.prestataires.map(p => ({ ...p, id: p._id }))
                } else {
                  console.error('Data format error: data.prestataires is missing')
                }
            } else {
                console.error('Fetch failed with status:', response.status)
            }
        } catch (error) {
            console.error('Erreur chargement prestataires:', error)
        } finally {
            loading.value = false
        }
    }

    async function fetchPrestataireById(id) {
        loading.value = true
        try {
            const response = await fetch(`${API_URL}/${id}`, { credentials: 'include' })
            if (response.ok) {
                const data = await response.json()
                return { ...data, id: data._id }
            }
        } catch (error) {
            console.error('Erreur chargement prestataire:', error)
        } finally {
            loading.value = false
        }
        return null
    }

    async function addPrestataire(prestataire) {
        loading.value = true
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(prestataire)
            })
            if (response.ok) {
                await fetchPrestataires()
            }
        } catch (error) {
            console.error('Erreur ajout prestataire:', error)
        } finally {
            loading.value = false
        }
    }

    async function updatePrestataire(updatedPrestataire) {
        loading.value = true
        try {
            const { id, ...data } = updatedPrestataire
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data)
            })
            if (response.ok) {
                await fetchPrestataires()
            }
        } catch (error) {
            console.error('Erreur mise à jour prestataire:', error)
        } finally {
            loading.value = false
        }
    }

    async function deletePrestataire(id) {
        loading.value = true
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (response.ok) {
                await fetchPrestataires()
            }
        } catch (error) {
            console.error('Erreur suppression prestataire:', error)
        } finally {
            loading.value = false
        }
    }

    function getPrestataireById(id) {
        return prestataires.value.find(p => p.id === id)
    }

    return {
        prestataires,
        loading,
        fetchPrestataires,
        fetchPrestataireById,
        addPrestataire,
        updatePrestataire,
        deletePrestataire,
        getPrestataireById
    }
})
