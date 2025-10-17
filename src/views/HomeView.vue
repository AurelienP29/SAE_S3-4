<template>
  <div class="home-container">
    <section>
      <h1 class="banner">Bienvenue à la Necronomi'con !</h1>
      <p>Venez découvrir notre évènement, son intérêt, ses moments forts !</p>
      <img src="/public/images/N-con-Logo-image.png" alt="Logo necro">
    </section>

    <section>
      <h2 class="banner">Emplacement de l'évènement</h2>
      <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2690.089298896684!2d6.8599186124863225!3d47.604953271069576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47923e1b276a30bb%3A0x2104ccadfe33b055!2sL&#39;%20AtraXion%20-%20Parc%20des%20Expositions%20de%20Belfort%20-%20H%C3%A9ricourt%20-%20Montb%C3%A9liard!5e0!3m2!1sfr!2sfr!4v1760515696559!5m2!1sfr!2sfr"
          width="900" height="400" style="border:0;" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      <InteractiveMap :editable="false" />
    </section>

    <section>
      <h2 class="banner">Liste des prestataire</h2>
      <p>prestataire test :<router-link to='prestataire'> click ici</router-link> </p>
      <!-- TODO liste des prestataires avec fonction de recherche -->
    </section>

  </div>
</template>

<script>
import InteractiveMap from '@/components/InteractiveMap.vue'

export default {
  name: 'HomeView',
  components: {InteractiveMap}
}
</script>

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