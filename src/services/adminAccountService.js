import { ref, reactive, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore.js'
import { prestataires, prestations } from '@/datasource/data.mjs'

export function useAdminAccountService() {
    const userStore = useUserStore()
    const dialogVisible = ref(false)
    const deleteDialogVisible = ref(false)
    const isEditMode = ref(false)
    const selectedAccount = ref(null)

    const form = reactive({
        id: null,
        name: '',
        email: '',
        role: '',
        roles: [],
        phone: '',
        description: ''
    })

    const errors = reactive({
        name: '',
        email: '',
        global: ''
    })

    const roleOptions = [
        { label: 'Administrateur', value: 'admin' },
        { label: 'Prestataire', value: 'prestataire' },
        { label: 'Visiteur', value: 'visiteur' },
        { label: 'Organisateur', value: 'organisateur' }
    ]

    onMounted(() => {
        userStore.fetchUsers()
    })

    function openEditDialog(account) {
        if (account) {
            isEditMode.value = true
            selectedAccount.value = account
            Object.assign(form, account)
            form.id = account.id || account._id
            form.roles = account.roles || [account.role]
        } else {
            isEditMode.value = false
            selectedAccount.value = null
            resetForm()
        }
        dialogVisible.value = true
    }

    function closeDialog() {
        dialogVisible.value = false
        resetForm()
    }

    function resetForm() {
        form.id = null
        form.name = ''
        form.email = ''
        form.role = ''
        form.roles = []
        form.phone = ''
        form.description = ''
        errors.name = ''
        errors.email = ''
        errors.global = ''
    }

    function validate() {
        let isValid = true
        errors.name = ''
        errors.email = ''
        errors.global = ''

        if (!form.name) {
            errors.name = 'Le nom est requis.'
            isValid = false
        }
        if (!form.email) {
            errors.email = "L'email est requis."
            isValid = false
        }

        return isValid
    }

    async function saveAccount() {
        if (!validate()) return

        try {
            const payload = { ...form }
            if (!isEditMode.value && !payload.password) {
                payload.password = 'password123'
                payload.roles = [payload.role]
            }

            if (isEditMode.value) {
                await userStore.updateUser(payload)
            } else {
                await userStore.addUser(payload)
            }
            closeDialog()
        } catch (error) {
            console.error('Erreur sauvegarde utilisateur:', error)
            errors.global = 'Erreur lors de la sauvegarde.'
        }
    }

    function confirmDelete(account) {
        selectedAccount.value = account
        deleteDialogVisible.value = true
    }

    async function deleteAccount() {
        if (!selectedAccount.value || selectedAccount.value.role === 'admin') return

        try {
            await userStore.deleteUser(selectedAccount.value.id || selectedAccount.value._id)
            deleteDialogVisible.value = false
            selectedAccount.value = null
        } catch (error) {
            console.error('Erreur suppression utilisateur:', error)
        }
    }

    return {
        accounts: computed(() => userStore.users),
        loading: computed(() => userStore.loading),
        dialogVisible,
        deleteDialogVisible,
        isEditMode,
        selectedAccount,
        form,
        errors,
        roleOptions,
        openEditDialog,
        closeDialog,
        saveAccount,
        confirmDelete,
        deleteAccount
    }
}

