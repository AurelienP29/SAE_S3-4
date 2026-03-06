import { ref, reactive, onMounted } from 'vue'
import { prestataires, prestations } from '@/datasource/data.mjs' // Géré partiellement en mock pour presta/prestation

export function useAdminAccountService() {
    const accounts = ref([])
    const loading = ref(false)
    const dialogVisible = ref(false)
    const deleteDialogVisible = ref(false)
    const isEditMode = ref(false)
    const selectedAccount = ref(null)

    const API_URL = 'http://localhost:3000/users'

    const form = reactive({
        id: null,
        name: '',
        email: '',
        role: '',
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

    async function fetchAccounts() {
        loading.value = true
        try {
            const response = await fetch(API_URL)
            if (response.ok) {
                const data = await response.json()
                accounts.value = data.users.map(u => ({ ...u, id: u._id }))
            } else {
                console.error('Erreur de récupération des utilisateurs')
            }
        } catch (error) {
            console.error('Erreur réseau:', error)
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchAccounts()
    })

    function openEditDialog(account) {
        if (account) {
            isEditMode.value = true
            selectedAccount.value = account
            Object.assign(form, account)
            form.id = account._id || account.id // Gérer _id
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

        loading.value = true
        try {
            const url = isEditMode.value ? `${API_URL}/${form.id}` : API_URL
            const method = isEditMode.value ? 'PUT' : 'POST'

            const payload = { ...form }
            if (!isEditMode.value && !payload.password) {
                payload.password = 'password123' // Mot de passe par défaut pour création admin
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                await fetchAccounts() // Rafraîchir la liste
                closeDialog()
            } else {
                const data = await response.json()
                errors.global = data.error || 'Erreur lors de la sauvegarde'
            }
        } catch (error) {
            console.error('Erreur réseau:', error)
            errors.global = 'Erreur réseau lors de la sauvegarde.'
        } finally {
            loading.value = false
        }
    }

    function confirmDelete(account) {
        selectedAccount.value = account
        deleteDialogVisible.value = true
    }

    async function deleteAccount() {
        if (!selectedAccount.value || selectedAccount.value.role === 'admin') return

        const userEmail = selectedAccount.value.email
        const userRole = selectedAccount.value.role
        const userId = selectedAccount.value._id || selectedAccount.value.id

        loading.value = true
        try {
            const response = await fetch(`${API_URL}/${userId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                // Suppr locaux liés (pour ne pas casser le reste qui est mocké)
                if (userRole === 'prestataire') {
                    const prestaIndex = prestataires.findIndex(p => p.email === userEmail)
                    if (prestaIndex !== -1) {
                        const prestataireId = prestataires[prestaIndex].id
                        prestataires.splice(prestaIndex, 1)
                        for (let i = prestations.length - 1; i >= 0; i--) {
                            if (prestations[i].prestataireId === prestataireId) {
                                prestations.splice(i, 1)
                            }
                        }
                    }
                }

                await fetchAccounts()
                deleteDialogVisible.value = false
                selectedAccount.value = null
            } else {
                console.error("Erreur de suppression")
            }
        } catch (error) {
            console.error('Erreur réseau suppression:', error)
        } finally {
            loading.value = false
        }
    }

    return {
        accounts,
        loading,
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

