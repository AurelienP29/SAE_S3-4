<template>
  <div class="home-container">
    <section>
      <h1 class="banner">Bienvenue à la Necronomi'con !</h1>
      <p>Venez découvrir notre évènement, son intérêt, ses moments forts !</p>
      <img src="/public/images/home-banner.jpg" alt="Banner Necronomi'con" style="width: 300%; height: auto;">
    </section>

    <div class="text-container">
      <p>La Nécronomi’Con est une convention dédiée aux cultures de l’imaginaire, réunissant
        chaque année passionnés de science-fiction, de fantastique, d’horreur, de jeux vidéo et de jeux de rôle. Conçue
        comme un espace d’échange, de créativité et de célébration du geekverse, elle propose rencontres avec des
        auteurs et artistes, animations variées, conférences, ateliers et expositions, le tout dans une ambiance
        conviviale et immersive.</p>
    </div>


    <section>
      <h2 class="banner">Emplacement de l'évènement</h2>
      <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2690.089298896684!2d6.8599186124863225!3d47.604953271069576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47923e1b276a30bb%3A0x2104ccadfe33b055!2sL&#39;%20AtraXion%20-%20Parc%20des%20Expositions%20de%20Belfort%20-%20H%C3%A9ricourt%20-%20Montb%C3%A9liard!5e0!3m2!1sfr!2sfr!4v1760515696559!5m2!1sfr!2sfr"
          width="900" height="400" style="border:0;" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      <InteractiveMap :editable="false"/>
    </section>

    <div class="text-container">
      <h2 class="banner">Origine de l’événement</h2>
      La Nécronomi’Con a été créée dans l’initiative d’un groupe d'étudiant de l'IUT Nord Franche-Comté, passionnés,
      souhaitant dynamiser la scène geek
      du Nord Franche-Comté. qAu fil des années, l’événement a grandi, s’est professionnalisé et a gagner l'attention
      d'un public de
      plus en plus large, devenant un événement incontournable pour la communauté geek régionale.
      <!--      <div>-->
      <!--        <h3>Le président de convention: Stéphane Laurent</h3>-->
      <!--        À la tête de l’organisation se trouve Stéphane Laurent, président de l’association porteuse de la Nécronomi’Con.-->
      <!--        Passionné de cultures de l’imaginaire et engagé de longue date dans la promotion des initiatives culturelles-->
      <!--        locales, il a largement contribué à structurer et développer la convention. Son approche alliant sérieux,-->
      <!--        créativité et ouverture aux acteurs locaux a permis à l’événement de s’affirmer et de gagner en visibilité. Sous-->
      <!--        sa présidence, la Nécronomi’Con s’est transformée en un rendez-vous majeur pour les fans comme pour les-->
      <!--        professionnels.-->
      <!--      </div>-->
    </div>

    <!--    <section>-->
    <!--      <h2 class="banner">Liste des prestataire</h2>-->
    <!--      <p>prestataire test :-->
    <!--        <router-link to='prestataire'> click ici</router-link>-->
    <!--      </p>-->
    <!--      -->
    <!--      &lt;!&ndash; TODO liste des prestataires avec fonction de recherche &ndash;&gt;-->
    <!--    </section>-->

  </div>

  <!--- TODO: Problème source des images / liens -->
  <div class="partenaires">

    <h2>Nos partenaires</h2>

    <div class="partn-content">
      <a href="https://web.archive.org/web/20230427173206/https://www.dagoma3d.com/" target="_blank" rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/03/dagoma-baseline.png"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy"
            srcset="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/03/dagoma-baseline.png 9203w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/03/dagoma-baseline-250x71.png 250w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/03/dagoma-baseline-700x198.png 700w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/03/dagoma-baseline-768x217.png 768w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/03/dagoma-baseline-1536x434.png 1536w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/03/dagoma-baseline-2048x578.png 2048w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/03/dagoma-baseline-120x34.png 120w"
            sizes="(max-width: 9203px) 100vw, 9203px"> </a>
      <a href="https://web.archive.org/web/20230427173206/https://cybersecurite.trinaps.com/" target="_blank"
         rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/02/Trinaps_logo_RVB_transparent_500px.png"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy"
            srcset="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/02/Trinaps_logo_RVB_transparent_500px.png 500w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/02/Trinaps_logo_RVB_transparent_500px-250x75.png 250w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/02/Trinaps_logo_RVB_transparent_500px-120x36.png 120w"
            sizes="(max-width: 500px) 100vw, 500px"> </a>
      <a href="https://web.archive.org/web/20230427173206/https://www.europe2.fr/" target="_blank" rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/02/Europe_2_2023_-.svg_.png"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy"
            srcset="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/02/Europe_2_2023_-.svg_.png 1200w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/02/Europe_2_2023_-.svg_-250x122.png 250w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/02/Europe_2_2023_-.svg_-700x341.png 700w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/02/Europe_2_2023_-.svg_-768x374.png 768w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2023/02/Europe_2_2023_-.svg_-120x58.png 120w"
            sizes="(max-width: 1200px) 100vw, 1200px"> </a>
      <a href="https://web.archive.org/web/20230427173206/https://www.belfort.fr/" target="_blank" rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2019/12/vdf3.png"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy"
            srcset="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2019/12/vdf3.png 200w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2019/12/vdf3-120x72.png 120w"
            sizes="(max-width: 200px) 100vw, 200px"> </a>
      <a href="https://web.archive.org/web/20230427173206/https://www.territoiredebelfort.fr/" target="_blank"
         rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2019/12/cd90.png"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy"
            srcset="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2019/12/cd90.png 200w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2019/12/cd90-120x90.png 120w"
            sizes="(max-width: 200px) 100vw, 200px"> </a>
      <a href="https://web.archive.org/web/20230427173206/http://www.univ-fcomte.fr/" target="_blank" rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/11/ufc-ok.png"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy"
            srcset="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/11/ufc-ok.png 250w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/11/ufc-ok-120x72.png 120w"
            sizes="(max-width: 250px) 100vw, 250px"> </a>
      <a href="https://web.archive.org/web/20230427173206/http://www.iut-bm.univ-fcomte.fr/" target="_blank"
         rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/01/IUTBM.png"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy"
            srcset="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/01/IUTBM.png 250w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/01/IUTBM-120x72.png 120w"
            sizes="(max-width: 250px) 100vw, 250px"> </a>
      <a href="https://web.archive.org/web/20230427173206/http://www.lpmosel.fr/" target="_blank" rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/01/LPMOSEL.png"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy"
            srcset="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/01/LPMOSEL.png 250w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/01/LPMOSEL-120x72.png 120w"
            sizes="(max-width: 250px) 100vw, 250px"> </a>
      <a href="https://web.archive.org/web/20230427173206/http://www.ijbelfort.jeunes-fc.com/" target="_blank"
         rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2017/09/AvantagesJeunes.jpg"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy"
            srcset="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2017/09/AvantagesJeunes.jpg 250w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2017/09/AvantagesJeunes-120x72.jpg 120w"
            sizes="(max-width: 250px) 100vw, 250px"> </a>
      <a href="https://web.archive.org/web/20230427173206/https://letrois.info/" target="_blank" rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2019/07/letrois-e1562845802515.png"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy">
      </a>
      <a href="https://web.archive.org/web/20230427173206/http://www.alaconquetedelest.fr/" target="_blank"
         rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2017/09/Conquetedelest.jpg"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy"
            srcset="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2017/09/Conquetedelest.jpg 250w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2017/09/Conquetedelest-120x72.jpg 120w"
            sizes="(max-width: 250px) 100vw, 250px"> </a>
      <a href="https://web.archive.org/web/20230427173206/http://latraxion.com/" target="_blank" rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2017/09/Atraxion-e1575534618439.jpg"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy">
      </a>
      <a href="https://web.archive.org/web/20230427173206/http://www.tnt-events.fr/" target="_blank" rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2017/09/TNT.jpg"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy"
            srcset="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2017/09/TNT.jpg 250w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2017/09/TNT-120x72.jpg 120w"
            sizes="(max-width: 250px) 100vw, 250px"> </a>
      <a href="https://web.archive.org/web/20230427173206/https://www.creditmutuel.fr/home/index.html" target="_blank"
         rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2017/09/CreditMutuel.jpg"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy"
            srcset="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2017/09/CreditMutuel.jpg 250w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2017/09/CreditMutuel-120x72.jpg 120w"
            sizes="(max-width: 250px) 100vw, 250px"> </a>
      <a href="https://web.archive.org/web/20230427173206/http://www.cfcosplay.com/" target="_blank" rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/09/cfc-2-e1575534693739.png"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy">
      </a>
      <a href="https://web.archive.org/web/20230427173206/https://wilout.com/" target="_blank" rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/12/wilout-necro.png"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy"
            srcset="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/12/wilout-necro.png 250w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/12/wilout-necro-120x72.png 120w"
            sizes="(max-width: 250px) 100vw, 250px"> </a>
      <a href="https://web.archive.org/web/20230427173206/https://fcbs.fr/" target="_blank" rel="noopener">
        <img
            src="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/11/fcbs-ok2.png"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy"
            srcset="https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/11/fcbs-ok2.png 250w, https://web.archive.org/web/20230427173206im_/https://www.necronomi-con.com/wp-content/uploads/2018/11/fcbs-ok2-120x72.png 120w"
            sizes="(max-width: 250px) 100vw, 250px"> </a>
    </div>
    <div class="clear"></div>
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

/*************************************************************************************Text Container****************************************************************************/
.text-container {
  font-family: Arial;
  font-size: 1.5rem;
  width: 100%;
  max-width: 1750px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/*Partenaires*/
div.partenaires {
  padding: 3vw 0;
  background: white;
  align-content: center;
}

div.partenaires .partn-content {
  width: 80vw;
  margin-top: 1.3vw;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-wrap: wrap;
}

div.partenaires .partn-content a {
  width: 11.5%;
  margin-right: 1%;
}

div.partenaires .partn-content a img {
  width: 100%;
}

div.partenaires h2 {
  text-align: center;
}


/* RESPONSIVE */
@media (max-width: 1170px) {
}

@media (max-width: 910px) {
  div.content p {
    font-size: 18px;
  }

  .slider {
    display: none;
  }

  div#to-the-top {
    font-size: 8vw;
    padding: 2vw;
  }

  .actu div {
    width: 100%;
    padding-top: 50%; /* Maintient un ratio d'aspect 1:1 sur les petits écrans */
  }

  .actu div a {
    font-size: 5vw;
    padding: 2vw;
  }

  .actu div:first-child {
    width: 100%;
    padding-top: 50%;
  }

  .actu div a span.category {
    font-size: 4vw;
  }

  div.blocs-btn {
    display: none;
  }

  .newsletter .nl-content p {
    font-size: 3vw;
    margin-top: 4vw;
  }

  .newsletter .nl-content p label {
    font-size: 6vw;
  }

  .newsletter .nl-content p input[type=email] {
    width: 40vw;
  }

  .newsletter h2, .partenaires h2 {
    font-size: 5vw;
  }

  div.partenaires .partn-content a {
    width: 24%;
  }

}

@media (max-width: 530px) {
  div.partenaires .partn-content a {
    width: 32.33%;
  }

  .actu div {
    width: 100%;
    height: 100%;
    object-position: center;
  }
}


</style>