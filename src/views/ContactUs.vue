<script setup>
import { ref, reactive } from 'vue';
import emailjs from '@emailjs/browser';

const visible = ref(false);

// Déclaration des données du formulaire
const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const translation = {
  fr:{
    title: "Contactez-nous",
    submit: "Envoyer",
    name: "Nom complet *",
    email: "Adresse email *",
    subject: "Sujet *",
    message: "Votre message *",
    required: "* Champs obligatoires",
  } ,
  en:{
    title: "Contact Us",
    submit: "Submit",
    name: "Name *",
    email: "Email *",
    subject: "Subject *",
    message: "Message *",
    required: "* Required fields",
  }
}

/* Les données pour le mail */
const templateData = {

}

</script>

<template>
  <div class="contact-form-container">
    <h2>Contactez-nous</h2>
    <form @submit.prevent="handleSubmit" class="contact-form" id="formData">
      <div class="form-group">
        <label for="name"> {{ translation(name)}}</label>
        <input type="text" id="name" v-model="formData.name" required >
      </div>

      <div class="form-group">
        <label for="email">Adresse email *</label>
        <input type="email" id="email" v-model="formData.email" required >
      </div>

      <div class="form-group">
        <label for="subject">Sujet</label>
        <input type="text" id="subject" v-model="formData.subject" required>
      </div>

      <div class="form-group">
        <label for="message">Votre message *</label>
        <textarea id="message" v-model="formData.message" rows="5" required ></textarea>
      </div>

      <button type="submit" class="submit-button" text>

      </button>

      <p class="required-note">* Champs obligatoires</p>
    </form>
  </div>
</template>

<style scoped>

</style>