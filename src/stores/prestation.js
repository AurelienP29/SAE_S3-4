import {ref} from 'vue'
import {defineStore} from 'pinia'
import {prestations as initialPrestations} from '@/datasource/data.mjs'

export const usePrestationStore = defineStore('prestation', () => {
    const prestations = ref([...initialPrestations])
    const loading = ref(false)

    function addPrestation(prestation) {
        /*
        draft: prestations.value.push(prestation)
        */
        const newId = prestations.value.length > 0
            ? Math.max(...prestations.value.map(p => p.id)) + 1
            : 1
        prestations.value.push({...prestation, id: newId})
    }

    function updatePrestation(updatedPrestation) {
        const index = prestations.value.findIndex(p => p.id === updatedPrestation.id)
        if (index !== -1) {
            prestations.value[index] = {...updatedPrestation}
        }
    }

    function deletePrestation(id) {
        // // const idx = prestations.value.findIndex(p => p.id === id);
        // prestations.value.splice(idx, 1);
        prestations.value = prestations.value.filter(p => p.id !== id)
    }

    return {
        prestations,
        loading,
        addPrestation,
        updatePrestation,
        deletePrestation
    }
})
