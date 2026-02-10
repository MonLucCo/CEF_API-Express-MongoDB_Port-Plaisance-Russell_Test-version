/**
 * Application Express dédiée aux tests, utilisant une base MongoDB en mémoire
 * via MongoMemoryServer.
 *
 * Cette application :
 * - utilise la même configuration applicative que l’API réelle (dotenv, middlewares, routes, sécurité)
 * - remplace uniquement la connexion MongoDB par une base en mémoire
 * - ne doit jamais être utilisée en production
 * - ne doit jamais être lancée en même temps que `server.js`
 *
 * Elle permet :
 * - de tester l’API complète en environnement isolé
 * - de valider les modèles et comportements métier avant la connexion à MongoDB Atlas
 * - d’exécuter des tests E2E simulés (Postman)
 * - de faciliter le développement des futures phases (Catways, Réservations…)
 *
 * @note
 * Ce module n’est pas utilisé par les tests automatisés (Mocha/Supertest),
 * qui gèrent leur propre instance de MongoMemoryServer.
 *
 * Cette application utilise `app.js` (Express sans connexion DB), et non `server.js`.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app'); // Express sans connexion DB

let mongoServer = null;
let server = null;

// Port identique à celui de server.js pour permettre l’usage de la même collection Postman
const PORT = process.env.PORT || 3000;

/**
 * Démarre MongoMemoryServer + Express
 */
async function startTestApp() {
    try {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        console.log('[TEST-APP] MongoMemoryServer démarré :', uri);

        await mongoose.connect(uri);
        console.log('[TEST-APP] Connexion Mongoose OK');

        server = app.listen(PORT, () => {
            console.log(`[TEST-APP] Serveur Express de test lancé sur http://localhost:${PORT}`);
            console.log('[TEST-APP] (I) --> Environnement de test démarré. Appuyez sur Ctrl+C pour arrêter.');
        });

        return { server, mongoServer };

    } catch (error) {
        console.error('[TEST-APP] Erreur au démarrage :', error);
        throw error;
    }
}

/**
 * Arrête proprement Express + MongoMemoryServer
 */
async function stopTestApp() {
    try {
        if (server) {
            await new Promise(resolve => server.close(resolve));
            console.log('[TEST-APP] Serveur Express arrêté');
        }

        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            console.log('[TEST-APP] Déconnexion Mongoose OK');
        }

        // ⚠️ Correctif Windows : ne PAS attendre mongoServer.stop()
        if (mongoServer) {
            console.log('[TEST-APP] Tentative arrêt MongoMemoryServer...');
            try {
                mongoServer.stop(false); // arrêt synchrone, non bloquant
                console.log('[TEST-APP] MongoMemoryServer arrêté (mode sync)');
            } catch (e) {
                console.log('[TEST-APP] Impossible d’arrêter MongoMemoryServer proprement (Windows).');
            }
        }

        console.log('[TEST-APP] Environnement de test arrêté proprement.');

    } catch (error) {
        console.error('[TEST-APP] Erreur à l’arrêt :', error);
        throw error;
    }
}

module.exports = { startTestApp, stopTestApp };

/* ---------------------------------------------------------
   Lancement direct via CLI (npm run test:app / test:app:watch)
--------------------------------------------------------- */
if (require.main === module) {
    startTestApp();

    const gracefulExit = async (signal) => {
        console.log(`\n[TEST-APP] Arrêt demandé (${signal})`);
        await stopTestApp();

        // Laisser stdout se vider avant de quitter
        setTimeout(() => process.exit(0), 10);
    };

    process.on('SIGINT', () => gracefulExit('SIGINT'));
    process.on('SIGTERM', () => gracefulExit('SIGTERM'));
}
