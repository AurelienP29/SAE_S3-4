require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const passport = require('./config/passport');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const activitiesRoutes = require('./routes/activities');
const prestatairesRoutes = require('./routes/prestataires');
const prestationsRoutes = require('./routes/prestations');
const waitingListRoutes = require('./routes/waitingList');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS pour Vue.js
const corsOptions = {
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialiser Passport (SANS session car on utilise JWT)
app.use(passport.initialize());
// ⚠️ PAS de passport.session() car on est en stateless JWT !

// Connexion MongoDB avec driver natif
const client = new MongoClient(process.env.MONGODB_URI);

client.connect()
  .then(() => {
    console.log('✅ MongoDB connecté');
    // Stocker la référence db dans app.locals pour les routes
    app.locals.db = client.db();
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB:', err);
    process.exit(1);
  });

// Routes
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/activities', activitiesRoutes);
app.use('/prestataires', prestatairesRoutes);
app.use('/prestations', prestationsRoutes);
app.use('/waitingList', waitingListRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: '🎓 OAuth + JWT Demo - Backend Express + MongoDB',
    endpoints: {
      'POST /auth/register': 'Créer un compte (email/password)',
      'POST /auth/login': 'Se connecter (email/password)',
      'GET /auth/google': 'Se connecter avec Google',
      'GET /auth/google/callback': 'Callback Google OAuth',
      'GET /auth/profile': 'Profil (protégé par JWT)',
      'GET /auth/users': 'Liste utilisateurs (debug)'
    },
    database: 'MongoDB Native Driver',
    authentication: 'JWT stateless + Google OAuth 2.0',
    cors: 'Configuré pour Vue.js'
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Base de données: ${process.env.MONGODB_URI}`);
  console.log(`Frontend autorisé: ${process.env.FRONTEND_URL}`);
});

// Fermer MongoDB à l'arrêt
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB déconnecté');
  process.exit(0);
});
