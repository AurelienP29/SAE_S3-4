const express = require('express');
const router = express.Router();

const getDb = (req, res, next) => {
    req.db = req.app.locals.db;
    if (!req.db) {
        return res.status(500).json({ error: 'Base de données non disponible' });
    }
    next();
};

router.use(getDb);

// GET /stats
/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Récupérer les statistiques globales de l'événement (dashboard)
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Renvoie les métriques des visiteurs, prestataires et des files d'attentes.
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', async (req, res) => {
    try {
        const db = req.db;

        // --- Utilisateurs ---
        const allUsers = await db.collection('users').find({}).toArray();
        const totalUsers = allUsers.length;
        const visiteurs = allUsers.filter(u => u.role === 'visiteur').length;
        const prestatairesUsers = allUsers.filter(u => u.role === 'prestataire').length;
        const admins = allUsers.filter(u => u.role === 'admin').length;

        const usersByRole = { visiteur: visiteurs, prestataire: prestatairesUsers, admin: admins };

        // --- Prestataires ---
        const allPrestataires = await db.collection('prestataires').find({}).toArray();

        const byStatus = { accepted: 0, pending: 0, refused: 0 };
        const categoryCounts = {};
        const daysCounts = { vendredi: 0, samedi: 0, dimanche: 0 };

        for (const p of allPrestataires) {
            const s = p.status || 'pending';
            byStatus[s] = (byStatus[s] || 0) + 1;

            if (s === 'accepted') {
                categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
                for (const day of (p.days_available || [])) {
                    if (daysCounts[day] !== undefined) daysCounts[day]++;
                }
            }
        }

        const acceptedPrestataires = allPrestataires.filter(p => p.status === 'accepted');
        const totalPrestataires = acceptedPrestataires.length;

        // --- Prestations ---
        const allPrestations = await db.collection('prestations').find({}).toArray();
        const totalPrestations = allPrestations.length;

        const prestationsWithProvider = allPrestations.filter(p => p.provider_id != null).length;
        const prestationsWithoutProvider = totalPrestations - prestationsWithProvider;

        const prestationsByCategory = {};
        for (const p of allPrestations) {
            prestationsByCategory[p.category] = (prestationsByCategory[p.category] || 0) + 1;
        }

        // --- Activités ---
        const allActivities = await db.collection('activities').find({}).toArray();
        const totalActivities = allActivities.length;
        const totalMaxPlaces = allActivities.reduce((sum, a) => sum + (a.max_places || a.places || 0), 0);

        // Activités par prestataire via prestation -> provider_id
        const prestationMap = {};
        for (const p of allPrestations) {
            if (p.provider_id) {
                prestationMap[p._id.toString()] = p.provider_id.toString();
            }
        }

        const activitiesPerPrestataire = {};
        for (const a of allActivities) {
            if (a.prestation_id) {
                const providerId = prestationMap[a.prestation_id.toString()];
                if (providerId) {
                    activitiesPerPrestataire[providerId] = (activitiesPerPrestataire[providerId] || 0) + 1;
                }
            }
        }

        const activitiesPerPrestataireList = acceptedPrestataires.map(p => ({
            name: p.name,
            category: p.category,
            activitiesCount: activitiesPerPrestataire[p._id.toString()] || 0
        }));

        // --- File d'attente ---
        const allWaiting = await db.collection('waitinglistprestataires').find({}).toArray();
        const waitingTotal = allWaiting.length;
        const waitingPending = allWaiting.filter(w => w.status === 'pending').length;
        const waitingByCategory = {};
        for (const w of allWaiting) {
            waitingByCategory[w.category] = (waitingByCategory[w.category] || 0) + 1;
        }

        // --- Messages ---
        const allMessages = await db.collection('messages').find({}).toArray();
        const totalMessages = allMessages.length;
        const messagesATraiter = allMessages.filter(m => m.status === 'a traiter').length;
        const messagesTraites = allMessages.filter(m => m.status === 'traité').length;

        // --- Données simulées (non disponibles en DB) ---
        const realActivityRegistrations = allActivities.map(a => ({
            title: a.title || a.titre,
            registrations: a.registered_users ? a.registered_users.length : 0,
            maxPlaces: a.max_places || a.places || 30
        }));

        // Calculate real demographics
        const ageCounts = {};
        const genderCounts = {};
        const familyCounts = {};
        const geoCounts = {};
        
        for (const u of allUsers) {
            if (u.ageGroup) ageCounts[u.ageGroup] = (ageCounts[u.ageGroup] || 0) + 1;
            if (u.gender) genderCounts[u.gender] = (genderCounts[u.gender] || 0) + 1;
            if (u.family) familyCounts[u.family] = (familyCounts[u.family] || 0) + 1;
            if (u.geographicRegion) geoCounts[u.geographicRegion] = (geoCounts[u.geographicRegion] || 0) + 1;
        }

        const formatDistrib = (counts) => {
            const sum = Object.values(counts).reduce((a, b) => a + b, 0);
            if (sum === 0) return [];
            return Object.entries(counts)
                .sort((a, b) => b[1] - a[1]) // Tri décroissant optionnel
                .map(([label, count]) => ({
                    label,
                    value: Math.round((count / sum) * 100)
                }));
        };

        const realAgeDistribution = formatDistrib(ageCounts);
        const realGenderDistribution = formatDistrib(genderCounts);
        const realFamilyDistribution = formatDistrib(familyCounts);
        const realGeoDistribution = formatDistrib(geoCounts);
        const hasRealDemographics = realAgeDistribution.length > 0;

        const simulated = {
            _simulated: true,
            visitorsPerDay: [
                { day: 'Vendredi', count: 420 },
                { day: 'Samedi', count: 1250 },
                { day: 'Dimanche', count: 980 }
            ],
            ageDistribution: [
                { label: '< 18 ans', value: 22 },
                { label: '18–25 ans', value: 35 },
                { label: '26–35 ans', value: 28 },
                { label: '36–45 ans', value: 10 },
                { label: '> 45 ans', value: 5 }
            ],
            genderDistribution: [
                { label: 'Hommes', value: 54 },
                { label: 'Femmes', value: 40 },
                { label: 'Non-binaire / Autre', value: 6 }
            ],
            familyDistribution: [
                { label: 'En famille', value: 31 },
                { label: 'Seul(e) / Amis', value: 69 }
            ],
            geographicDistribution: [
                { label: 'Belfort (90)', value: 38 },
                { label: 'Montbéliard (25)', value: 24 },
                { label: 'Mulhouse (68)', value: 15 },
                { label: 'Besançon (25)', value: 10 },
                { label: 'Autre région', value: 13 }
            ],
            satisfactionScore: 4.2,
            satisfactionDistribution: [
                { stars: 5, count: 312 },
                { stars: 4, count: 275 },
                { stars: 3, count: 118 },
                { stars: 2, count: 42 },
                { stars: 1, count: 18 }
            ],
            prestatairePageViews: acceptedPrestataires.map(p => ({
                name: p.name,
                category: p.category,
                views: Math.floor(Math.random() * 400) + 50
            }))
        };

        res.json({
            visiteurs: {
                total: totalUsers,
                uniqueVisiteurs: visiteurs,
                byRole: usersByRole,
                totalByDay: simulated.visitorsPerDay,
                activityRegistrations: realActivityRegistrations,
                ageDistribution: hasRealDemographics ? realAgeDistribution : simulated.ageDistribution,
                genderDistribution: hasRealDemographics ? realGenderDistribution : simulated.genderDistribution,
                familyDistribution: hasRealDemographics ? realFamilyDistribution : simulated.familyDistribution,
                geographicDistribution: hasRealDemographics ? realGeoDistribution : simulated.geographicDistribution,
                _simulatedFields: hasRealDemographics ? ['totalByDay'] : ['totalByDay', 'ageDistribution', 'genderDistribution', 'familyDistribution', 'geographicDistribution']
            },
            satisfaction: {
                score: simulated.satisfactionScore,
                distribution: simulated.satisfactionDistribution,
                _simulated: true
            },
            prestataires: {
                total: totalPrestataires,
                byStatus,
                byCategory: categoryCounts,
                availabilityByDay: daysCounts,
                totalPrestations,
                totalActivities,
                totalMaxPlaces,
                standOccupancy: {
                    withProvider: prestationsWithProvider,
                    withoutProvider: prestationsWithoutProvider
                },
                prestationsByCategory,
                pageViews: simulated.prestatairePageViews,
                activitiesPerPrestataire: activitiesPerPrestataireList,
                _simulatedFields: ['pageViews']
            },
            management: {
                messages: {
                    total: totalMessages,
                    pending: messagesATraiter,
                    done: messagesTraites
                },
                waitingList: {
                    total: waitingTotal,
                    pending: waitingPending,
                    byCategory: waitingByCategory
                }
            }
        });

    } catch (error) {
        console.error('Erreur récupération statistiques:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

module.exports = router;
