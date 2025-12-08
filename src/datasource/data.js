import {ref} from "vue";

let message = [
    { message: 'Hello World' , date: '2021-05-12' , emeteur: 'adressemail@mail.com' , sujet: 'Sujet du message' , statut: 'a traiter'},
    { message: 'Bonjour', date: '2021-05-14' , emeteur: 'adressemail@mail.com' , sujet: 'Sujet du message' , statut: 'traité'}
]

let providers=[
    {nom:'provider1', mail: 'mail.com' , boutique:'boutique1' , typeBoutique:'cosplay' , jours: ['samedi','dimanche'] , service:'cosplay' , statut:'accepté'},
    {nom: 'provider2' , mail: 'unamil.com' ,boutique: 'uneBoutique' , typeBoutique: 'food' , jours: ['vendredi','samedi','dimanche'], services:'clickncollect' , statut: 'en attente'}
]

let activities = [
    {id: 1, titre: "Concours Cosplay", places: 50, date: "Samedi 14h" },
]

let prestations = [
    {
        id: 1,
        name: 'Prestataire Exemple 1',
        Champ1: 'A1',
        Champ2: 'B1',
        category: 'atelier',
        description: '<p>Spécialiste atelier et lumière.</p>'
    },
    {
        id: 2,
        name: 'Prestataire Exemple 2',
        Champ1: 'A2',
        Champ2: 'B2',
        category: 'restauration',
        description: '<p>Service traiteur haut de gamme.</p>'
    }
]

let prestataires = [
    {
        id: 1,
        name: 'Prestataire Exemple 1',
        email: 'contact1@exemple.com',
        phone: '0102030405',
        category: 'atelier',
        description: '<p>Spécialiste atelier et lumière.</p>'
    },
    {
        id: 2,
        name: 'Prestataire Exemple 2',
        email: 'contact2@exemple.com',
        phone: '0607080910',
        category: 'restauration',
        description: '<p>Service traiteur haut de gamme.</p>'
    }
]

let categoryOptions = [
    { label: 'Atelier', value: 'atelier' },
    { label: 'Restauration', value: 'restauration' },
]

export {
    users,
    message,
    providers,
    prestations,
    prestataires,
    categoryOptions
}

const users = [
  {
    id: 1,
    name: 'Admin Organisateur',
    email: 'admin@test.com',
    password: 'password123',
    role: 'organisateur',
    roles: ['organisateur', 'visiteur']
  },
  {
    id: 2,
    name: 'Prestataire Demo',
    email: 'prestataire@test.com',
    password: 'password123',
    role: 'prestataire',
    roles: ['prestataire', 'visiteur']
  },
  {
    id: 3,
    name: 'Visiteur Lambda',
    email: 'user@test.com',
    password: 'password123',
    role: 'visiteur',
    roles: ['visiteur']
  }
];