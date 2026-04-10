/**
 * @file server.js
 * @description
 * Point d’entrée principal de l’API Port de Plaisance Russell.
 *
 * Versions :
 * - v1.0.0 : Issue‑21 — Connexion MongoDB avant listen()
 * - v1.1.0 : JSDoc enrichie
 * - v2.0.0 : Issue‑22 — Résilience serveur & gestion des erreurs MongoDB
 *
 * Ce module :
 * - charge les variables d’environnement (.env)
 * - initialise l’application Express définie dans `app.js`
 * - applique un préfixe d’API configurable (API_PREFIX)
 * - établit la connexion MongoDB via `initClientDBConnection()`
 * - gère les erreurs MongoDB (issue‑22)
 * - gère les erreurs serveur (port déjà utilisé, permission refusée)
 * - gère les signaux système (SIGINT, SIGTERM)
 * - démarre le serveur HTTP uniquement si la base est connectée
 *
 * @requires dotenv
 * @requires express
 * @requires ./app
 * @requires ./db/mongo
 * @version 2.0.0
 */

require('dotenv').config();
const express = require('express');
const app = require('./app');
const { initClientDBConnection, disconnectClientDBConnection } = require('./db/mongo');

const PROTOCOL = process.env.PROTOCOL || 'http';
const DOMAIN = process.env.DOMAIN || 'localhost';
const PORT = process.env.PORT || 3000;
const PREFIX = process.env.API_PREFIX || '/';

const expressApp = express();

// Montage de l'app sous le préfixe
expressApp.use(PREFIX, app);

/**
 * Démarre le serveur après connexion MongoDB.  
 * Gestion des erreurs critiques MongoDB et serveur. Arrêt propre sur signaux système.
 *
 * @async
 * @function startServer
 * 
 * @version 1.1.0
 */
async function startServer() {
    try {
        await initClientDBConnection();
    } catch (err) {
        console.error('❌ Erreur critique MongoDB :', err.message);
        process.exit(1);
    }

    try {
        const server = expressApp.listen(PORT, DOMAIN, () => {
            console.log(`🚀 Serveur démarré sur ${PROTOCOL}://${DOMAIN}:${PORT}${PREFIX}`);
        });

        server.on('error', (err) => {
            console.error('❌ Erreur serveur :', err.message);

            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Le port ${PORT} est déjà utilisé.`);
            }
            if (err.code === 'EACCES') {
                console.error(`❌ Permission refusée pour écouter sur le port ${PORT}.`);
            }

            process.exit(1);
        });

        // Arrêt propre (CTRL+C)
        process.on('SIGINT', async () => {
            console.log('🛑 Arrêt du serveur (SIGINT)…');
            await disconnectClientDBConnection();
            process.exit(0);
        });

        // Arrêt propre (Alwaysdata / Docker / OS)
        process.on('SIGTERM', async () => {
            console.log('🛑 Arrêt du serveur (SIGTERM)…');
            await disconnectClientDBConnection();
            process.exit(0);
        });

    } catch (err) {
        console.error('❌ Erreur critique lors du démarrage du serveur :', err.message);
        process.exit(1);
    }
}

startServer();
