/**
 * Root Hooks Mocha – Configuration globale des tests (v0.2.0)
 * ------------------------------------------------------------------
 * Ce fichier définit l’environnement global d’exécution des tests.
 * Il est automatiquement chargé par Mocha via l’option `--require`.
 *
 * Rôle :
 *   - Charger les variables d’environnement (.env) AVANT tout autre module.
 *   - Démarrer une instance MongoDB en mémoire (MongoMemoryServer).
 *   - Connecter Mongoose à cette base isolée.
 *   - Nettoyer toutes les collections avant chaque test (isolation totale).
 *   - Arrêter proprement MongoMemoryServer après l’exécution complète.
 *
 * Pourquoi ce fichier est indispensable :
 *   - Garantit que tous les tests (unitaires, intégration, e2e) utilisent
 *     une base propre, isolée et éphémère.
 *   - Évite les effets de bord entre fichiers de tests.
 *   - Assure que jwtConfig.secret lit les variables d’environnement
 *     AVANT le premier require('src/app'), garantissant la cohérence JWT.
 *
 * Important :
 *   - Aucune création d’utilisateur ou de token ici.
 *   - Aucun require d’Express ou d’app.js ici.
 *   - Ce fichier prépare l’environnement, les tests créent leurs données.
 *
 * @module tests/root-hooks
 * @requires mongoose
 * @requires dotenv
 * @requires mongodb-memory-server
 * @version 0.2.0
 */
require('dotenv').config({ path: '.env' }); // Pour la création du token JWT

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

exports.mochaHooks = {
    async beforeAll() {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    },

    async afterAll() {
        await mongoose.disconnect();
        await mongoServer.stop();
    },

    async beforeEach() {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
};
