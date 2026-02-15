/**
 * Connexion MongoDB centralisée
 * Issue‑20B — Phase 3 : Modèles & données
 */

const mongoose = require('mongoose');

async function initClientDBConnection() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DBNAME || 'db-test';

    if (!uri) {
        console.error('❌ ERREUR : MONGODB_URI est manquant dans le fichier .env');
        process.exit(1);
    }

    if (dbName == 'db-test') {
        console.warn('⚠️  DBNAME non défini dans le fichier .env, utilisation de "db-test" par défaut');
    }

    try {
        console.log('🔌 Connexion à MongoDB…');
        await mongoose.connect(uri, {
            dbName: dbName
        });
        console.log('✅ Connexion MongoDB établie');
    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB :', error.message);
        process.exit(1);
    }
}

async function disconnectClientDBConnection() {
    try {
        await mongoose.disconnect();
        console.log('🔌 Déconnexion MongoDB réussie');
    } catch (error) {
        console.error('❌ Erreur lors de la déconnexion MongoDB :', error.message);
    }
}

module.exports = { initClientDBConnection, disconnectClientDBConnection };
