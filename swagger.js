import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { users, prestataires, prestations, activities } from './src/datasource/data.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// config swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SAE S3-4 API',
      version: '1.0.0',
      description: 'Documentation de l\'API pour le projet SAE S3-4',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./swagger.js'], // Fichiers contenant les annotations Swagger
};


const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *     Prestataire:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         category:
 *           type: string
 *     Prestation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         description:
 *           type: string
 */

// routes "triviales" ==============================================================================================
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/api/users', (req, res) => {
  res.json(users);
});

/**
 * @swagger
 * /api/prestataires:
 *   get:
 *     summary: Récupérer tous les prestataires
 *     tags: [Prestataires]
 *     responses:
 *       200:
 *         description: Liste des prestataires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prestataire'
 */
app.get('/api/prestataires', (req, res) => {
  res.json(prestataires);
});

/**
 * @swagger
 * /api/prestations:
 *   get:
 *     summary: Récupérer toutes les prestations
 *     tags: [Prestations]
 *     responses:
 *       200:
 *         description: Liste des prestations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prestation'
 */
app.get('/api/prestations', (req, res) => {
  res.json(prestations);
});

// routes "non triviales" ==============================================================================================
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Authentification utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentification réussie
 *       401:
 *         description: Identifiants incorrects
 */
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Créer un nouveau compte utilisateur
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
 *               role:
 *                 type: string
 *                 default: visiteur
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Données invalides ou email déjà utilisé
 */
app.post('/api/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role: role || 'visiteur',
    roles: [role || 'visiteur']
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

/**
 * @swagger
 * /api/prestations:
 *   post:
 *     summary: Créer une nouvelle prestation (Admin/Prestataire uniquement)
 *     tags: [Prestations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               prestataireId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Prestation créée
 *       400:
 *         description: Données manquantes
 */
app.post('/api/prestations', (req, res) => {
  const { name, category, description, prestataireId } = req.body;
  if (!name || !category) {
    return res.status(400).json({ message: 'Name and category are required' });
  }
  const newPrestation = {
    id: prestations.length + 1,
    name,
    category,
    description,
    prestataireId: prestataireId || null
  };
  prestations.push(newPrestation);
  res.status(201).json(newPrestation);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur (Admin)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id === parseInt(id));
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

/**
 * @swagger
 * /api/prestataires/search:
 *   get:
 *     summary: Rechercher des prestataires avec filtres
 *     tags: [Prestataires]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nom du prestataire
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Catégorie du prestataire
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prestataire'
 */
app.get('/api/prestataires/search', (req, res) => {
  const { name, category } = req.query;
  let results = prestataires;
  if (name) {
    results = results.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (category) {
    results = results.filter(p => p.category === category);
  }
  res.json(results);
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
  console.log(`Documentation Swagger disponible sur http://localhost:${port}/api-docs`);
});
