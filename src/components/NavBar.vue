<template>
  <div class="nav-bar">
    <button v-for="(title, index) in props.titles" @click="goTo(index)">
      {{ title.text }}
    </button>
    <ul></ul>
  </div>

</template>

<script setup>
import router from "@/router/index.js";

const props = defineProps({
  titles: Array,

  // data: Array, // les données sources
  // fields: Array, // le tableau contenant le nom des champs
  // itemCheck: Boolean, // s'il y a des case à cocher
  // checked: Array, // le tableau des cases cochées
  // itemButton: Object, // l'objet pour les boutons d'items
  // listButton: Object, // l'objet pour le bouton de liste
});

function goTo(linkIndex) {
  console.log(linkIndex);

  switch (linkIndex) {
    case 0:
      router.push({path: "/"});
      break;
    case 1:
      router.push({path: "/"});
      break;
    case 2:
      router.push({path: "/"});
      break;
    default:
      router.push({path: "/"});
  }
}

console.log(props.titles);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
