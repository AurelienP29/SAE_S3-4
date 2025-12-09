import {ref, reactive} from 'vue'
import {usePrestataireStore} from '@/stores/prestataire.js'

export function useAdminPrestataireService() {
    const prestataireStore = usePrestataireStore()

    const dialogVisible = ref(false)
    const deleteDialogVisible = ref(false)
    const isEditMode = ref(false)
    const selectedToDelete = ref(null)

    const categoryOptions = [
        {label: 'Atelier', value: 'atelier'},
        {label: 'Restauration', value: 'restauration'},
    ]

    const emptyForm = () => ({
        id: null,
        name: '',
        email: '',
        phone: '',
        category: null,
        description: ''
    })

    const form = reactive(emptyForm())
    const errors = reactive({
        name: '',
        email: ''
    })

    function openCreateDialog() {
        Object.assign(form, emptyForm())
        errors.name = ''
        errors.email = ''
        isEditMode.value = false
        dialogVisible.value = true
    }

    function openEditDialog(prestataire) {
        Object.assign(form, prestataire)
        errors.name = ''
        errors.email = ''
        isEditMode.value = true
        dialogVisible.value = true
    }

    function closeDialog() {
        dialogVisible.value = false
    }

    function validateForm() {
        errors.name = ''
        errors.email = ''
        let isValid = true

        if (!form.name) {
            errors.name = 'Le nom est obligatoire.'
            isValid = false
        }

        if (!form.email) {
            errors.email = "L'email est obligatoire."
            isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = "Veuillez entrer une adresse email valide."
            isValid = false
        }

        return isValid
    }

    function savePrestataire() {
        if (!validateForm()) return

        if (isEditMode.value) {
            prestataireStore.updatePrestataire(form)
        } else {
            prestataireStore.addPrestataire(form)
        }

        dialogVisible.value = false
    }

    function confirmDelete(prestataire) {
        selectedToDelete.value = prestataire
        deleteDialogVisible.value = true
    }

    function deletePrestataire() {
        if (!selectedToDelete.value) return
        prestataireStore.deletePrestataire(selectedToDelete.value.id)
        deleteDialogVisible.value = false
        selectedToDelete.value = null
    }

    return {
        prestataires: prestataireStore.prestataires,
        loading: prestataireStore.loading,
        dialogVisible,
        deleteDialogVisible,
        isEditMode,
        selectedToDelete,
        form,
        errors,
        categoryOptions,
        openCreateDialog,
        openEditDialog,
        closeDialog,
        savePrestataire,
        confirmDelete,
        deletePrestataire
    }
}
