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
/**
 * @swagger
 * /waitingList:
 *   get:
 *     summary: Récupérer la file d'attente des prestataires
 *     tags: [WaitingList]
 *     responses:
 *       200:
 *         description: Liste de toutes les demandes d'inscription
 *       500:
 *         description: Erreur serveur
 */
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
/**
 * @swagger
 * /waitingList:
 *   post:
 *     summary: Ajouter un prestataire à la file d'attente
 *     tags: [WaitingList]
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
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *               days_available:
 *                 type: array
 *                 items:
 *                   type: string
 *               requestDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 default: pending
 *     responses:
 *       201:
 *         description: Demande créée avec succès
 *       400:
 *         description: Données manquantes
 */
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, category, description, services, days_available, requestDate, status } = req.body;

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
            days_available: days_available || [],
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
/**
 * @swagger
 * /waitingList/{id}:
 *   delete:
 *     summary: Supprimer une demande de la file d'attente
 *     tags: [WaitingList]
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
 *         description: Demande supprimée avec succès
 *       404:
 *         description: Demande non trouvée
 */
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
