const express = require('express');
const { findAllUsers, findUserById, updateUserById, deleteUserById, createUser, findUserByEmail, addReservation, removeReservation, addTickets } = require('../models/User');
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

// GET /users - Liste de tous les utilisateurs
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer la liste des utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs (sans mdp)
 *       500:
 *         description: Erreur serveur
 */
router.get('/', async (req, res) => {
    try {
        const users = await findAllUsers(req.db);
        // On retire les mots de passe avant de renvoyer
        const safeUsers = users.map(({ password, ...user }) => user);
        res.json({
            message: 'Liste des utilisateurs',
            count: safeUsers.length,
            users: safeUsers
        });
    } catch (error) {
        console.error('Erreur récupération utilisateurs:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// GET /users/:id - Détails d'un utilisateur
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer les détails d'un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', async (req, res) => {
    try {
        const user = await findUserById(req.db, req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        const { password, ...safeUser } = user;
        res.json(safeUser);
    } catch (error) {
        console.error('Erreur récupération utilisateur:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// POST /users - Création manuelle d'un utilisateur par l'admin
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Création manuelle d'un utilisateur (Admin)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               phone:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Données manquantes
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/', async (req, res) => {
    try {
        const { email, password, name, role, phone, description } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Données manquantes', message: 'Email, mot de passe et nom sont requis' });
        }

        const existingUser = await findUserByEmail(req.db, email);
        if (existingUser) {
            return res.status(409).json({ error: 'Email déjà utilisé' });
        }

        const newUser = await createUser(req.db, { email, password, name });

        // Mettre à jour avec les champs supplémentaires (role, etc.)
        const additionalData = { role: role || 'visiteur', phone, description };
        if (additionalData.role || additionalData.phone || additionalData.description) {
            await updateUserById(req.db, newUser._id, additionalData);
            Object.assign(newUser, additionalData);
        }

        const { password: pwd, ...safeUser } = newUser;
        res.status(201).json({ message: 'Compte créé avec succès', user: safeUser });
    } catch (error) {
        console.error('Erreur création utilisateur:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// PUT /users/:id - Mise à jour d'un utilisateur
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Mettre à jour le profil d'un utilisateur
 *     tags: [Users]
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
 *               description:
 *                 type: string
 *               ageGroup:
 *                 type: string
 *               gender:
 *                 type: string
 *               family:
 *                 type: string
 *               geographicRegion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil utilisateur mis à jour
 *       409:
 *         description: Email déjà utilisé par un autre compte
 */
router.put('/:id', async (req, res) => {
    try {
        const { email, name, role, phone, description, ageGroup, gender, family, geographicRegion } = req.body;
        const updateData = {};
        if (email !== undefined) updateData.email = email.toLowerCase();
        if (name !== undefined) updateData.name = name;
        if (role !== undefined) updateData.role = role;
        if (phone !== undefined) updateData.phone = phone;
        if (description !== undefined) updateData.description = description;
        if (ageGroup !== undefined) updateData.ageGroup = ageGroup;
        if (gender !== undefined) updateData.gender = gender;
        if (family !== undefined) updateData.family = family;
        if (geographicRegion !== undefined) updateData.geographicRegion = geographicRegion;

        // Si on change l'email, on vérifie qu'il n'est pas pris par QUEUELQU'UN D'AUTRE
        if (updateData.email) {
            const existingUser = await findUserByEmail(req.db, updateData.email);
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return res.status(409).json({ error: 'Email déjà utilisé par un autre compte' });
            }
        }

        const result = await updateUserById(req.db, req.params.id, updateData);
        if (!result || !result.value) { // depending on mongodb driver version, findOneAndUpdate returns the doc in value
            // Let's just fetch it again to be safe
            const updatedUser = await findUserById(req.db, req.params.id);
            if (!updatedUser) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            const { password, ...safeUser } = updatedUser;
            return res.json({ message: 'Utilisateur mis à jour', user: safeUser });
        }
    } catch (error) {
        console.error('Erreur mise à jour utilisateur:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// DELETE /users/:id - Suppression d'un utilisateur
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/:id', async (req, res) => {
    try {
        const result = await deleteUserById(req.db, req.params.id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression utilisateur:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// POST /users/:id/reservations - Réserver une activité
/**
 * @swagger
 * /users/{id}/reservations:
 *   post:
 *     summary: Réserver une activité
 *     tags: [Users]
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
 *               activite:
 *                 type: object
 *                 description: L'objet activité entier de la réservation
 *     responses:
 *       201:
 *         description: Réservation effectuée
 *       400:
 *         description: Plus de places
 *       409:
 *         description: Déjà réservée
 */
router.post('/:id/reservations', async (req, res) => {
    try {
        const { activite } = req.body;
        if (!activite) {
            return res.status(400).json({ error: 'Activité manquante' });
        }

        const user = await findUserById(req.db, req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const actId = activite._id || activite.id;
        
        // Anti-doublons
        if (user.reservations && user.reservations.some(r => (r.activite._id || r.activite.id) === actId)) {
            return res.status(409).json({ error: 'Vous avez déjà réservé cette activité.' });
        }

        // Vérification et décrémentation des places si ID valide
        if (ObjectId.isValid(actId) && actId.length === 24) {
            const realAct = await req.db.collection('activities').findOne({ _id: new ObjectId(actId) });
            if (realAct && realAct.places !== undefined) {
                if (realAct.places <= 0) {
                    return res.status(400).json({ error: 'Plus de places disponibles pour cette activité.' });
                }
                // Retirer 1 place
                await req.db.collection('activities').updateOne(
                    { _id: new ObjectId(actId) },
                    { $inc: { places: -1 } }
                );
            }
        }

        const reservation = {
            id: Date.now(),
            activite,
            dateReservation: new Date().toLocaleDateString()
        };

        const result = await addReservation(req.db, req.params.id, reservation);
        const updatedUser = await findUserById(req.db, req.params.id);
        if (!updatedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        return res.status(201).json({ message: 'Réservation ajoutée', user: updatedUser });
    } catch (error) {
        console.error('Erreur ajout réservation:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// DELETE /users/:id/reservations/:resId - Annuler une réservation
/**
 * @swagger
 * /users/{id}/reservations/{resId}:
 *   delete:
 *     summary: Annuler une réservation
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: resId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation annulée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id/reservations/:resId', async (req, res) => {
    try {
        const user = await findUserById(req.db, req.params.id);
        if (user && user.reservations) {
            const reservation = user.reservations.find(r => r.id === parseInt(req.params.resId) || r.id === req.params.resId);
            if (reservation) {
                const actId = reservation.activite._id || reservation.activite.id;
                if (ObjectId.isValid(actId) && String(actId).length === 24) {
                    // Remettre 1 place
                    await req.db.collection('activities').updateOne(
                        { _id: new ObjectId(actId) },
                        { $inc: { places: 1 } }
                    );
                }
            }
        }

        const result = await removeReservation(req.db, req.params.id, parseInt(req.params.resId));
        res.json({ message: 'Réservation annulée', result });
    } catch (error) {
        console.error('Erreur annulation réservation:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

// POST /users/:id/tickets - Ajouter des billets
/**
 * @swagger
 * /users/{id}/tickets:
 *   post:
 *     summary: Ajouter des billets à l'utilisateur
 *     tags: [Users]
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
 *               tickets:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Billets ajoutés
 */
router.post('/:id/tickets', async (req, res) => {
    try {
        const { tickets } = req.body;
        if (!tickets || !Array.isArray(tickets)) {
            return res.status(400).json({ error: 'Billets manquants ou format invalide' });
        }

        // Ajouter la date d'achat sur chaque billet s'il n'y en a pas
        const enrichedTickets = tickets.map(t => ({
            ...t,
            purchaseDate: t.purchaseDate || new Date().toLocaleDateString()
        }));

        const result = await addTickets(req.db, req.params.id, enrichedTickets);
        const updatedUser = await findUserById(req.db, req.params.id);
        if (!updatedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        return res.status(201).json({ message: 'Billets ajoutés', user: updatedUser });
    } catch (error) {
        console.error('Erreur ajout billets:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

module.exports = router;
