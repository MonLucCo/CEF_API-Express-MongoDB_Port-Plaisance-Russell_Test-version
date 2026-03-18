/**
 * Tests d’intégration – Niveau 2 – Protection JWT des routes API
 * ------------------------------------------------------------------
 * Ce fichier teste exclusivement la protection des routes Catways et
 * Reservations via le middleware JWT.
 *
 * Objectifs :
 *   - Vérifier que les routes protégées renvoient :
 *       • 401 si aucun token n’est fourni
 *       • 401 si le token est invalide
 *       • 200 si un token valide est fourni
 *
 * Architecture :
 *   - Utilise Supertest pour appeler Express.
 *   - Utilise MongoMemoryServer (via root-hooks.js) pour une base isolée.
 *   - Utilise createTestUser() pour générer un utilisateur + token JWT
 *     avant chaque test, garantissant une authentification cohérente.
 *
 * Important :
 *   - Aucun test métier ici (ils sont dans catways.routes.test.js et
 *     reservations.routes.test.js).
 *   - Ce fichier valide uniquement la couche de sécurité JWT.
 *
 * @module tests/integration/api.routes.test
 * @requires chai
 * @requires supertest
 * @requires module:src/app
 * @requires module:src/models/catway
 * @requires module:tests/helpers/createTestUser
 * @version 0.1.0
 */
const { expect } = require('chai');
const request = require('supertest');

const app = require('../../src/app');
const Catway = require('../../src/models/catway');
const createTestUser = require('../helpers/createTestUser')

describe('Tests d’intégration - Niveau 2 – Protection JWT des routes API', () => {

    // ------------------------------------------------------------------
    // Création d'un utilisateur et du token JWT avant chaque test
    // ------------------------------------------------------------------
    let testToken;

    beforeEach(async () => {
        const { token } = await createTestUser();

        testToken = token;
    });

    // ------------------------------------------------------------------
    // 1) Tests Catways
    // ------------------------------------------------------------------
    describe('Protection JWT – Routes Catways', () => {

        it('GET /api/catways → 401 si aucun token', async () => {
            const res = await request(app).get('/api/catways');
            expect(res.status).to.equal(401);
        });

        it('GET /api/catways → 401 si token invalide', async () => {
            const res = await request(app)
                .get('/api/catways')
                .set('Authorization', 'Bearer invalid.token.here');

            expect(res.status).to.equal(401);
        });

        it('GET /api/catways → 200 si token valide', async () => {
            const res = await request(app)
                .get('/api/catways')
                .set('Authorization', `Bearer ${testToken}`);

            expect(res.status).to.equal(200);
        });

        it('POST /api/catways → 401 si aucun token', async () => {
            const res = await request(app)
                .post('/api/catways')
                .send({ catwayNumber: 1, type: 'short', catwayState: 'ok' });

            expect(res.status).to.equal(401);
        });

        it('DELETE /api/catways/:id → 401 si aucun token', async () => {
            const res = await request(app)
                .delete('/api/catways/12345');

            expect(res.status).to.equal(401);
        });
    });

    // ------------------------------------------------------------------
    // 2) Tests Reservations
    // ------------------------------------------------------------------
    describe('Protection JWT – Routes Reservations', () => {

        let catway;

        beforeEach(async () => {
            catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });
        });

        it('GET /api/catways/:id/reservations → 401 si aucun token', async () => {
            const res = await request(app)
                .get(`/api/catways/${catway._id}/reservations`);

            expect(res.status).to.equal(401);
        });

        it('POST /api/catways/:id/reservations → 401 si aucun token', async () => {
            const res = await request(app)
                .post(`/api/catways/${catway._id}/reservations`)
                .send({
                    clientName: 'Alice',
                    boatName: 'Sea Breeze',
                    checkIn: '2025-05-01T10:00:00Z',
                    checkOut: '2025-05-01T12:00:00Z'
                });

            expect(res.status).to.equal(401);
        });

        it('DELETE /api/catways/:id/reservations/:idReservation → 401 si aucun token', async () => {
            const fakeId = '65aa0f0f0f0f0f0f0f0f0f0f';

            const res = await request(app)
                .delete(`/api/catways/${catway._id}/reservations/${fakeId}`);

            expect(res.status).to.equal(401);
        });

        it('GET /api/catways/:id/reservations → 200 si token valide', async () => {
            const res = await request(app)
                .get(`/api/catways/${catway._id}/reservations`)
                .set('Authorization', `Bearer ${testToken}`);

            expect(res.status).to.equal(200);
        });
    });

});
