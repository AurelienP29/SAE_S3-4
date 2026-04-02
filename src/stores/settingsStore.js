import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useSettingsStore = defineStore('settings', () => {
  const authStore = useAuthStore();
  const settings = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const homeTexts = computed(() => settings.value?.homeTexts || {});
  const fonts = computed(() => settings.value?.fonts || {});
  const images = computed(() => settings.value?.images || {});

  async function fetchSettings() {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${API_URL}/settings`);
      settings.value = response.data;
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function updateSettings(newSettings) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.put(`${API_URL}/settings`, newSettings, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
      settings.value = response.data.settings;
      return true;
    } catch (err) {
      console.error('Failed to update settings:', err);
      error.value = err.response?.data?.message || err.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    settings,
    loading,
    error,
    homeTexts,
    fonts,
    images,
    fetchSettings,
    updateSettings
  };
});
