import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './authStore'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  const authStore = useAuthStore()

  async function fetchActivities() {
    loading.value = true
    try {
      const response = await fetch(`${API_URL}/activities`, {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Erreur lors du chargement des activités')
      activities.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function addActivity(activityData) {
    try {
      const response = await fetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token || ''}`
        },
        credentials: 'include',
        body: JSON.stringify(activityData)
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de l’ajout')
      }
      const newAct = await response.json()
      activities.value.push(newAct)
      return newAct
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function updateActivity(id, activityData) {
    try {
      const response = await fetch(`${API_URL}/activities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token || ''}`
        },
        credentials: 'include',
        body: JSON.stringify(activityData)
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de la modification')
      }
      const updatedAct = await response.json()
      const index = activities.value.findIndex(a => a._id === id)
      if (index !== -1) activities.value[index] = updatedAct
      return updatedAct
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function deleteActivity(id) {
    try {
      const response = await fetch(`${API_URL}/activities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token || ''}`
        },
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Erreur lors de la suppression')
      activities.value = activities.value.filter(a => a._id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    activities,
    loading,
    error,
    fetchActivities,
    addActivity,
    updateActivity,
    deleteActivity
  }
})
