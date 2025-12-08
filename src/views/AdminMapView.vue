<script setup>

import InteractiveMap from "@/components/InteractiveMap.vue";
</script>

<template>
  <div class="home-container">
    <section>
      <h4>Map Admin</h4>
      <InteractiveMap/>
    </section>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Press Start 2P', 'Arial', monospace;
  padding: 32px 0;
}

section {
  width: 100%;
  max-width: 900px;
  margin-bottom: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.banner {
  width: 95vw;
  background: linear-gradient(90deg, #2d2d4d 0%, #4e1a3d 100%);
  color: #fff;
  padding: 24px 0;
  text-align: center;
  font-size: 2rem;
  letter-spacing: 2px;
  border-radius: 8px;
  box-shadow: 0 4px 16px #0008;
  margin-bottom: 32px;
}

h2.banner {
  font-size: 1.3rem;
  margin-top: 32px;
}

img {
  max-width: 100vw;
  margin: 24px 0;
  display: block;
}

p {
  font-size: 1.1rem;
  margin-bottom: 16px;
  text-align: center;
}


</style>