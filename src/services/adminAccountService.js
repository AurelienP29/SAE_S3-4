import {ref, reactive} from 'vue'
import {users, prestataires, prestations} from '@/datasource/data.mjs'

export function useAdminAccountService() {
    const accounts = ref(users)
    const loading = ref(false)
    const dialogVisible = ref(false)
    const deleteDialogVisible = ref(false)
    const isEditMode = ref(false)
    const selectedAccount = ref(null)

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
        email: ''
    })

    const roleOptions = [
        {label: 'Administrateur', value: 'admin'},
        {label: 'Prestataire', value: 'prestataire'},
        {label: 'Visiteur', value: 'visiteur'},
        {label: 'Organisateur', value: 'organisateur'}
    ]

    function openEditDialog(account) {
        isEditMode.value = true
        selectedAccount.value = account
        Object.assign(form, account)
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
    }

    function validate() {
        let isValid = true
        errors.name = ''
        errors.email = ''

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

    function saveAccount() {
        if (!validate()) return

        /*
        const user = users.find(u => u.id === form.id);
        user.name = form.name;
        user.email = form.email;
        */

        const index = users.findIndex(u => u.id === form.id)
        if (index !== -1) {
            // => Garder le mdp et roles

            const existingUser = users[index]
            users[index] = {
                ...existingUser,
                name: form.name,
                email: form.email,
                role: form.role,
                roles: existingUser.roles.includes(form.role) ? existingUser.roles : [form.role, ...existingUser.roles.filter(r => r !== existingUser.role)],
                phone: form.phone,
                description: form.description
            }

            // maj presta si existe déjà
            const prestaIndex = prestataires.findIndex(p => p.email === existingUser.email)
            if (prestaIndex !== -1) {
                prestataires[prestaIndex].name = form.name
                prestataires[prestaIndex].email = form.email
            }
        }

        closeDialog()
    }

    function confirmDelete(account) {
        selectedAccount.value = account
        deleteDialogVisible.value = true
    }

    function deleteAccount() {
        if (!selectedAccount.value) return

        const userEmail = selectedAccount.value.email
        const userRole = selectedAccount.value.role

        /*
        // TODO : ==> Prestataire -> suppr cascade

        // Simple del (pas cascade)
        const idx = users.findIndex(u => u.id === selectedAccount.value.id);
        users.splice(idx, 1);
        return;
        */

        /*

        const idx = users.findIndex(u => u.id === selectedAccount.value.id);
        users.splice(idx, 1);
        */

        // suppr user
        const userIndex = users.findIndex(u => u.id === selectedAccount.value.id)
        if (userIndex !== -1) {
            users.splice(userIndex, 1)
        }


        if (userRole === 'prestataire') {


            const prestaIndex = prestataires.findIndex(p => p.email === userEmail)
            if (prestaIndex !== -1) {
                const prestataireId = prestataires[prestaIndex].id

                // suppr profil prestataire
                prestataires.splice(prestaIndex, 1)

                // + suppr prestations liées
                for (let i = prestations.length - 1; i >= 0; i--) {
                    if (prestations[i].prestataireId === prestataireId) {
                        prestations.splice(i, 1)
                    }
                }
            }
        }

        deleteDialogVisible.value = false
        selectedAccount.value = null
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
