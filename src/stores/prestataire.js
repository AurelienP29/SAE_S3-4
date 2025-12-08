import {ref} from 'vue'
import {defineStore} from 'pinia'
import {prestataires as initialPrestataires} from '@/datasource/data.js'

export const usePrestataireStore = defineStore('prestataire', () => {
    const prestataires = ref([...initialPrestataires])
    const loading = ref(false)

    function addPrestataire(prestataire) {
        const newId = prestataires.value.length > 0
            ? Math.max(...prestataires.value.map(p => p.id)) + 1
            : 1
        prestataires.value.push({...prestataire, id: newId})
    }

    function updatePrestataire(updatedPrestataire) {
        const index = prestataires.value.findIndex(p => p.id === updatedPrestataire.id)
        if (index !== -1) {
            prestataires.value[index] = {...updatedPrestataire}
        }
    }

    function deletePrestataire(id) {
        prestataires.value = prestataires.value.filter(p => p.id !== id)
    }

    return {
        prestataires,
        loading,
        addPrestataire,
        updatePrestataire,
        deletePrestataire
    }
})
