<template>
  <div class="contact-form-container">
    <h2> {{t('title')}}</h2>
    <form @submit.prevent="handleSubmit" class="contact-form" id="form_contact">
      <div class="form-group">
        <div class="label-input-wrapper">
          <label for="name"> {{ t('name')}}</label>
          <input type="text" v-model="formData.name" required >
        </div>
        <span class="error" :class="{active: errors.nameError}"> {{t('nameError')}}</span>
      </div>

      <div class="form-group">
        <div class="label-input-wrapper">
          <label for="email">{{t('email')}}</label>
          <input type="email" v-model="formData.email" required >
          <span class="error" :class="{active: errors.emailError}"> {{t('emailError')}}</span>
        </div>
      </div>

      <div class="form-group">
        <div class="label-input-wrapper">
          <label for="subject">{{t('subject')}}</label>
          <input type="text" v-model="formData.subject" required>
          <span class="error" :class="{active: errors.subjectError}"> {{t('subjectError')}}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="message">{{t('message')}}</label>
        <span class="error" :class="{active: errors.messageError}"> {{t('messageError')}}</span>
        <textarea v-model="formData.message" rows="5" required ></textarea>
      </div>

      <button type="button" class="submit-button" @click="validateAndSend">{{t('submit')}}</button>

      <p class="required-note">{{t('required')}}</p>
    </form>
  </div>
</template>

<style scoped>
.contact-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group input[type="email"]{
  width: 100%;
  padding: 0.6rem 0.7rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color .2s, box-shadow .2s;
}

.form-group input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, .25);
  outline: none;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  gap: 10px;
}

.form-group textarea {
  width: 100%;
  padding: 0.6rem 0.7rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color .2s, box-shadow .2s;
}

.label-input-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
}

.label-input-wrapper label {
  font-weight: bold;
  min-width: 100px;
  text-align: right;
}

.label-input-wrapper input {
  flex-grow: 1;
}


.contact-form-container label {
  font-size: 0.9rem;
  font-weight: 600;
}

.contact-form {
  max-width: 600px;
  width: 100%;
}

/* ----- RESPONSIVE ----- */
@media (max-width: 800px) {
  .contact-form-container {
    grid-template-columns: 1fr;
  }
}

/* ----- ERROR MESSAGES ----- */
.error {
  font-size: 0.85rem;
  color: white;
  background: #b00020;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  visibility: hidden;
  min-height: 1.2rem;
  height: auto;
  display: flex;
  align-items: center;
  white-space: normal;
}

.error.active {
  visibility: visible;
}


</style>

<script setup>
import { ref, reactive } from 'vue';
import emailjs from '@emailjs/browser';
import {useAuthStore} from "@/stores/authStore.js";

const formData = reactive({
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
    nameError: "Veuillez entrer votre nom complet",
    emailError: "Veuillez entrer une adresse email valide",
    subjectError: "Veuillez entrer un sujet",
    messageError: "Veuillez entrer un message",
    msg_content: "Nous avons bien reçu votre question à propos de ",
    msg_content2: ". Nous vous répondrons le plus rapidement possible.",
    msg_salutation: "Bonjour",
    msg_signature: "L'équipe Necronomi'con",
  } ,
  en:{
    title: "Contact Us",
    submit: "Submit",
    name: "Name *",
    email: "Email *",
    subject: "Subject *",
    message: "Message *",
    required: "* Required fields",
    nameError: "Please enter your full name",
    emailError: "Please enter a valid email address",
    subjectError: "Please enter a subject",
    messageError: "Please enter a message",
    msg_content: "We have received your question about ",
    msg_content2: ". We will reply as soon as possible.",
    msg_salutation: "Dear",
    msg_signature: "The Necronomi'con Team",
  }
}


const authStore = useAuthStore()

/* Traduction dynamique */
const t = (key) => {
  return translation[authStore.currentLanguage]?.[key] || translation.fr[key]
}

const errors = reactive({
  nameError: false,
  emailError: false,
  subjectError: false,
  messageError: false,
})

function validateAndSend() {
  let isValid = true;
  Object.keys(errors).forEach(key=>errors[key] = false);

  if (!formData.name) {
    errors.nameError = true;
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.emailError = true;
    isValid = false;
  }

  if (!formData.subject){
    errors.subjectError = true;
    isValid = false;
  }

  if (!formData.message){
    errors.messageError = true;
    isValid = false;
  }

  if (isValid) {
    console.log("valider le formulaire");
    handleSubmit();
  }

}



async function handleSubmit() {
  console.log("envoyer le formulaire : " + formData.name + " " + formData.email + " " + formData.subject + " " + formData.message);
  /* Les données pour le mail */
  const templateData = {
    salutation: t('msg_salutation'),
    name: formData.name,
    email: formData.email,
    msg_content: t('msg_content') + formData.subject + t('msg_content2'),
    signature: t('msg_signature')
  }

  emailjs.send('service_2zpxqyi', 'template_hkdszbd' , templateData)
      .then(message => {
        console.log('SUCCESS!', message.text);
      }, (err) => {
        console.log('FAILED...', err);
      })

  //envoyer le message et le sujet aux admins - data.mjs
}

</script>