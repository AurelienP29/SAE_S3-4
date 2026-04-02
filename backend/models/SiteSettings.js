const { ObjectId } = require('mongodb');

/**
 * Récupère les paramètres du site. 
 * Crée un document par défaut s'il n'existe pas.
 */
async function getSettings(db) {
  let settings = await db.collection('site_settings').findOne({});
  
  if (!settings) {
    // Paramètres par défaut basés sur data.mjs
    const defaultSettings = {
      homeTexts: {
        banner: "Bienvenue à la Necronomi'con !",
        intro: "Venez découvrir notre évènement, son intérêt, ses moments forts !",
        description: "La Nécronomi’Con est une convention dédiée aux cultures de l’imaginaire, réunissant chaque année passionnés de science-fiction, de fantastique, d’horreur, de jeux vidéo et de jeux de rôle. Conçue comme un espace d’échange, de créativité et de célébration du geekverse, elle propose rencontres avec des auteurs et artistes, animations variées, conférences, ateliers et expositions, le tout dans une ambiance conviviale et immersive.",
        locationTitle: "Emplacement de l'évènement",
        mapTitle: "Map Visiteur",
        originTitle: "Origine de l’événement",
        originDescription: "La Nécronomi’Con a été créée dans l’initiative d’un groupe d'étudiant de l'IUT Nord Franche-Comté, passionnés, souhaitant dynamiser la scène geek du Nord Franche-Comté. Au fil des années, l’événement a grandi, s’est professionnalisé et a gagner l'attention d'un public de plus en plus large, devenant un événement incontournable pour la communauté geek régionale.",
        supportersTitle: "Nos partenaires"
      },
      fonts: {
        primary: "'Press Start 2P', cursive",
        secondary: "'Rajdhani', sans-serif"
      },
      images: {
        heroBackground: "/src/assets/images/homeView/conPic2.jpg",
        bannerImage: "/public/images/home-banner.jpg"
      }
    };
    const result = await db.collection('site_settings').insertOne(defaultSettings);
    settings = { _id: result.insertedId, ...defaultSettings };
  }
  
  return settings;
}

/**
 * Met à jour les paramètres du site.
 */
async function updateSettings(db, updateData) {
  const { _id, ...safeData } = updateData;
  const result = await db.collection('site_settings').findOneAndUpdate(
    {}, // On met à jour le premier (et seul) document
    { $set: safeData },
    { returnDocument: 'after', upsert: true }
  );
  return result;
}

module.exports = {
  getSettings,
  updateSettings
};
