import {ref} from "vue";

let message = [
    {
        message: 'Hello World',
        date: '2021-05-12',
        emeteur: 'adressemail@mail.com',
        sujet: 'Sujet du message',
        statut: 'a traiter'
    },
    {
        message: 'Bonjour',
        date: '2021-05-14',
        emeteur: 'adressemail@mail.com',
        sujet: 'Sujet du message',
        statut: 'traité'
    }
]

let providers = [
    // --- RESTAURATION ---
    {
        nom: 'Mme. Rosmerta',
        mail: 'rosmerta@poudlard-express.com',
        boutique: 'Le Chaudron Baveur',
        typeBoutique: 'restauration',
        jours: ['samedi', 'dimanche'],
        service: 'Boissons et Snacks',
        statut: 'accepté'
    },
    {
        nom: 'Teuchi',
        mail: 'ramen-boss@konoha.jp',
        boutique: 'Ichiraku Ramen',
        typeBoutique: 'restauration',
        jours: ['vendredi', 'samedi', 'dimanche'],
        service: 'Restauration chaude',
        statut: 'accepté'
    },

    // --- BOUTIQUES ---
    {
        nom: 'Jean-Mi',
        mail: 'jm.goodies@wanadoo.fr',
        boutique: 'Goodies & Co.',
        typeBoutique: 'boutique',
        jours: ['samedi', 'dimanche'],
        service: 'Vente produits dérivés',
        statut: 'accepté'
    },
    {
        nom: 'M. Blade',
        mail: 'katana.spirit@forge.com',
        boutique: 'Katana Spirit',
        typeBoutique: 'boutique',
        jours: ['samedi', 'dimanche'],
        service: 'Vente répliques armes',
        statut: 'en attente' // En attente de validation sécurité
    },

    // --- ASSOCIATIONS & ANIMATIONS ---
    {
        nom: 'Marc D.',
        mail: 'contact@retrogaming-asso.fr',
        boutique: 'RetroGaming Association',
        typeBoutique: 'jeu_video',
        jours: ['samedi', 'dimanche'],
        service: 'Animation Arcade',
        statut: 'accepté'
    },
    {
        nom: 'Sarah C.',
        mail: 'vr.sarah@tech.com',
        boutique: 'VR Experience 9000',
        typeBoutique: 'jeu_video',
        jours: ['samedi'],
        service: 'Démonstration VR',
        statut: 'refusé' // Exemple de statut refusé
    },
    {
        nom: 'Marie C.',
        mail: 'marie.cosplay@sos.com',
        boutique: 'Cosplay SOS',
        typeBoutique: 'atelier',
        jours: ['vendredi', 'samedi', 'dimanche'],
        service: 'Réparation costumes',
        statut: 'accepté'
    }
];

let activities = [
    {
        id: 1,
        titre: "Grand Tournoi Smash Bros (Team Fox)",
        places: 64,
        date: "Samedi 14h00"
    },
    {
        id: 2,
        titre: "Concours Cosplay - Défilé",
        places: 500,
        date: "Dimanche 15h00"
    },
    {
        id: 3,
        titre: "MasterClass Origami avec Kenji",
        places: 20,
        date: "Samedi 10h30"
    },
    {
        id: 4,
        titre: "Initiation Sabre Laser (Jedi Order)",
        places: 15,
        date: "Dimanche 11h00"
    },
    {
        id: 5,
        titre: "Atelier Peinture Warhammer",
        places: 12,
        date: "Samedi 16h00"
    },
    {
        id: 6,
        titre: "Draft Magic: The Gathering",
        places: 32,
        date: "Vendredi 20h00"
    },
    {
        id: 7,
        titre: "Atelier Doublage Anime",
        places: 10,
        date: "Dimanche 13h30"
    }
];

let prestations = [
    // --- RESTAURATION (Food) ---
    {
        id: 1,
        name: 'Le Chaudron Baveur',
        Champ1: 'Zone Food - F01',
        prestataireId: 1,
        category: 'restauration',
        description: '<p>Bièraubeurre maison, jus de citrouille et snacks magiques inspirés des sorciers.</p>'
    },
    {
        id: 2,
        name: 'Ichiraku Ramen',
        Champ1: 'Zone Food - F02',
        prestataireId: 2,
        category: 'restauration',
        description: '<p>Les authentiques Ramen de Konoha. Miso, Porc ou Végétarien.</p>'
    },
    {
        id: 3,
        name: 'La Taverne du Nain',
        Champ1: 'Zone Food - F03',
        prestataireId: null,
        category: 'restauration',
        description: '<p>Plateaux de charcuterie, hydromel (sans alcool) et ambiance médiévale.</p>'
    },
    {
        id: 4,
        name: 'Bubble Tea K-Pop',
        Champ1: 'Zone Food - F04',
        prestataireId: null,
        category: 'restauration',
        description: '<p>Bubble teas colorés et mochis glacés.</p>'
    },

    // --- JEUX VIDÉO (Video Games) ---
    {
        id: 5,
        name: 'RetroGaming Association',
        Champ1: 'Hall A - G01',
        prestataireId: 5,
        category: 'jeu_video',
        description: '<p>Rejouez aux classiques : NES, SNES, Megadrive et bornes d\'arcade en libre service.</p>'
    },
    {
        id: 6,
        name: 'VR Experience 9000',
        Champ1: 'Hall A - G05',
        prestataireId: null,
        category: 'jeu_video',
        description: '<p>Démonstration de casques VR dernière génération. Beat Saber et simulateurs de vol.</p>'
    },
    {
        id: 7,
        name: 'Smash Bros Tournament',
        Champ1: 'Scène Gaming',
        prestataireId: null,
        category: 'jeu_video',
        description: '<p>Inscriptions pour le grand tournoi SSBU. Manettes Gamecube recommandées.</p>'
    },
    {
        id: 8,
        name: 'Indie Dev Corner',
        Champ1: 'Hall A - G12',
        prestataireId: null,
        category: 'jeu_video',
        description: '<p>Venez tester les productions des développeurs indépendants de la région.</p>'
    },

    // --- JEUX DE PLATEAU (Board Games/Tabletop) ---
    {
        id: 9,
        name: 'L\'Antre du Maître de Jeu',
        Champ1: 'Hall B - T01',
        prestataireId: 9,
        category: 'jeu_plateau',
        description: '<p>Initiation au Jeu de Rôle : D&D, Cthulhu et Pathfinder. Sessions de 1h.</p>'
    },
    {
        id: 10,
        name: 'Warhammer Painting',
        Champ1: 'Hall B - T04',
        prestataireId: null,
        category: 'jeu_plateau',
        description: '<p>Atelier de peinture de figurines. Repartez avec votre Space Marine peint !</p>'
    },
    {
        id: 11,
        name: 'Magic: The Gathering Area',
        Champ1: 'Hall B - T08',
        prestataireId: null,
        category: 'jeu_plateau',
        description: '<p>Drafts toute la journée et initiation gratuite avec des decks de bienvenue.</p>'
    },
    {
        id: 12,
        name: 'Ludothèque Géante',
        Champ1: 'Hall B - T10',
        prestataireId: null,
        category: 'jeu_plateau',
        description: '<p>Plus de 200 jeux de société en libre accès pour jouer entre amis.</p>'
    },

    // --- BOUTIQUE (Shops) ---
    {
        id: 13,
        name: 'Goodies & Co.',
        Champ1: 'Hall C - S01',
        prestataireId: 13,
        category: 'boutique',
        description: '<p>Figurines Pop, mugs, t-shirts et produits dérivés officiels.</p>'
    },
    {
        id: 18,
        name: 'Cosplay SOS',
        Champ1: 'Zone Cosplay',
        prestataireId: 18,
        category: 'atelier',
        description: '<p>Réparations d\'urgence pour cosplayers (colle, fil, épingles) et vestiaires.</p>'
    },
    {
        id: 20,
        name: 'Initiation au Sabre Laser',
        Champ1: 'Extérieur',
        prestataireId: 20,
        category: 'atelier',
        description: '<p>Chorégraphie de combat au sabre laser. (Prêt de matériel inclus).</p>'
    },
    {
        id: 22,
        name: 'Plumes & Dragons',
        Champ1: 'Artist Alley - A01',
        prestataireId: 22,
        category: 'artisan',
        description: '<p>Illustrations fantasy, marque-pages et commissions sur place.</p>'
    }
];

let initialPrestataires = [
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

let prestataires = [
    {
        id: 1,
        name: 'Le Chaudron Baveur',
        email: 'contact@chaudron-baveur.wizard',
        phone: '06 99 88 77 66',
        category: 'restauration',
        description: '<p>Bièraubeurre maison, jus de citrouille et snacks magiques.</p>'
    },
    {
        id: 2,
        name: 'Ichiraku Ramen',
        email: 'prestataire@test.com',
        phone: '07 65 43 21 09',
        category: 'restauration',
        description: '<p>Les authentiques Ramen de Konoha. Miso, Porc ou Végétarien.</p>'
    },
    {
        id: 5,
        name: 'RetroGaming Association',
        email: 'asso@retrogaming-est.fr',
        phone: '03 84 00 00 00',
        category: 'jeu_video',
        description: '<p>Rejouez aux classiques : NES, SNES, Megadrive et bornes d\'arcade.</p>'
    },
    {
        id: 9,
        name: 'L\'Antre du Maître de Jeu',
        email: 'mj@antre-asso.com',
        phone: '06 11 22 33 44',
        category: 'jeu_plateau',
        description: '<p>Initiation au Jeu de Rôle : D&D, Cthulhu et Pathfinder.</p>'
    },
    {
        id: 13,
        name: 'Goodies & Co.',
        email: 'sales@goodies-corp.com',
        phone: '01 44 55 66 77',
        category: 'boutique',
        description: '<p>Figurines Pop, mugs, t-shirts et produits dérivés officiels.</p>'
    },
    {
        id: 18,
        name: 'Cosplay SOS',
        email: 'help@cosplay-sos.org',
        phone: '06 00 11 00 11',
        category: 'atelier',
        description: '<p>Réparations d\'urgence pour cosplayers et vestiaires.</p>'
    },
    {
        id: 20,
        name: 'Initiation au Sabre Laser',
        email: 'master@jedi-order-fc.fr',
        phone: '06 55 44 33 22',
        category: 'atelier',
        description: '<p>Chorégraphie de combat au sabre laser.</p>'
    },
    {
        id: 22,
        name: 'Plumes & Dragons',
        email: 'chloe.art@gmail.com',
        phone: '06 12 34 12 34',
        category: 'artisan',
        description: '<p>Illustrations fantasy, marque-pages et commissions.</p>'
    }
];

let categoryOptions = [
    {label: 'Artisan', value: 'artisan'},
    {label: 'Atelier', value: 'atelier'},
    {label: 'Jeu vidéo', value: 'jeu_video'},
    {label: 'Jeu de Plateau', value: 'jeu_plateau'},
    {label: 'Boutique', value: 'boutique'},
    {label: 'Restauration', value: 'restauration'},
]

let serviceOptions = [
    {label: 'Boissons et snacks', value: 'boissons_snacks'},
    {label: 'Restauration chaude', value: 'restauration_chaude'},
    {label: 'Vente produits dérivés', value: 'vente_produits_derives'},
    {label: 'Vente répliques armes', value: 'vente_repliques_armes'},
    {label: 'Animation arcade', value: 'animation_arcade'},
    {label: 'Démonstration VR', value: 'demo_vr'},
    {label: 'Réparation costumes', value: 'reparation_costumes'},
]

const waitingList = ref([
    {
        id: 101,
        name: 'Atelier Forge',
        email: 'forge@dwarf.com',
        phone: '06 00 00 00 01',
        category: 'atelier',
        description: '<p>Atelier de forge pour débutants.</p>',
        services: ['animation_arcade', 'reparation_costumes'],
        requestDate: ' 2024-12-01'
    },
    {
        id: 102,
        name: 'Kebab Galactique',
        email: 'chef@spacekebab.com',
        phone: '06 00 00 00 02',
        category: 'restauration',
        description: '<p>Le meilleur kebab de la galaxie.</p>',
        services: ['restauration_chaude'],
        requestDate: ' 2024-12-05'
    },
    {
        id: 103,
        name: 'Studio PixelArt',
        email: 'contact@pixelart.studio',
        phone: '06 00 00 00 03',
        category: 'atelier',
        description: '<p>Initiation et perfectionnement au pixel art.</p>',
        services: ['animation_arcade'],
        requestDate: ' 2025-01-03'
    },
    {
        id: 104,
        name: 'Boulangerie du Dragon',
        email: 'dragon@bakery.com',
        phone: '06 00 00 00 04',
        category: 'restauration',
        description: '<p>Pains et pâtisseries cuits au feu de dragon.</p>',
        services: ['boissons_snacks', 'restauration_chaude'],
        requestDate: ' 2025-01-12'
    },
    {
        id: 105,
        name: 'Atelier Bois Magique',
        email: 'atelier@boismagique.fr',
        phone: '06 00 00 00 05',
        category: 'atelier',
        description: '<p>Travail du bois enchanté, sculptures et créations.</p>',
        services: ['vente_produits_derives'],
        requestDate: ' 2025-01-20'
    },
    {
        id: 106,
        name: 'Café des Etoiles',
        email: 'hello@cafestars.com',
        phone: '06 00 00 00 06',
        category: 'restauration',
        description: '<p>Café futuriste avec boissons interstellaires.</p>',
        services: ['boissons_snacks'],
        requestDate: ' 2025-02-02'
    },
    {
        id: 107,
        name: 'Atelier Couture Elfe',
        email: 'elfe@couture.com',
        phone: '06 00 00 00 07',
        category: 'atelier',
        description: '<p>Cours de couture spécialisés dans les tissus elfiques.</p>',
        services: ['reparation_costumes'],
        requestDate: ' 2025-02-15'
    }
]);


let prestationWaitingList = [
    {
        id: 201,
        name: 'Magic Wand Workshop',
        Champ1: 'Hall C - S05',
        prestataireId: 1,
        category: 'artisan',
        description: '<p>Apprenez à fabriquer votre propre baguette magique.</p>',
        requestDate: '2025-01-15'
    },
    {
        id: 202,
        name: 'Cyberpunk Ramen Bar',
        Champ1: 'Zone Food - F08',
        prestataireId: 2,
        category: 'restauration',
        description: '<p>Ramen futuristes avec néons comestibles.</p>',
        requestDate: '2025-01-20'
    }
];

export {
    message,
    providers,
    activities,
    prestations,
    initialPrestataires,
    prestataires,
    waitingList,
    prestationWaitingList,
    categoryOptions,
    serviceOptions,
}

export const users = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'admin',
        role: 'admin',
        roles: ['admin', 'organisateur'],
        phone: '0123456789',
        description: 'Administrateur de la plateforme Necronomi\'con.',
        picture: ''
    },
    {
        id: 2,
        name: 'Prestataire User',
        email: 'prestataire@test.com',
        password: 'presta',
        role: 'prestataire',
        roles: ['prestataire'],
        phone: '0765432109',
        description: 'Chef chez Ichiraku Ramen, spécialiste des nouilles de Konoha.',
        picture: 'https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png'
    },
    {
        id: 3,
        name: 'Visiteur User',
        email: 'visiteur@test.com',
        password: 'visi',
        role: 'visiteur',
        roles: ['visiteur'],
        phone: '0611223344',
        description: 'Passionné de culture geek et de cosplay.',
        picture: 'https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png'
    },
    {
        id: 4,
        name: 'Rosmerta',
        email: 'contact@chaudron-baveur.wizard',
        password: 'rosm',
        role: 'prestataire',
        roles: ['prestataire'],
        phone: '0699887766',
        description: 'Tenancière du Chaudron Baveur.'
    },
    {
        id: 5,
        name: 'RetroGaming Asso',
        email: 'asso@retrogaming-est.fr',
        password: 'retro',
        role: 'prestataire',
        roles: ['prestataire'],
        phone: '0384000000',
        description: 'Association de passionnés de jeux vidéo anciens.'
    },
    {
        id: 6,
        name: 'MJ Antre',
        email: 'mj@antre-asso.com',
        password: 'mjmj',
        role: 'prestataire',
        roles: ['prestataire'],
        phone: '0611223344',
        description: 'Maître de Jeu professionnel.'
    },
    {
        id: 7,
        name: 'Sales Goodies',
        email: 'sales@goodies-corp.com',
        password: 'good',
        role: 'prestataire',
        roles: ['prestataire'],
        phone: '0144556677',
        description: 'Vendeur de produits dérivés.'
    },
    {
        id: 8,
        name: 'Help Cosplay',
        email: 'help@cosplay-sos.org',
        password: 'help',
        role: 'prestataire',
        roles: ['prestataire'],
        phone: '0600110011',
        description: 'Service d\'aide au cosplay.'
    },
    {
        id: 9,
        name: 'Master Jedi',
        email: 'master@jedi-order-fc.fr',
        password: 'jedi',
        role: 'prestataire',
        roles: ['prestataire'],
        phone: '0655443322',
        description: 'Maître Jedi formateur.'
    },
    {
        id: 10,
        name: 'Chloe Art',
        email: 'chloe.art@gmail.com',
        password: 'art',
        role: 'prestataire',
        roles: ['prestataire'],
        phone: '0612341234',
        description: 'Illustratrice freelance.'
    }
]

export const mainPageTextPresentation = {
    fr: {
        banner: "Bienvenue à la Necronomi'con !",
        intro: "Venez découvrir notre évènement, son intérêt, ses moments forts !",
        description: "La Nécronomi’Con est une convention dédiée aux cultures de l’imaginaire, réunissant chaque année passionnés de science-fiction, de fantastique, d’horreur, de jeux vidéo et de jeux de rôle. Conçue comme un espace d’échange, de créativité et de célébration du geekverse, elle propose rencontres avec des auteurs et artistes, animations variées, conférences, ateliers et expositions, le tout dans une ambiance conviviale et immersive.",
        locationTitle: "Emplacement de l'évènement",
        mapTitle: "Map Visiteur",
        originTitle: "Origine de l’événement",
        originDescription: "La Nécronomi’Con a été créée dans l’initiative d’un groupe d'étudiant de l'IUT Nord Franche-Comté, passionnés, souhaitant dynamiser la scène geek du Nord Franche-Comté. Au fil des années, l’événement a grandi, s’est professionnalisé et a gagner l'attention d'un public de plus en plus large, devenant un événement incontournable pour la communauté geek régionale.",
        supportersTitle: "Nos partenaires"
    },
    en: {
        banner: "Welcome to Necronomi'con!",
        intro: "Come and discover our event, its purpose, and its highlights!",
        description: "Necronomi'Con is a convention dedicated to imaginary cultures, bringing together science fiction, fantasy, horror, video game and role-playing enthusiasts every year. Designed as a space for exchange, creativity and celebration of the geekverse, it offers meetings with authors and artists, varied activities, conferences, workshops and exhibitions, all in a friendly and immersive atmosphere.",
        locationTitle: "Event Location",
        mapTitle: "Visitor Map",
        originTitle: "Origins of the Event",
        originDescription: "Necronomi'Con was created on the initiative of a group of passionate students from IUT Nord Franche-Comté, wishing to boost the geek scene in Nord Franche-Comté. Over the years, the event has grown, professionalized and gained the attention of an increasingly large audience, becoming a key event for the regional geek community.",
        supportersTitle: "Our Partners"
    }
}