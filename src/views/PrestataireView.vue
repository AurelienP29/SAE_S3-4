<template>
  <div class="prestataire-container">
    <div class="flex-entete">
      <div class="flex-entete-case">
        <p>IDENTITE</p>
      </div>
      <div class="flex-entete-case">
        <p>AGENDA</p>
      </div>
      <div class="flex-entete-case">
        <p>SERVICES</p>
      </div>
      <div class="flex-entete-case">
        <p>PRESENTATION</p>
      </div>
    </div>

    <div class="flex-presentation">
      <div class="flex-presentation-photo">
      <img src="/public/images/loremipsum.jpg" alt="lorem ipsum tout ça tout ça"></img>
      </div>
      <div class="flex-presentation-texte">Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio quae ex corporis nobis ducimus! Velit voluptatum soluta minima deserunt assumenda esse, quidem necessitatibus eum, corporis fuga omnis, animi tempora alias.</div>
    </div>


    <div class="flex-agenda">
      <div class="flex-agenda-titre">
      <h2>AGENDA :</h2>
      </div>
      <div class="flex-agenda-texte">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur aliquid totam, delectus esse ab, veniam quos suscipit consectetur voluptates quam officiis mollitia laborum voluptas animi, sit facilis accusamus. Nobis, consectetur</p>
    </div>
    </div>

    <div class="flex-presentationservices">
      <div class="flex-presentationservices-titre">
      <h2>Services :</h2>
      </div>
      <div class="flex-presentationservices-texte">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo quibusdam cupiditate quos nihil nostrum vero ipsum praesentium eaque. Ullam tempore dolorem, expedita doloribus illo laborum perspiciatis possimus laudantium blanditiis quo.</p>
    </div>
    </div>


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

<style>
.prestataire-container{
  font-family: 'Press Start 2P';
}

.flex-entete {
  display: flex;
  /*flex-direction:row;*/
  justify-content: space-around; /* Aligne les éléments avec un espace égal */
  align-items: center; /* Centre les éléments verticalement */
  /*gap: 5px; /* Ajoute un espace entre les éléments */
  background-color: #b6d8f2;
  padding : 15px;
  margin: 5px 15px 25px 15px;
  border-radius: 10px;
}

.flex-entete-case{
  background-color: #f4cfdf;
  border-radius: 10px;
  margin: 5px;
  padding: 4px 13px
}

.flex-presentation{
  display:flex;
  margin: 50px;
}
.flex-presentation-photo img{
  width: 270px;
}
.flex-presentation-texte{
  display: flex;
  margin: 50px;
  align-items: center;
  text-align: justify;
}

.flex-agenda{
  display: flex;
  justify-content: space-between;
  margin: 150px 90px 5px 160px;
}
.flex-agenda-texte{
  display: flex;
  margin:5px 150px 5px 150px;
  text-align: justify;
}
.flex-agenda-titre{
  display:flex;
  width: 1000px;
}

.flex-presentationservices{
  display: flex;
  justify-content: space-between;
  margin: 150px 90px 200px 160px;
}
.flex-presentationservices-titre{
  display: flex;
  width: 1000px;
}
.flex-presentationservices-texte{
  display: flex;
  margin:5px 150px 5px 150px;
  text-align: justify;
}
</style>