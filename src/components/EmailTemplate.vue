<script setup>
import {Button, Hr, Html, Text} from "@vue-email/components";

defineProps({
  title: String,
  name: String,
  remerciement: String,
  message: String,
  message_resume: String,
  infos: Object,
  remerciements_fin: String
})
</script>

<template>
  <Html lang="en">
  <Text>{{ title }}</Text>
  <Hr/>
  <span> {{ remerciement }} {{ name }} {{ message }}</span> <br>

  <span> {{ message_resume }} </span> <br>

  <li v-for="info in infos" :key="info.id"> {{ info.label }} : {{ info.value }}</li>

  <span> {{ remerciements_fin }}</span>
  </Html>
</template>


<style scoped>

</style>