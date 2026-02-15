/**
 * @description
 * Point d’entrée principal de l’API Port de Plaisance Russell.
 *
 * Ce module :
 * - charge les variables d’environnement (.env)
 * - initialise l’application Express définie dans `app.js`
 * - applique un préfixe d’API configurable (API_PREFIX)
 * - établit la connexion MongoDB via `initClientDBConnection()` (issue‑21)
 * - démarre le serveur HTTP sur l’IP et le port configurés
 *
 * Rôles :
 * - Assurer que la base MongoDB est connectée AVANT le lancement du serveur
 * - Centraliser la configuration réseau (IP, PORT, PREFIX)
 * - Préparer la gestion des erreurs MongoDB (issue‑22)
 *
 * Variables d’environnement utilisées :
 * - IP : adresse d’écoute du serveur (défaut : 0.0.0.0)
 * - PORT : port d’écoute du serveur (défaut : 3000)
 * - API_PREFIX : préfixe des routes (défaut : "/")
 *
 * @requires dotenv
 * @requires express
 * @requires ./app
 * @requires ./db/mongo
 * @version 1.1.0
 */


require('dotenv').config();
const express = require('express');
const app = require('./app');
const { initClientDBConnection } = require('./db/mongo');

const IP = process.env.IP || '0.0.0.0';
const PORT = process.env.PORT || 3000;
const PREFIX = process.env.API_PREFIX || '/';

const expressApp = express();

// Montage de l'app sous le préfixe
expressApp.use(PREFIX, app);

/**
 * Démarre le serveur après connexion MongoDB
 */
async function startServer() {
    // Connexion MongoDB AVANT le lancement du serveur
    await initClientDBConnection();

    expressApp.listen(PORT, IP, () => {
        console.log(`🚀 Serveur démarré sur http://${IP}:${PORT}${PREFIX}`);
    });
}

startServer();
