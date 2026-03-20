import { MongoClient , ObjectId} from 'mongodb';
import * as data from './datasource/data.mjs';
import bcrypt from 'bcryptjs';

const url = 'mongodb://localhost:27017';
const dbName = 'necronomicon_db';

async function seedDB() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log("✅ Connecté à MongoDB");
        const db = client.db(dbName);

        // 1. NETTOYAGE DES COLLECTIONS
        const collections = ['users', 'prestataires', 'prestations', 'activities', 'waiting_list', 'messages'];
        for (const col of collections) {
            await db.collection(col).deleteMany({});
        }

        // 2. INSERTION DES PRESTATAIRES (ET RÉCUPÉRATION DES IDS)
        // On crée une map pour lier l'ancien ID (ex: 1) au nouvel ObjectId MongoDB
        const prestataireIdMap = {};

        const cleanedPrestataires = data.prestataires.map(p => {
            const { id, ...rest } = p;
            return { ...rest, oldId: id }; // On garde temporairement l'ancien ID pour le mapping
        });

        const prestatairesResult = await db.collection('prestataires').insertMany(cleanedPrestataires);

        // On remplit la map : { "1": ObjectId("..."), "2": ObjectId("...") }
        Object.values(prestatairesResult.insertedIds).forEach((newId, index) => {
            const oldId = cleanedPrestataires[index].oldId;
            prestataireIdMap[oldId] = newId;
        });
        console.log("⭐ Prestataires insérés et IDs mappés.");

        // 3. INSERTION DES PRESTATIONS (AVEC MISE À JOUR DES LIENS)
        const cleanedPrestations = data.prestations.map(p => {
            const { id, prestataireId, ...rest } = p;
            return {
                ...rest,
                // On remplace l'ancien ID numérique par le véritable ObjectId de MongoDB
                prestataireId: prestataireId ? prestataireIdMap[prestataireId] : null
            };
        });
        await db.collection('prestations').insertMany(cleanedPrestations);
        console.log("⭐ Prestations liées aux prestataires et insérées.");

        // 4. INSERTION DU RESTE DES DONNÉES

        // Users
        const cleanedUsers = await Promise.all(data.users.map(async ({ id, password, ...rest }) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            return { ...rest, password: hashedPassword };
        }));
        await db.collection('users').insertMany(cleanedUsers);

        // Activities
        const cleanedActivities = data.activities.map(({ id, date, ...rest }) => ({
            ...rest,
            date: new Date(date)
        }));
        await db.collection('activities').insertMany(cleanedActivities);

        // Waiting List (Gestion du .value si c'est une ref Vue)
        const rawWaitingList = data.waitingList.value || data.waitingList;
        const cleanedWaitingList = rawWaitingList.map(({ id, ...rest }) => rest);
        await db.collection('waiting_list').insertMany(cleanedWaitingList);

        // Messages
        await db.collection('messages').insertMany(data.message);

        console.log("\n🚀 Migration terminée avec succès !");

    } catch (err) {
        console.error("❌ Erreur lors de la migration :", err);
    } finally {
        await client.close();
    }
}

seedDB();