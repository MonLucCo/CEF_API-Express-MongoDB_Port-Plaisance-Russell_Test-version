/**
 * @file mongo.js
 * @description
 * Module centralisant la connexion et la déconnexion à MongoDB via Mongoose.
 * 
 * Ce module est introduit dans :
 * - Issue‑20B : Import des données JSON (Phase 3)
 * - Issue‑21  : Configuration MongoDB (Phase 3)
 *
 * Il fournit :
 * - une fonction d'initialisation de la connexion MongoDB (`initClientDBConnection`)
 * - une fonction de déconnexion propre (`disconnectClientDBConnection`)
 * - une configuration Mongoose stabilisée (options recommandées)
 * - un mode verbose activable via `.env` (DB_VERBOSE=true)
 * - des événements Mongoose utiles pour le debug et la future gestion d’erreurs (issue‑22)
 *
 * @requires mongoose
 * @version 1.0.0
 * @see https://mongoosejs.com/docs/connections.html
 * @see https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/
 */

const mongoose = require('mongoose');

/**
 * Initialise la connexion MongoDB via Mongoose.
 *
 * Cette fonction :
 * - lit les variables d’environnement MONGODB_URI, DBNAME et DB_VERBOSE
 * - applique les options recommandées pour Mongoose 7+ / 8+ / 9+
 * - établit la connexion à MongoDB Atlas
 * - active des événements Mongoose (connected, disconnected, error)
 * - affiche des informations supplémentaires si DB_VERBOSE=true
 *
 * @async
 * @function initClientDBConnection
 * @throws {Error} Arrête le processus si MONGODB_URI est manquant ou si la connexion échoue.
 *
 * @example
 * // Dans src/server.js
 * const { initClientDBConnection } = require('./db/mongo');
 * await initClientDBConnection();
 * 
 * @requires mongoose
 * @version 1.1.0
 */
async function initClientDBConnection() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DBNAME || 'db-test';
    const verbose = process.env.DB_VERBOSE === 'true';

    if (!uri) {
        console.error('❌ ERREUR : MONGODB_URI est manquant dans le fichier .env');
        process.exit(1);
    }

    if (dbName === 'db-test') {
        console.warn('⚠️  DBNAME non défini dans .env → utilisation de "db-test"');
    }

    /**
     * Options Mongoose recommandées :
     * - dbName : sélection explicite de la base (évite la base "test")
     * - autoIndex : création automatique des index (OK en dev)
     * - maxPoolSize : limite du pool de connexions
     * - serverSelectionTimeoutMS : timeout de sélection du serveur MongoDB
     * - socketTimeoutMS : timeout réseau des opérations longues
     */
    const options = {
        dbName,
        autoIndex: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
    };

    try {
        console.log(`🔌 Connexion à MongoDB (${dbName})…`);
        await mongoose.connect(uri, options);

        console.log('✅ Connexion MongoDB établie');

        if (verbose) {
            console.log('📘 Options Mongoose :', options);
        }

        // Événements Mongoose utiles pour le debug et l’issue‑22
        mongoose.connection.on('connected', () => {
            if (verbose) console.log('🔗 Mongoose : connected');
        });

        mongoose.connection.on('disconnected', () => {
            if (verbose) console.log('🔌 Mongoose : disconnected');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose : erreur de connexion', err.message);
        });

    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB :', error.message);
        process.exit(1);
    }
}

/**
 * Déconnecte proprement Mongoose de MongoDB.
 *
 * Cette fonction est utilisée :
 * - dans les scripts (ex : import-data.js)
 * - dans les tests d’intégration réels (issue‑22)
 *
 * @async
 * @function disconnectClientDBConnection
 *
 * @example
 * await disconnectClientDBConnection();
 * 
 * @requires mongoose
 * @version 1.0.0
 */
async function disconnectClientDBConnection() {
    try {
        await mongoose.disconnect();
        console.log('🔌 Déconnexion MongoDB réussie');
    } catch (error) {
        console.error('❌ Erreur lors de la déconnexion MongoDB :', error.message);
    }
}

module.exports = { initClientDBConnection, disconnectClientDBConnection };
