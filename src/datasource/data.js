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

export {
    message,
    providers
}