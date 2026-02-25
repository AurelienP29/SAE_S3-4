import {ref, reactive} from 'vue'
import {usePrestationStore} from '@/stores/prestation.js'
import {categoryOptions, prestataires} from '@/datasource/data.mjs'

export function useAdminPrestationService() {
    const prestationStore = usePrestationStore()

    const dialogVisible = ref(false)
    const deleteDialogVisible = ref(false)
    const isEditMode = ref(false)
    const selectedToDelete = ref(null)

    const emptyForm = () => ({
        id: null,
        name: '',
        Champ1: '',
        prestataireId: null,
        category: null,
        description: ''
    })

    const form = reactive(emptyForm())
    const errors = reactive({
        name: '',
        Champ1: ''
    })

    function openCreateDialog() {
        Object.assign(form, emptyForm())
        errors.name = ''
        errors.Champ1 = ''
        isEditMode.value = false
        dialogVisible.value = true
    }

    function openEditDialog(prestation) {
        Object.assign(form, prestation)
        errors.name = ''
        errors.Champ1 = ''
        isEditMode.value = true
        dialogVisible.value = true
    }

    function closeDialog() {
        dialogVisible.value = false
    }

    function validateForm() {
        errors.name = ''
        errors.Champ1 = ''
        let isValid = true

        if (!form.name) {
            errors.name = 'Le nom est obligatoire.'
            isValid = false
        }

        if (!form.Champ1) {
            errors.Champ1 = "La zone est obligatoire."
            isValid = false
        }

        return isValid
    }

    function savePrestation() {
        if (!validateForm()) return

        if (isEditMode.value) {
            prestationStore.updatePrestation(form)
        } else {
            prestationStore.addPrestation(form)
        }

        dialogVisible.value = false
    }

    function confirmDelete(prestation) {
        selectedToDelete.value = prestation
        deleteDialogVisible.value = true
    }

    function deletePrestation() {
        if (!selectedToDelete.value) return
        prestationStore.deletePrestation(selectedToDelete.value.id)
        deleteDialogVisible.value = false
        selectedToDelete.value = null
    }

    return {
        prestations: prestationStore.prestations,
        loading: prestationStore.loading,
        dialogVisible,
        deleteDialogVisible,
        isEditMode,
        selectedToDelete,
        form,
        errors,
        categoryOptions,
        prestataires,
        openCreateDialog,
        openEditDialog,
        closeDialog,
        savePrestation,
        confirmDelete,
        deletePrestation
    }
}
