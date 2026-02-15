/**
 * @description
 * Module centralisant la connexion et la déconnexion à MongoDB via Mongoose.
 *
 * Versions :
 * - v1.0.0 : Issue‑20B — Import JSON
 * - v1.1.0 : Issue‑21  — Configuration MongoDB
 * - v2.0.0 : Issue‑22  — Gestion des erreurs MongoDB (résilience)
 *
 * Ce module fournit :
 * - une fonction d'initialisation de la connexion MongoDB (`initClientDBConnection`)
 * - une fonction de déconnexion propre (`disconnectClientDBConnection`)
 * - une classification des erreurs MongoDB (DNS, timeout, auth, whitelist…)
 * - une remontée d’erreurs explicite vers le serveur
 * - des événements Mongoose utiles pour le debug
 *
 * @requires mongoose
 * @version 2.0.0
 */

const mongoose = require('mongoose');

/**
 * Normalise les erreurs MongoDB pour les rendre exploitables par server.js.
 *
 * @param {Error} error - Erreur brute renvoyée par Mongoose/MongoDB
 * @returns {Error} Erreur normalisée avec un code interne
 * 
 * @version 1.0.0
 */
function normalizeMongoError(error) {
    const msg = error.message || '';

    if (msg.includes('ENOTFOUND')) return new Error('MONGO_DNS_ERROR');
    if (msg.includes('ECONNREFUSED')) return new Error('MONGO_CONNECTION_REFUSED');
    if (msg.includes('timed out')) return new Error('MONGO_TIMEOUT');
    if (msg.includes('Authentication failed')) return new Error('MONGO_AUTH_FAILED');
    if (msg.includes('not authorized')) return new Error('MONGO_AUTH_NOT_ALLOWED');
    if (msg.includes('whitelist') || msg.includes('IP')) return new Error('MONGO_IP_NOT_WHITELISTED');

    return new Error('MONGO_CONNECTION_FAILED');
}

/**
 * Initialise la connexion MongoDB via Mongoose.
 * Capture des erreurs pendant la connexion et les normalise pour le serveur.
 *
 * @async
 * @function initClientDBConnection
 * @throws {Error} Erreur normalisée en cas d’échec de connexion.
 * 
 * @version 1.2.0
 */
async function initClientDBConnection() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DBNAME || 'db-test';
    const verbose = process.env.DB_VERBOSE === 'true';

    if (!uri) {
        throw new Error('MONGO_URI_MISSING');
    }

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

        if (verbose) console.log('📘 Options Mongoose :', options);

        mongoose.connection.on('connected', () => {
            if (verbose) console.log('🔗 Mongoose : connected');
        });

        mongoose.connection.on('disconnected', () => {
            if (verbose) console.log('🔌 Mongoose : disconnected');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose runtime error :', err.message);
        });

    } catch (error) {
        const normalized = normalizeMongoError(error);
        throw normalized;
    }
}

/**
 * Déconnecte proprement Mongoose de MongoDB.
 *
 * @async
 * @function disconnectClientDBConnection
 * 
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
