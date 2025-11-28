<template>
  <div class="map-container">
    <img src="/public/images/Placeholder.png" alt="Interactive Map" class="map-image"/>

    <div
        v-for="point in points"
        :key="point.id"
        class="map-point"
        :style="{
        top: point.y + '%',
        left: point.x + '%'
      }"
        tabindex="0" >
      <div class="pin-shape"></div>
      <div class="tooltip">{{ point.label }}</div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
const STORAGE_KEY = 'interactive_map_points';

function loadPoints() {
  const storedPoints = localStorage.getItem(STORAGE_KEY);
  // ... (Logique de chargement)
  if (storedPoints) {
    try {
      return JSON.parse(storedPoints);
    } catch (e) {
      return [];
    }
  }
  return [];
}

const points = ref(loadPoints());
</script>

<style scoped>
/* Les styles suivants assurent l'affichage du pin et du tooltip au survol/focus */

.map-point {
  position: absolute;
  transform: translate(-50%, -100%);
  cursor: default; /* Pas de drag, curseur par défaut */
}

.pin-shape {
  width: 20px;
  height: 30px;
  background-color: red;
  border-radius: 50%;
  position: relative;
}

.pin-shape::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid red;
}

.tooltip {
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  font-size: 13px;
}

.map-point:hover .tooltip,
.map-point:focus .tooltip {
  opacity: 1;
}

/* Autres styles de base (map-container, map-image) */
.map-container {
  position: relative;
  display: inline-block;
}

.map-image {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>