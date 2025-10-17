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
    >
      <div class="pin-shape"></div>
      <div class="tooltip">{{ point.label }}</div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";

const points = ref([
  {id: 1, x: 25, y: 40, label: 'Test n°1'},
  {id: 2, x: 60, y: 70, label: 'Test n°2'},
])
</script>

<style scoped>
.map-container {
  position: relative;
  display: inline-block;
}

.map-image {
  display: block;
  max-width: 100%;
  height: auto;
}

.map-point {
  position: absolute;
  transform: translate(-50%, -100%);
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

.map-point:hover .tooltip{
  opacity: 1;
}

</style>