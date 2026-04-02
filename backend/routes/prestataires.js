const express = require('express');
const { findAllPrestataires, findPrestataireById, createPrestataire, updatePrestataireById, deletePrestataireById } = require('../models/Prestataire');

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

// GET /prestataires - Liste de tous les prestataires
/**
 * @swagger
 * /prestataires:
 *   get:
 *     summary: Récupérer la liste des prestataires
 *     tags: [Prestataires]
 *     responses:
 *       200:
 *         description: Liste de tous les prestataires enregistrés
 *       500:
 *         description: Erreur serveur
 */
router.get('/', async (req, res) => {
    try {
        const prestataires = await findAllPrestataires(req.db);
        res.json({
            message: 'Liste des prestataires',
            count: prestataires.length,
            prestataires: prestataires
        });
    } catch (error) {
        console.error('Erreur récupération prestataires:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// GET /prestataires/:id - Détails d'un prestataire
/**
 * @swagger
 * /prestataires/{id}:
 *   get:
 *     summary: Récupérer les détails d'un prestataire
 *     tags: [Prestataires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations du prestataire
 *       404:
 *         description: Prestataire non trouvé
 */
router.get('/:id', async (req, res) => {
    try {
        const prestataire = await findPrestataireById(req.db, req.params.id);
        if (!prestataire) {
            return res.status(404).json({ error: 'Prestataire non trouvé' });
        }
        res.json(prestataire);
    } catch (error) {
        console.error('Erreur récupération prestataire:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// POST /prestataires - Création d'un prestataire
/**
 * @swagger
 * /prestataires:
 *   post:
 *     summary: Créer un nouveau prestataire
 *     tags: [Prestataires]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Prestataire créé avec succès
 *       400:
 *         description: Données manquantes
 */
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, category, description } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Données manquantes', message: 'Le nom et l\'email sont requis' });
        }

        const newPrestataire = await createPrestataire(req.db, { name, email, phone, category, description });
        res.status(201).json({ message: 'Prestataire créé avec succès', prestataire: newPrestataire });
    } catch (error) {
        console.error('Erreur création prestataire:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// PUT /prestataires/:id - Mise à jour d'un prestataire
/**
 * @swagger
 * /prestataires/{id}:
 *   put:
 *     summary: Mettre à jour un prestataire
 *     tags: [Prestataires]
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prestataire mis à jour
 *       404:
 *         description: Prestataire non trouvé
 */
router.put('/:id', async (req, res) => {
    try {
        const result = await updatePrestataireById(req.db, req.params.id, req.body);
        
        let updatedPrestataire = await findPrestataireById(req.db, req.params.id);
        if (!updatedPrestataire) {
            return res.status(404).json({ error: 'Prestataire non trouvé' });
        }
        res.json({ message: 'Prestataire mis à jour', prestataire: updatedPrestataire });
    } catch (error) {
        console.error('Erreur mise à jour prestataire:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// DELETE /prestataires/:id - Suppression d'un prestataire
/**
 * @swagger
 * /prestataires/{id}:
 *   delete:
 *     summary: Supprimer un prestataire
 *     tags: [Prestataires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prestataire supprimé avec succès
 *       404:
 *         description: Prestataire non trouvé
 */
router.delete('/:id', async (req, res) => {
    try {
        const result = await deletePrestataireById(req.db, req.params.id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Prestataire non trouvé' });
        }
        res.json({ message: 'Prestataire supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression prestataire:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

module.exports = router;
