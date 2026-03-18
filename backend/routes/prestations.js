const express = require('express');
const { findAllPrestations, findPrestationById, createPrestation, updatePrestationById, deletePrestationById } = require('../models/Prestation');

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

// GET /prestations - Liste de toutes les prestations
router.get('/', async (req, res) => {
    try {
        const prestations = await findAllPrestations(req.db);
        res.json({
            message: 'Liste des prestations',
            count: prestations.length,
            prestations: prestations
        });
    } catch (error) {
        console.error('Erreur récupération prestations:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// GET /prestations/:id - Détails d'une prestation
router.get('/:id', async (req, res) => {
    try {
        const prestation = await findPrestationById(req.db, req.params.id);
        if (!prestation) {
            return res.status(404).json({ error: 'Prestation non trouvé' });
        }
        res.json(prestation);
    } catch (error) {
        console.error('Erreur récupération prestation:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// POST /prestations - Création d'une prestation
router.post('/', async (req, res) => {
    try {
        const { name, Champ1, prestataireId, category, description } = req.body;

        if (!name || !Champ1) {
            return res.status(400).json({ error: 'Données manquantes', message: 'Le nom et la zone sont requis' });
        }

        const newPrestation = await createPrestation(req.db, { name, Champ1, prestataireId, category, description });
        res.status(201).json({ message: 'Prestation créé avec succès', prestation: newPrestation });
    } catch (error) {
        console.error('Erreur création prestation:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// PUT /prestations/:id - Mise à jour d'une prestation
router.put('/:id', async (req, res) => {
    try {
        const result = await updatePrestationById(req.db, req.params.id, req.body);
        
        let updatedPrestation = await findPrestationById(req.db, req.params.id);
        if (!updatedPrestation) {
            return res.status(404).json({ error: 'Prestation non trouvé' });
        }
        res.json({ message: 'Prestation mis à jour', prestation: updatedPrestation });
    } catch (error) {
        console.error('Erreur mise à jour prestation:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// DELETE /prestations/:id - Suppression d'une prestation
router.delete('/:id', async (req, res) => {
    try {
        const result = await deletePrestationById(req.db, req.params.id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Prestation non trouvé' });
        }
        res.json({ message: 'Prestation supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression prestation:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

module.exports = router;
