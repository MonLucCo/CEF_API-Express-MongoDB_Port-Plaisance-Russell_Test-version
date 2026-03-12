/**
 * Tests d’intégration – Niveau 2 – Routes Catways
 * ----------------------------------------------------------
 * - Utilise MongoMemoryServer (base MongoDB en mémoire)
 * - Utilise Supertest pour appeler Express
 * - Utilise Chai pour les assertions
 * - Aucun mock → vrai test d’intégration
 */

const { expect } = require('chai');
const sinon = require('sinon'); // Seulement pour le test d’erreur interne dans POST /catways
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../src/app');
const Catway = require('../../src/models/catway');

describe('Tests d’intégration - Niveau 2 – Routes Catways', () => {

    // -----------------------------
    // GET /catways
    // -----------------------------
    describe('GET /catways', () => {

        it('retourne 200 et une liste vide si aucun catway', async () => {
            const res = await request(app).get('/api/catways');

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array').that.is.empty;
        });

        it('retourne 200 et la liste des catways existants', async () => {
            await Catway.create([
                { catwayNumber: 1, type: 'short', catwayState: 'bon état' },
                { catwayNumber: 2, type: 'long', catwayState: 'en réparation' }
            ]);

            const res = await request(app).get('/api/catways');

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array').with.lengthOf(2);

            const numbers = res.body.map(c => c.catwayNumber);
            expect(numbers).to.have.members([1, 2]);
        });

    });

    // -----------------------------
    // GET /catways/:id
    // -----------------------------
    describe('GET /catways/:id', () => {

        it('retourne 400 si ID invalide (ni ObjectId, ni nombre)', async () => {
            const res = await request(app).get('/api/catways/ab123');
            expect(res.status).to.equal(400);
        });

        it('retourne 404 si catway introuvable (ObjectId inexistant)', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/catways/${fakeId}`);
            expect(res.status).to.equal(404);
        });

        it('retourne 404 si catway introuvable (catwayNumber inexistant)', async () => {
            const res = await request(app).get('/api/catways/999');
            expect(res.status).to.equal(404);
        });

        it('retourne 200 si catway trouvé', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'bon état'
            });

            const res = await request(app).get(`/api/catways/${catway._id}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('catwayNumber', 1);
        });

        it('retourne 200 si catway trouvé via catwayNumber', async () => {
            const catway = await Catway.create({
                catwayNumber: 7,
                type: 'long',
                catwayState: 'bon état'
            });

            const res = await request(app).get('/api/catways/7');

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('catwayNumber', 7);
        });

    });

    // -----------------------------
    // POST /catways
    // -----------------------------
    describe('POST /catways', () => {

        it('retourne 400 si payload invalide', async () => {
            const res = await request(app)
                .post('/api/catways')
                .send({});

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error');
        });

        it('retourne 201 si catway créé', async () => {
            const payload = {
                catwayNumber: 1,
                type: 'short',
                catwayState: 'bon état'
            };

            const res = await request(app)
                .post('/api/catways')
                .send(payload);

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('catwayNumber', 1);

            const inDb = await Catway.findOne({ catwayNumber: 1 });
            expect(inDb).to.not.be.null;
        });

        it('retourne 409 si catwayNumber existe déjà', async () => {
            await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'bon état'
            });

            const res = await request(app)
                .post('/api/catways')
                .send({
                    catwayNumber: 1,
                    type: 'short',
                    catwayState: 'bon état'
                });

            expect(res.status).to.equal(409);
            expect(res.body).to.have.property('error');
        });

        it('retourne 500 si erreur interne Mongo survient', async () => {
            // On force une erreur interne en stubant Catway.create
            const stub = sinon.stub(Catway, 'create').throws(new Error('Erreur interne'));

            const res = await request(app)
                .post('/api/catways')
                .send({
                    catwayNumber: 2,
                    type: 'short',
                    catwayState: 'bon état'
                });

            expect(res.status).to.equal(500);
            expect(res.body).to.have.property('error');

            stub.restore();
        });

    });

    // -----------------------------
    // PUT /catways/:id
    // -----------------------------
    describe('PUT /catways/:id', () => {

        it('retourne 400 si payload invalide', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'bon état'
            });

            const res = await request(app)
                .put(`/api/catways/${catway._id}`)
                .send({}); // payload invalide

            expect(res.status).to.equal(400);
        });

        it('retourne 404 si catway introuvable', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .put(`/api/catways/${fakeId}`)
                .send({
                    catwayNumber: 99,
                    type: 'long',
                    catwayState: 'neuf'
                });

            expect(res.status).to.equal(404);
        });

        it('retourne 200 si mise à jour réussie', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'bon état'
            });

            const res = await request(app)
                .put(`/api/catways/${catway._id}`)
                .send({
                    catwayNumber: 99,
                    type: 'long',
                    catwayState: 'neuf'
                });

            expect(res.status).to.equal(200);
            expect(res.body.catwayNumber).to.equal(99);

            const updated = await Catway.findById(catway._id);
            expect(updated.catwayNumber).to.equal(99);
        });

        it('retourne 409 si catwayNumber existe déjà', async () => {
            await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'bon état'
            });

            const catway2 = await Catway.create({
                catwayNumber: 2,
                type: 'long',
                catwayState: 'neuf'
            });

            const res = await request(app)
                .put(`/api/catways/${catway2._id}`)
                .send({
                    catwayNumber: 1, // duplication
                    type: 'long',
                    catwayState: 'neuf'
                });

            expect(res.status).to.equal(409);
        });

        it('retourne 500 si erreur interne survient', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'bon état'
            });

            const stub = sinon.stub(Catway.prototype, 'save').throws(new Error('Erreur interne'));

            const res = await request(app)
                .put(`/api/catways/${catway._id}`)
                .send({
                    catwayNumber: 99,
                    type: 'long',
                    catwayState: 'neuf'
                });

            expect(res.status).to.equal(500);

            stub.restore();
        });

    });

    // -----------------------------
    // PATCH /catways/:id
    // -----------------------------
    describe('PATCH /catways/:id', () => {

        it('retourne 400 si payload invalide', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'bon état'
            });

            const res = await request(app)
                .patch(`/api/catways/${catway._id}`)
                .send({ type: 'medium' }); // invalide

            expect(res.status).to.equal(400);
        });

        it('retourne 404 si catway introuvable', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .patch(`/api/catways/${fakeId}`)
                .send({ type: 'long' });

            expect(res.status).to.equal(404);
        });

        it('retourne 200 si mise à jour partielle réussie', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'bon état'
            });

            const res = await request(app)
                .patch(`/api/catways/${catway._id}`)
                .send({ type: 'long' });

            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal('long');

            const updated = await Catway.findById(catway._id);
            expect(updated.type).to.equal('long');
        });

        it('retourne 409 si catwayNumber existe déjà', async () => {
            await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'bon état'
            });

            const catway2 = await Catway.create({
                catwayNumber: 2,
                type: 'long',
                catwayState: 'neuf'
            });

            const res = await request(app)
                .patch(`/api/catways/${catway2._id}`)
                .send({ catwayNumber: 1 }); // duplication

            expect(res.status).to.equal(409);
        });

        it('retourne 500 si erreur interne survient', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'bon état'
            });

            const stub = sinon.stub(Catway.prototype, 'save').throws(new Error('Erreur interne'));

            const res = await request(app)
                .patch(`/api/catways/${catway._id}`)
                .send({ type: 'long' });

            expect(res.status).to.equal(500);

            stub.restore();
        });

    });

    // -----------------------------
    // DELETE /catways/:id
    // -----------------------------
    describe('DELETE /catways/:id', () => {

        it('retourne 400 si ID invalide', async () => {
            const res = await request(app)
                .delete('/api/catways/abc123') // ni ObjectId, ni nombre
                .send();

            expect(res.status).to.equal(400);
        });

        it('retourne 404 si catway introuvable', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .delete(`/api/catways/${fakeId}`)
                .send();

            expect(res.status).to.equal(404);
        });

        it('retourne 204 si suppression réussie', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'bon état'
            });

            const res = await request(app)
                .delete(`/api/catways/${catway._id}`)
                .send();

            expect(res.status).to.equal(204);

            const exists = await Catway.findById(catway._id);
            expect(exists).to.be.null;
        });

        it('retourne 500 si erreur interne survient', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'bon état'
            });

            const stub = sinon.stub(Catway.prototype, 'deleteOne')
                .throws(new Error('Erreur interne'));

            const res = await request(app)
                .delete(`/api/catways/${catway._id}`)
                .send();

            expect(res.status).to.equal(500);

            stub.restore();
        });

    });

});
