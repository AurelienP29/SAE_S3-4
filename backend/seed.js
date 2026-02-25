const mongoose = require('mongoose');
const {
    User,
    Prestataire,
    Prestation,
    Activity,
    Message,
    WaitingListPrestataire
} = require('./models');

const MONGO_URI = 'mongodb://localhost:27017/festival_db';

const rawUsers = [
    { id: 1, name: 'Admin User', email: 'admin@test.com', password: 'admin', role: 'admin', phone: '0123456789', description: 'Administrateur de la plateforme Necronomi\'con.', picture: '' },
    { id: 2, name: 'Prestataire User', email: 'prestataire@test.com', password: 'presta', role: 'prestataire', phone: '0765432109', description: 'Chef chez Ichiraku Ramen.', picture: 'avatar_url' },
    { id: 3, name: 'Visiteur User', email: 'visiteur@test.com', password: 'visi', role: 'visiteur', phone: '0611223344', description: 'Passionné de culture geek.', picture: 'avatar_url' },
    { id: 4, name: 'Rosmerta', email: 'contact@chaudron-baveur.wizard', password: 'rosm', role: 'prestataire', phone: '0699887766', description: 'Tenancière du Chaudron Baveur.' },
    { id: 5, name: 'RetroGaming Asso', email: 'asso@retrogaming-est.fr', password: 'retro', role: 'prestataire', phone: '0384000000', description: 'Association retro.' },
    { id: 6, name: 'MJ Antre', email: 'mj@antre-asso.com', password: 'mjmj', role: 'prestataire', phone: '0611223344', description: 'Maître de Jeu.' },
    { id: 7, name: 'Sales Goodies', email: 'sales@goodies-corp.com', password: 'good', role: 'prestataire', phone: '0144556677', description: 'Vendeur de produits.' },
    { id: 8, name: 'Help Cosplay', email: 'help@cosplay-sos.org', password: 'help', role: 'prestataire', phone: '0600110011', description: 'Aide cosplay.' },
    { id: 9, name: 'Master Jedi', email: 'master@jedi-order-fc.fr', password: 'jedi', role: 'prestataire', phone: '0655443322', description: 'Maître Jedi.' },
    { id: 10, name: 'Chloe Art', email: 'chloe.art@gmail.com', password: 'art', role: 'prestataire', phone: '0612341234', description: 'Illustratrice.' }
];

const rawPrestataires = [
    { id: 1, name: 'Le Chaudron Baveur', email: 'contact@chaudron-baveur.wizard', phone: '06 99 88 77 66', category: 'restauration', description: '<p>Bièraubeurre maison.</p>' },
    { id: 2, name: 'Ichiraku Ramen', email: 'prestataire@test.com', phone: '07 65 43 21 09', category: 'restauration', description: '<p>Ramen de Konoha.</p>' },
    { id: 5, name: 'RetroGaming Association', email: 'asso@retrogaming-est.fr', phone: '03 84 00 00 00', category: 'jeu_video', description: '<p>Classiques NES/SNES.</p>' },
    { id: 9, name: 'L\'Antre du Maître de Jeu', email: 'mj@antre-asso.com', phone: '06 11 22 33 44', category: 'jeu_plateau', description: '<p>Jeu de Rôle.</p>' },
    { id: 13, name: 'Goodies & Co.', email: 'sales@goodies-corp.com', phone: '01 44 55 66 77', category: 'boutique', description: '<p>Figurines Pop.</p>' },
    { id: 18, name: 'Cosplay SOS', email: 'help@cosplay-sos.org', phone: '06 00 11 00 11', category: 'atelier', description: '<p>Réparations urgence.</p>' },
    { id: 20, name: 'Initiation au Sabre Laser', email: 'master@jedi-order-fc.fr', phone: '06 55 44 33 22', category: 'atelier', description: '<p>Combat sabre laser.</p>' },
    { id: 22, name: 'Plumes & Dragons', email: 'chloe.art@gmail.com', phone: '06 12 34 12 34', category: 'artisan', description: '<p>Illustrations fantasy.</p>' }
];

const rawAvailability = [
    { name: 'Le Chaudron Baveur', jours: ['samedi', 'dimanche'] },
    { name: 'Ichiraku Ramen', jours: ['vendredi', 'samedi', 'dimanche'] },
    { name: 'RetroGaming Association', jours: ['samedi', 'dimanche'] },
    { name: 'L\'Antre du Maître de Jeu', jours: ['samedi', 'dimanche'] },
    { name: 'Goodies & Co.', jours: ['samedi', 'dimanche'] },
    { name: 'Cosplay SOS', jours: ['vendredi', 'samedi', 'dimanche'] },
    { name: 'Initiation au Sabre Laser', jours: ['samedi', 'dimanche'] },
    { name: 'Plumes & Dragons', jours: ['samedi'] }
];

const rawPrestations = [
    { id: 1, name: 'Le Chaudron Baveur', Champ1: 'Zone Food - F01', prestataireId: 1, category: 'restauration', description: '<p>Bièraubeurre maison.</p>' },
    { id: 2, name: 'Ichiraku Ramen', Champ1: 'Zone Food - F02', prestataireId: 2, category: 'restauration', description: '<p>Ramen de Konoha.</p>' },
    { id: 3, name: 'La Taverne du Nain', Champ1: 'Zone Food - F03', prestataireId: null, category: 'restauration', description: '<p>Plateaux charcuterie.</p>' },
    { id: 4, name: 'Bubble Tea K-Pop', Champ1: 'Zone Food - F04', prestataireId: null, category: 'restauration', description: '<p>Bubble teas.</p>' },
    { id: 5, name: 'RetroGaming Association', Champ1: 'Hall A - G01', prestataireId: 5, category: 'jeu_video', description: '<p>Arcade libre service.</p>' },
    { id: 6, name: 'VR Experience 9000', Champ1: 'Hall A - G05', prestataireId: null, category: 'jeu_video', description: '<p>Démonstration VR.</p>' },
    { id: 7, name: 'Smash Bros Tournament', Champ1: 'Scène Gaming', prestataireId: null, category: 'jeu_video', description: '<p>Tournoi SSBU.</p>' },
    { id: 8, name: 'Indie Dev Corner', Champ1: 'Hall A - G12', prestataireId: null, category: 'jeu_video', description: '<p>Indie devs.</p>' },
    { id: 9, name: 'L\'Antre du Maître de Jeu', Champ1: 'Hall B - T01', prestataireId: 9, category: 'jeu_plateau', description: '<p>Initiation JDR.</p>' },
    { id: 10, name: 'Warhammer Painting', Champ1: 'Hall B - T04', prestataireId: null, category: 'jeu_plateau', description: '<p>Atelier peinture.</p>' },
    { id: 11, name: 'Magic: The Gathering Area', Champ1: 'Hall B - T08', prestataireId: null, category: 'jeu_plateau', description: '<p>Drafts.</p>' },
    { id: 12, name: 'Ludothèque Géante', Champ1: 'Hall B - T10', prestataireId: null, category: 'jeu_plateau', description: '<p>Jeux libre accès.</p>' },
    { id: 13, name: 'Goodies & Co.', Champ1: 'Hall C - S01', prestataireId: 13, category: 'boutique', description: '<p>Figurines Pop.</p>' },
    { id: 18, name: 'Cosplay SOS', Champ1: 'Zone Cosplay', prestataireId: 18, category: 'atelier', description: '<p>Réparations.</p>' },
    { id: 20, name: 'Initiation au Sabre Laser', Champ1: 'Extérieur', prestataireId: 20, category: 'atelier', description: '<p>Combat.</p>' },
    { id: 22, name: 'Plumes & Dragons', Champ1: 'Artist Alley - A01', prestataireId: 22, category: 'artisan', description: '<p>Illustrations.</p>' }
];

const rawActivities = [
    { id: 1, titre: "Grand Tournoi Smash Bros (Team Fox)", places: 64, date: "Samedi 14h00" },
    { id: 2, titre: "Concours Cosplay - Défilé", places: 500, date: "Dimanche 15h00" },
    { id: 3, titre: "MasterClass Origami avec Kenji", places: 20, date: "Samedi 10h30" },
    { id: 4, titre: "Initiation Sabre Laser (Jedi Order)", places: 15, date: "Dimanche 11h00" },
    { id: 5, titre: "Atelier Peinture Warhammer", places: 12, date: "Samedi 16h00" },
    { id: 6, titre: "Draft Magic: The Gathering", places: 32, date: "Vendredi 20h00" },
    { id: 7, titre: "Atelier Doublage Anime", places: 10, date: "Dimanche 13h30" }
];

const rawMessages = [
    { message: 'Hello World', date: '2021-05-12', emeteur: 'adressemail@mail.com', sujet: 'Sujet du message', statut: 'a traiter' },
    { message: 'Bonjour', date: '2021-05-14', emeteur: 'adressemail@mail.com', sujet: 'Sujet du message', statut: 'traité' }
];

const rawWaitingList = [
    { id: 101, name: 'Atelier Forge', email: 'forge@dwarf.com', phone: '0600000001', category: 'atelier', description: 'Forge', services: ['animation_arcade'], requestDate: '2024-12-01' },
    { id: 102, name: 'Kebab Galactique', email: 'chef@spacekebab.com', phone: '0600000002', category: 'restauration', description: 'Kebab', services: ['restauration_chaude'], requestDate: '2024-12-05' }
];

function parseDate(str) {
    const now = new Date();
    let dayOffset = 0;
    if (str.toLowerCase().includes('dimanche')) dayOffset = 1;
    if (str.toLowerCase().includes('vendredi')) dayOffset = -1;

    const timePart = str.match(/(\d{1,2})h(\d{2})/);
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);

    if (timePart) {
        date.setHours(parseInt(timePart[1]), parseInt(timePart[2]), 0, 0);
    }
    return date;
}

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);

        await User.deleteMany({});
        await Prestataire.deleteMany({});
        await Prestation.deleteMany({});
        await Activity.deleteMany({});
        await Message.deleteMany({});
        await WaitingListPrestataire.deleteMany({});

        const userMap = {};

        for (const u of rawUsers) {
            const newUser = await User.create({
                name: u.name,
                email: u.email,
                password: u.password,
                role: u.role,
                phone: u.phone,
                description: u.description,
                picture_url: u.picture
            });
            userMap[u.email] = newUser._id;
        }

        const prestataireIdMap = {};

        for (const p of rawPrestataires) {
            const avail = rawAvailability.find(a => a.name === p.name);
            const days = avail ? avail.jours : [];

            const newPrestataire = await Prestataire.create({
                user_id: userMap[p.email],
                name: p.name,
                email: p.email,
                phone: p.phone,
                category: p.category,
                description: p.description,
                days_available: days,
                status: 'accepted'
            });
            prestataireIdMap[p.id] = newPrestataire._id;
        }

        const prestationMap = {};

        for (const p of rawPrestations) {
            const newPrestation = await Prestation.create({
                name: p.name,
                location_code: p.Champ1,
                provider_id: p.prestataireId ? prestataireIdMap[p.prestataireId] : null,
                category: p.category,
                description: p.description
            });

            prestationMap[p.id] = newPrestation._id;

            if (p.name.includes("Smash Bros")) prestationMap['smash'] = newPrestation._id;
            if (p.name.includes("Sabre Laser")) prestationMap['sabre'] = newPrestation._id;
            if (p.name.includes("Warhammer")) prestationMap['warhammer'] = newPrestation._id;
            if (p.name.includes("Magic")) prestationMap['magic'] = newPrestation._id;
            if (p.name.includes("Cosplay")) prestationMap['cosplay'] = newPrestation._id;
        }

        for (const a of rawActivities) {
            let pid = null;
            const t = a.titre.toLowerCase();
            if (t.includes('smash')) pid = prestationMap['smash'];
            else if (t.includes('sabre')) pid = prestationMap['sabre'];
            else if (t.includes('warhammer')) pid = prestationMap['warhammer'];
            else if (t.includes('magic')) pid = prestationMap['magic'];
            else if (t.includes('cosplay')) pid = prestationMap['cosplay'];

            await Activity.create({
                prestation_id: pid,
                title: a.titre,
                max_places: a.places,
                start_time: parseDate(a.date)
            });
        }

        for (const m of rawMessages) {
            await Message.create({
                sender_email: m.emeteur,
                subject: m.sujet,
                content: m.message,
                sent_date: new Date(m.date),
                status: m.statut
            });
        }

        for (const w of rawWaitingList) {
            await WaitingListPrestataire.create({
                name: w.name,
                email: w.email,
                phone: w.phone,
                category: w.category,
                description: w.description,
                services: w.services,
                request_date: new Date(w.requestDate),
                status: 'pending'
            });
        }

        console.log("Database seeded successfully.");
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        await mongoose.disconnect();
    }
}

seed();