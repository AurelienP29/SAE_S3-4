<template>
  <header>
    <NavBar />

  </header>

  <Main>
    <router-view></router-view>
  </Main>
</template>

<script setup>
import {onMounted} from "vue";
import { RouterView } from 'vue-router'
import NavBar from "@/components/NavBar.vue"
import Card from 'primevue/card';

onMounted(() => {
})

// const props = defineProps([ "" ])

</script>

<style scoped></style>
