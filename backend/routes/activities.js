const express = require('express');
const { ObjectId } = require('mongodb');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /activities - Liste toutes les activités
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
