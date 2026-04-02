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
/**
 * @swagger
 * /prestations:
 *   get:
 *     summary: Récupérer la liste des prestations
 *     tags: [Prestations]
 *     responses:
 *       200:
 *         description: Liste de toutes les prestations
 *       500:
 *         description: Erreur serveur
 */
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
/**
 * @swagger
 * /prestations/{id}:
 *   get:
 *     summary: Récupérer les détails d'une prestation
 *     tags: [Prestations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations sur la prestation
 *       404:
 *         description: Prestation non trouvée
 */
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
/**
 * @swagger
 * /prestations:
 *   post:
 *     summary: Créer une nouvelle prestation
 *     tags: [Prestations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, Champ1]
 *             properties:
 *               name:
 *                 type: string
 *               Champ1:
 *                 type: string
 *               prestataireId:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Prestation créée
 *       400:
 *         description: Données manquantes
 */
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
/**
 * @swagger
 * /prestations/{id}:
 *   put:
 *     summary: Mettre à jour une prestation
 *     tags: [Prestations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Prestation mise à jour
 *       404:
 *         description: Prestation non trouvée
 */
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
/**
 * @swagger
 * /prestations/{id}:
 *   delete:
 *     summary: Supprimer une prestation
 *     tags: [Prestations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prestation supprimée
 *       404:
 *         description: Prestation non trouvée
 */
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
