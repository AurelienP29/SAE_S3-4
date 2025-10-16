<template>
  <div class="prestataire-container">
    <h1 class="banner">Prestataire TEST</h1>
    <p>Découvrez prestataire TEST.</p>



    <p>Autres prestataires : </p>
    <ul>
      <li v-for="prestataire in prestataires" :key="prestataire.id">
        {{ prestataire.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";

</script>