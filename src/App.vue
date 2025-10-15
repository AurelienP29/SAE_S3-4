<template>
  <div>
    <NavBar :titles="[{text: 'A', color: 'black'}, {text: 'B', color: 'black'}, {text: 'C', color: 'black'}]" />
    <h1>You did it!</h1>
    <p>
      Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
      documentation
    </p>
    <router-view></router-view>
  </div>
</template>

<script setup>
import {onMounted} from "vue";
import NavBar from "@/components/NavBar.vue";

onMounted(() => {
})

// const props = defineProps([ "" ])

</script>

<style scoped></style>
