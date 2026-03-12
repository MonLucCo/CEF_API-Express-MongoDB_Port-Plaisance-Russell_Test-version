/**
 * Fichier de configuration pour les tests, utilisant mongodb-memory-server pour une base de données en mémoire.
 * 
 * Ce fichier exporte des hooks Mocha (`beforeAll`, `afterAll`, `beforeEach`) qui sont exécutés avant et après les tests.
 * 
 * - `beforeAll` : démarre une instance de MongoDB en mémoire et se connecte à cette base.
 * - `afterAll` : se déconnecte de MongoDB et arrête l’instance en mémoire.
 * - `beforeEach` : nettoie les collections de la base avant chaque test pour garantir l’isolation des tests.
 * 
 * Il configure une instance de MongoDB en mémoire avant les tests, se connecte à cette base, et nettoie les collections avant 
 * chaque test.
 * 
 * La CLI de test (ex : `npm tests`) détectera automatiquement ce fichier et exécutera les hooks définis ici, assurant que tous 
 * les tests s’exécutent avec une base de données propre et isolée, sans nécessiter de configuration supplémentaire dans les 
 * fichiers de test individuels.
 * 
 * Il permet d’avoir une base de données isolée et éphémère pour les tests, sans affecter la base de développement ou de 
 * production.
 * 
 * @module tests/root-hooks
 * @requires mongoose
 * @requires mongodb-memory-server
 * @version 0.1.0
 */
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
