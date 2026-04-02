<template>
  <NavBar />
  <header></header>

  <Main>
    <router-view></router-view>
  </Main>
  <footer></footer>
</template>

<script setup>
import { onMounted, watch } from "vue";
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import emailjs from "@emailjs/browser";
import { useSettingsStore } from "@/stores/settingsStore";

const settingsStore = useSettingsStore();

onMounted(() => {
  settingsStore.fetchSettings();
});

watch(() => settingsStore.fonts, (newFonts) => {
  if (newFonts.primary) {
    document.documentElement.style.setProperty('--necro-font-primary', newFonts.primary);
  }
  if (newFonts.secondary) {
    document.documentElement.style.setProperty('--necro-font-secondary', newFonts.secondary);
  }
}, { deep: true, immediate: true });

emailjs.init({
  publicKey: "wGckwO4lkmqPnxGfJ",
  hasData: true,
});
</script>

<style scoped></style>
<style>
body {
  margin: 0;
  padding: 0;
}
</style>
