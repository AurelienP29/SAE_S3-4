const express = require('express');
const { findAllUsers, findUserById, updateUserById, deleteUserById, createUser, findUserByEmail } = require('../models/User');

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
router.put('/:id', async (req, res) => {
    try {
        const { email, name, role, phone, description } = req.body;
        const updateData = {};
        if (email !== undefined) updateData.email = email.toLowerCase();
        if (name !== undefined) updateData.name = name;
        if (role !== undefined) updateData.role = role;
        if (phone !== undefined) updateData.phone = phone;
        if (description !== undefined) updateData.description = description;

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

module.exports = router;
