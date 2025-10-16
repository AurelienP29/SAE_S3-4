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
    ></div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const points = ref([
  {id: 1, x: 25, y: 40 },
  {id: 2, x: 60, y: 70},
])
</script>

<style scoped>
.map-container {
  position: relative;
  display: inline-block;
}

.map-image{
  display: block;
  max-width: 100%;
  height: auto;
}

.map-point{
  position: absolute;
  width: 20px;
  height: 30px;
  background-color: red;
  border-radius: 50%;
  transform: translate(-50%, -100%);
  pointer-events: none;
}

.map-point::after {
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

</style>