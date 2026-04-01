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

// GET /stats - Statistiques globales de l'événement
router.get('/', async (req, res) => {
    try {
        const db = req.db;

        // --- Utilisateurs ---
        const allUsers = await db.collection('users').find({}).toArray();
        const totalUsers = allUsers.length;
        const visiteurs = allUsers.filter(u => u.role === 'visiteur').length;
        const prestatairesCount = allUsers.filter(u => u.role === 'prestataire').length;

        // --- Prestataires ---
        const allPrestataires = await db.collection('prestataires').find({ status: 'accepted' }).toArray();
        const totalPrestataires = allPrestataires.length;

        const categoryCounts = {};
        for (const p of allPrestataires) {
            categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
        }

        // --- Prestations ---
        const allPrestations = await db.collection('prestations').find({}).toArray();
        const totalPrestations = allPrestations.length;

        // --- Activités ---
        const allActivities = await db.collection('activities').find({}).toArray();
        const totalActivities = allActivities.length;

        // Activités par prestataire (via prestation -> provider_id)
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

        const activitiesPerPrestataireList = allPrestataires.map(p => ({
            name: p.name,
            category: p.category,
            activitiesCount: activitiesPerPrestataire[p._id.toString()] || 0
        }));

        // --- Données simulées (pas de champs dédiés en DB) ---
        const simulatedData = {
            visitorsPerDay: [
                { day: 'Vendredi', count: 420 },
                { day: 'Samedi', count: 1250 },
                { day: 'Dimanche', count: 980 }
            ],
            activityRegistrations: allActivities.map(a => ({
                title: a.title,
                registrations: Math.floor(Math.random() * (a.max_places || 30) * 0.85) + 1,
                maxPlaces: a.max_places || 30
            })),
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
            prestatairePageViews: allPrestataires.map(p => ({
                name: p.name,
                category: p.category,
                views: Math.floor(Math.random() * 400) + 50
            })),
            totalExposants: Math.round(totalPrestataires * 0.75),
            totalBenevoles: 24
        };

        res.json({
            visiteurs: {
                total: totalUsers,
                uniqueVisiteurs: visiteurs,
                totalByDay: simulatedData.visitorsPerDay,
                activityRegistrations: simulatedData.activityRegistrations,
                ageDistribution: simulatedData.ageDistribution,
                genderDistribution: simulatedData.genderDistribution,
                familyDistribution: simulatedData.familyDistribution,
                geographicDistribution: simulatedData.geographicDistribution
            },
            satisfaction: {
                score: simulatedData.satisfactionScore,
                distribution: simulatedData.satisfactionDistribution
            },
            prestataires: {
                total: totalPrestataires,
                exposants: simulatedData.totalExposants,
                benevoles: simulatedData.totalBenevoles,
                totalPrestations,
                totalActivities,
                pageViews: simulatedData.prestatairePageViews,
                activitiesPerPrestataire: activitiesPerPrestataireList,
                byCategory: categoryCounts
            }
        });

    } catch (error) {
        console.error('Erreur récupération statistiques:', error);
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

module.exports = router;
