const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const { findUserByEmail, findUserById, createUser, comparePassword } = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Fonction pour générer un JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

// POST /auth/register - Inscription
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données manquantes ou mot de passe invalide
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const db = req.app.locals.db;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Données manquantes',
        message: 'Email, mot de passe et nom sont requis'
      });
    }

    // Validation password
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Mot de passe invalide',
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await findUserByEmail(db, email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Email déjà utilisé',
        message: 'Un compte existe déjà avec cet email'
      });
    }

    // Créer l'utilisateur
    const user = await createUser(db, { email, password, name });

    // Générer le token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Compte créé avec succès',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        provider: user.provider,
        reservations: user.reservations || [],
        tickets: user.tickets || []
      },
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: error.message
    });
  }
});

// POST /auth/login - Connexion
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Se connecter à la plateforme
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne le token JWT et les informations de l'utilisateur
 *       400:
 *         description: Email ou mot de passe textuellement manquant
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = req.app.locals.db;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Données manquantes',
        message: 'Email et mot de passe requis'
      });
    }

    // Trouver l'utilisateur
    const user = await findUserByEmail(db, email);
    if (!user) {
      return res.status(401).json({
        error: 'Identifiants invalides',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Identifiants invalides',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer le token JWT
    const token = generateToken(user._id);

    res.json({
      message: 'Connexion réussie',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        provider: user.provider,
        picture: user.picture,
        reservations: user.reservations || [],
        tickets: user.tickets || []
      },
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: error.message
    });
  }
});

// GET /api/auth/profile - Profil utilisateur (protégé)
/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur récupéré avec succès
 *       401:
 *         description: Non authentifié ou token invalide
 *       500:
 *         description: Erreur serveur
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      message: 'Profil utilisateur',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur serveur',
      message: error.message
    });
  }
});

// (Route GET /api/auth/users retirée car déplacée vers routes/users.js)

// Route pour initier l'authentification Google
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Rediriger vers l'authentification Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirection vers Google
 */
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
}));

// Route callback Google
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Callback de l'authentification Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirection vers le frontend avec le token
 */
router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=authentication_failed`
  }),
  (req, res) => {
    try {
      // Récupérer l'utilisateur authentifié
      const user = req.user;

      // Générer un JWT
      const token = generateToken(user._id);

      // Rediriger vers le frontend avec le token
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Erreur génération token:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
  }
);

module.exports = router;
