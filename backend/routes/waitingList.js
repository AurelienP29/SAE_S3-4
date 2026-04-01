const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Middleware pour récupérer la db
const getDb = (req, res, next) => {
    req.db = req.app.locals.db;
    if (!req.db) {
        return res.status(500).json({ error: 'Base de données non disponible' });
    }
    next();
};

router.use(getDb);

// GET /waitingList - Liste de toutes les demandes
router.get('/', async (req, res) => {
    try {
        const requests = await req.db.collection('waiting_list_prestataires').find({}).toArray();
        res.json({
            message: 'Liste des demandes',
            count: requests.length,
            waitingList: requests
        });
    } catch (error) {
        console.error('Erreur récupération waitingList:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// POST /waitingList - Ajouter une demande
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, category, description, services, requestDate, status } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Données manquantes', message: 'Le nom et l\'email sont requis' });
        }

        const newRequest = {
            name,
            email,
            phone: phone || '',
            category: category || 'boutique',
            description: description || '',
            services: services || [],
            requestDate: requestDate || new Date(),
            status: status || 'pending'
        };

        const result = await req.db.collection('waiting_list_prestataires').insertOne(newRequest);
        res.status(201).json({ message: 'Demande créée avec succès', request: { _id: result.insertedId, ...newRequest } });
    } catch (error) {
        console.error('Erreur création demande:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// DELETE /waitingList/:id - Supprimer une demande
router.delete('/:id', async (req, res) => {
    try {
        const result = await req.db.collection('waiting_list_prestataires').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Demande non trouvée' });
        }
        res.json({ message: 'Demande supprimée avec succès' });
    } catch (error) {
        console.error('Erreur suppression demande:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

module.exports = router;
