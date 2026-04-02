const express = require('express');
const { getSettings, updateSettings } = require('../models/SiteSettings');
const { authenticateToken, isAdmin } = require('../middleware/auth');

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

// GET /settings - Récupérer les paramètres du site (public)
router.get('/', async (req, res) => {
    try {
        const settings = await getSettings(req.db);
        res.json(settings);
    } catch (error) {
        console.error('Erreur récupération paramètres:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// PUT /settings - Mettre à jour les paramètres du site (admin uniquement)
router.put('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await updateSettings(req.db, req.body);
        
        // Suivant la version du driver, le document peut être dans result.value
        const updatedSettings = result.value || await getSettings(req.db);
        
        res.json({ message: 'Paramètres mis à jour avec succès', settings: updatedSettings });
    } catch (error) {
        console.error('Erreur mise à jour paramètres:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

module.exports = router;
