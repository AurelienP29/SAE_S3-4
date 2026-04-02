const express = require('express');
const { ObjectId } = require('mongodb');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /activities - Liste toutes les activités
/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Récupérer la liste des activités
 *     tags: [Activities]
 *     responses:
 *       200:
 *         description: Liste de toutes les activités
 *       500:
 *         description: Erreur serveur
 */
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const activities = await db.collection('activities').find().sort({ date: 1 }).toArray();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /activities/:id - Une seule activité
/**
 * @swagger
 * /activities/{id}:
 *   get:
 *     summary: Récupérer une activité par son ID
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'activité
 *       404:
 *         description: Activité non trouvée
 */
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const activity = await db.collection('activities').findOne({ _id: new ObjectId(req.params.id) });
    if (!activity) return res.status(404).json({ message: 'Activité non trouvée' });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /activities - Ajouter une activité (Admin seulement)
/**
 * @swagger
 * /activities:
 *   post:
 *     summary: Créer une nouvelle activité
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titre, date]
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               places:
 *                 type: integer
 *               prix:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Activité créée
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (Admin requis)
 */
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { titre, description, places, prix, date } = req.body;
    
    if (!titre || !date) {
        return res.status(400).json({ message: 'Le titre et la date sont obligatoires' });
    }

    const newActivity = {
      titre,
      description,
      places: parseInt(places) || 0,
      prix: parseFloat(prix) || 0,
      date: new Date(date),
      createdAt: new Date()
    };

    const result = await db.collection('activities').insertOne(newActivity);
    res.status(201).json({ ...newActivity, _id: result.insertedId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /activities/:id - Modifier une activité (Admin seulement)
/**
 * @swagger
 * /activities/{id}:
 *   put:
 *     summary: Modifier une activité
 *     tags: [Activities]
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
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               places:
 *                 type: integer
 *               prix:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Activité modifiée
 *       404:
 *         description: Activité non trouvée
 */
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { titre, description, places, prix, date } = req.body;
    
    const updateData = {};
    if (titre) updateData.titre = titre;
    if (description !== undefined) updateData.description = description;
    if (places !== undefined) updateData.places = parseInt(places);
    if (prix !== undefined) updateData.prix = parseFloat(prix);
    if (date) updateData.date = new Date(date);
    updateData.updatedAt = new Date();

    const result = await db.collection('activities').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ message: 'Activité non trouvée' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /activities/:id - Supprimer une activité (Admin seulement)
/**
 * @swagger
 * /activities/{id}:
 *   delete:
 *     summary: Supprimer une activité
 *     tags: [Activities]
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
 *         description: Activité supprimée
 *       404:
 *         description: Activité non trouvée
 */
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await db.collection('activities').deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Activité non trouvée' });
    }
    
    res.json({ message: 'Activité supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
