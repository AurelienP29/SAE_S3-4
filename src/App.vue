<template>
  <NavBar />
  <header>
  </header>

  <Main>
    <router-view></router-view>
  </Main>
  <footer>
    <Footer />
  </footer>
</template>

<script setup>
import {onMounted} from "vue";
import { RouterView } from 'vue-router'
import NavBar from "@/components/NavBar.vue"
import Footer from "@/components/Footer.vue"

onMounted(() => {
})

// const props = defineProps([ "" ])

</script>

<style scoped></style>
