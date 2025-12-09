<script setup>
import { computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  duration: {
    type: String,
    default: '60s'
  }
});

</script>

<template>
  <div class="carousel-container surface-ground shadow-2 my-4">
    <div class="slider" :style="{ '--duration': props.duration }">

      <div class="slide-track">

        <div v-for="(item, index) in items" :key="'a-'+index" class="slide px-4">
          <a :href="item.link" target="_blank" rel="noopener" class="block">
            <img
                :src="item.src"
                :alt="item.alt || 'Partner logo'"
                class="partner-logo"
            />
          </a>
        </div>

        <div v-for="(item, index) in items" :key="'b-'+index" class="slide px-4">
          <a :href="item.link" target="_blank" rel="noopener" class="block">
            <img
                :src="item.src"
                :alt="item.alt || 'Partner logo'"
                class="partner-logo"
            />
          </a>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  width: 100%;
  padding: 1rem 0; /* Add vertical breathing room */
}

.slide-track {
  display: flex;
  width: max-content;
  align-items: center;
  animation: scroll var(--duration) linear infinite;
}

.slide-track:hover {
  animation-play-state: paused;
}

.slide {
  display: flex;
  align-items: center;
  justify-content: center;
}

.partner-logo {
  height: 120px; /* Logos height */
  width: auto;  /* Logos Width */
  max-width: 200px;
  object-fit: contain;
  filter: grayscale(100%); /* Optional: makes them uniform */
  opacity: 0.8;
  transition: all 0.3s ease;
  margin : 0 auto;
}

.partner-logo:hover {
  filter: grayscale(0%);
  opacity: 1;
  transform: scale(1.1);
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>