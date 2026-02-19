/**
 * Tests d’intégration – Niveau 2 – Routes Catways
 * ----------------------------------------------------------
 * - Utilise MongoMemoryServer (base MongoDB en mémoire)
 * - Utilise Supertest pour appeler Express
 * - Utilise Chai pour les assertions
 * - Aucun mock → vrai test d’intégration
 */

const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../../src/app');
const Catway = require('../../src/models/catway');

describe('Tests d’intégration - Niveau 2 – Routes Catways', () => {

    let mongoServer;

    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    after(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Catway.deleteMany({});
    });

    // -----------------------------
    // GET /catways
    // -----------------------------
    describe('GET /catways', () => {

        it('retourne 200 et une liste vide si aucun catway', async () => {
            const res = await request(app).get('/catways');

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array').that.is.empty;
        });

        it('retourne 200 et la liste des catways existants', async () => {
            await Catway.create([
                { catwayNumber: 1, type: 'short', catwayState: 'bon état' },
                { catwayNumber: 2, type: 'long', catwayState: 'en réparation' }
            ]);

            const res = await request(app).get('/catways');

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array').with.lengthOf(2);

            expect(res.body[0]).to.have.property('catwayNumber', 1);
            expect(res.body[1]).to.have.property('catwayNumber', 2);
        });

    });

    // -----------------------------
    // GET /catways/:id
    // -----------------------------
    describe('GET /catways/:id', () => {

        it('retourne 400 si ID invalide (ni ObjectId, ni nombre)', async () => {
            const res = await request(app).get('/catways/ab123');
            expect(res.status).to.equal(400);
        });

        it('retourne 404 si catway introuvable (ObjectId inexistant)', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/catways/${fakeId}`);
            expect(res.status).to.equal(404);
        });

        it('retourne 404 si catway introuvable (catwayNumber inexistant)', async () => {
            const res = await request(app).get('/catways/999');
            expect(res.status).to.equal(404);
        });

        it('retourne 200 si catway trouvé', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'bon état'
            });

            const res = await request(app).get(`/catways/${catway._id}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('catwayNumber', 1);
        });

        it('retourne 200 si catway trouvé via catwayNumber', async () => {
            const catway = await Catway.create({
                catwayNumber: 7,
                type: 'long',
                catwayState: 'bon état'
            });

            const res = await request(app).get('/catways/7');

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('catwayNumber', 7);
        });

    });

});
