/**
 * Tests d’intégration – Niveau 2 – Routes Reservations
 * ------------------------------------------------------------------
 * Ce fichier teste l’ensemble des routes de gestion des réservations :
 *   - GET /catways/:id/reservations
 *   - GET /catways/:id/reservations/:idReservation
 *   - POST /catways/:id/reservations
 *   - DELETE /catways/:id/reservations/:idReservation
 *
 * Objectifs :
 *   - Vérifier le comportement métier complet des réservations.
 *   - Tester les validations, les erreurs Mongo, les cas limites,
 *     et la cohérence catway ↔ réservation.
 *
 * Architecture :
 *   - Base Mongo isolée via MongoMemoryServer (root-hooks.js).
 *   - Authentification JWT via createTestUser() dans beforeEach().
 *   - Aucun mock : vrai test d’intégration Express + Mongoose.
 *
 * @module tests/integration/reservations.routes.test
 * @requires chai
 * @requires sinon
 * @requires supertest
 * @requires mongoose
 * @requires module:src/app
 * @requires module:src/models/catway
 * @requires module:src/models/reservation
 * @requires module:tests/helpers/createTestUser
 * @version 0.2.0
 */
const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const sinon = require('sinon');

const app = require('../../src/app');
const Catway = require('../../src/models/catway');
const Reservation = require('../../src/models/reservation');
const createTestUser = require('../helpers/createTestUser');

describe('Tests d’intégration - Niveau 2 – Routes Reservations', () => {

    // ------------------------------------------------------------------
    // Création d'un utilisateur et du token JWT avant chaque test
    // ------------------------------------------------------------------
    let testToken;

    beforeEach(async () => {
        const { token } = await createTestUser();

        testToken = token;
    });

    // -----------------------------
    // GET /catways/:id/reservations
    // -----------------------------
    describe('GET /catways/:id/reservations — niveau‑2 (issue‑33)', () => {

        let catway;

        beforeEach(async () => {
            catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'available'
            });
        });

        it('200 — retourne un tableau vide si aucune réservation', async () => {
            const res = await request(app)
                .get(`/api/catways/${catway._id}/reservations`)
                // .get(`/catways/${catway.catwayNumber}/reservations`)
                .set('Authorization', `Bearer ${testToken}`);

            expect(res.status).to.equal(200);

            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(0);
        });

        it('200 — retourne la liste des réservations du catway', async () => {
            await Reservation.create([
                {
                    catwayNumber: 1,
                    clientName: 'Alice',
                    boatName: 'Boaty McBoatface',
                    checkIn: new Date('2025-01-01'),
                    checkOut: new Date('2025-01-02')
                },
                {
                    catwayNumber: 1,
                    clientName: 'Bob',
                    boatName: 'Sea Breeze',
                    checkIn: new Date('2025-01-03'),
                    checkOut: new Date('2025-01-04')
                }
            ]);

            const res = await request(app)
                // .get(`/api/catways/${catway._id}/reservations`)
                .get(`/api/catways/${catway.catwayNumber}/reservations`)
                .set('Authorization', `Bearer ${testToken}`);

            expect(res.status).to.equal(200);

            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(2);

            const boatNames = res.body.map(r => r.boatName);
            expect(boatNames).to.have.members([
                'Boaty McBoatface',
                'Sea Breeze'
            ]);
        });

        it('500 — erreur interne simulée', async () => {
            const stub = sinon.stub(Reservation, 'find').throws(new Error('Test error'));

            const res = await request(app)
                .get(`/api/catways/${catway._id}/reservations`)
                // .get(`/api/catways/${catway.catwayNumber}/reservations`)
                .set('Authorization', `Bearer ${testToken}`);

            expect(res.status).to.equal(500);

            expect(res.body).to.have.property('error');

            stub.restore();
        });
    });

    // -----------------------------
    // GET /catways/:id/reservations/:idReservation
    // -----------------------------
    describe('GET /catways/:id/reservations/:idReservation — niveau-2 (issue‑34)', () => {

        const now = new Date();

        // -----------------------------------------------------
        // 200 — réservation trouvée
        // -----------------------------------------------------
        it('200 — renvoie le détail d’une réservation', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });

            const reservation = await Reservation.create({
                catwayNumber: 1,
                clientName: 'Alice',
                boatName: 'Sea Breeze',
                checkIn: new Date(now.getTime()),   // aujourd’hui
                checkOut: new Date(now.getTime() + 24 * 60 * 60 * 1000)  // demain
            });

            const res = await request(app)
                .get(`/api/catways/${catway._id}/reservations/${reservation._id}`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(200);

            expect(res.body.clientName).to.equal('Alice');
            expect(res.body.boatName).to.equal('Sea Breeze');
            expect(res.body.catwayNumber).to.equal(1);
        });

        // -----------------------------------------------------
        // 404 — réservation introuvable
        // -----------------------------------------------------
        it('404 — réservation introuvable', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });

            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .get(`/api/catways/${catway._id}/reservations/${fakeId}`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(404);

            expect(res.body.error).to.equal('Réservation introuvable');
        });

        // -----------------------------------------------------
        // 404 — réservation non associée à ce catway
        // -----------------------------------------------------
        it('404 — réservation non associée à ce catway', async () => {
            const catway1 = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });

            const catway2 = await Catway.create({
                catwayNumber: 2,
                type: 'long',
                catwayState: 'occupied'
            });

            const reservation = await Reservation.create({
                catwayNumber: 2,
                clientName: 'Bob',
                boatName: 'Ocean Breeze',
                checkIn: new Date(now.getTime()),   // aujourd’hui
                checkOut: new Date(now.getTime() + 24 * 60 * 60 * 1000)  // demain
            });

            const res = await request(app)
                .get(`/api/catways/${catway1._id}/reservations/${reservation._id}`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(404);

            expect(res.body.error).to.equal('Réservation non associée à ce catway');
        });

        // -----------------------------------------------------
        // 400 — idReservation invalide
        // -----------------------------------------------------
        it('400 — identifiant de réservation invalide', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });

            const res = await request(app)
                .get(`/api/catways/${catway._id}/reservations/abc123`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(400);

            expect(res.body.error).to.equal('Identifiant de réservation invalide');
        });

        // -----------------------------------------------------
        // 500 — erreur interne simulée
        // -----------------------------------------------------
        it('500 — erreur interne simulée', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });

            const reservation = await Reservation.create({
                catwayNumber: 1,
                clientName: 'Alice',
                boatName: 'Sea Breeze',
                checkIn: new Date(now.getTime()),   // aujourd’hui
                checkOut: new Date(now.getTime() + 24 * 60 * 60 * 1000)  // demain
            });

            // Simule une erreur interne en stubant Reservation.findById
            const sinon = require('sinon');
            sinon.stub(Reservation, 'findById').throws(new Error('Test error'));

            const res = await request(app)
                .get(`/api/catways/${catway._id}/reservations/${reservation._id}`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(500);

            expect(res.body.error).to.equal('Erreur interne du serveur');

            sinon.restore();
        });
    });

    // -----------------------------
    // POST /catways/:id/reservations
    // -----------------------------
    describe('POST /catways/:id/reservations — niveau‑2 (issue‑35)', () => {

        // -----------------------------------------------------
        // 201 — création réussie
        // -----------------------------------------------------
        it('201 — crée une réservation pour un catway', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });

            const payload = {
                clientName: 'Alice',
                boatName: 'Sea Breeze',
                checkIn: '2025-05-01T10:00:00Z',
                checkOut: '2025-05-01T12:00:00Z'
            };

            const res = await request(app)
                .post(`/api/catways/${catway._id}/reservations`)
                .set('Authorization', `Bearer ${testToken}`)
                .send(payload)
                .expect(201);

            expect(res.body.clientName).to.equal('Alice');
            expect(res.body.boatName).to.equal('Sea Breeze');
            expect(res.body.catwayNumber).to.equal(1);
        });

        // -----------------------------------------------------
        // 400 — payload invalide (champs manquants)
        // -----------------------------------------------------
        it('400 — payload invalide : champs manquants', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });

            const res = await request(app)
                .post(`/api/catways/${catway._id}/reservations`)
                .set('Authorization', `Bearer ${testToken}`)
                .send({})
                .expect(400);

            expect(res.body.error).to.equal(
                'Les champs clientName, boatName, checkIn et checkOut sont obligatoires'
            );
        });

        // -----------------------------------------------------
        // 400 — dates invalides
        // -----------------------------------------------------
        it('400 — payload invalide : dates invalides', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });

            const payload = {
                clientName: 'Alice',
                boatName: 'Sea Breeze',
                checkIn: 'not-a-date',
                checkOut: '2025-05-01T12:00:00Z'
            };

            const res = await request(app)
                .post(`/api/catways/${catway._id}/reservations`)
                .set('Authorization', `Bearer ${testToken}`)
                .send(payload)
                .expect(400);

            expect(res.body.error).to.equal(
                'Les champs checkIn et checkOut doivent être des dates valides'
            );
        });

        // -----------------------------------------------------
        // 400 — checkIn >= checkOut
        // -----------------------------------------------------
        it('400 — checkIn doit être strictement inférieur à checkOut', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });

            const payload = {
                clientName: 'Alice',
                boatName: 'Sea Breeze',
                checkIn: '2025-05-01T12:00:00Z',
                checkOut: '2025-05-01T12:00:00Z'
            };

            const res = await request(app)
                .post(`/api/catways/${catway._id}/reservations`)
                .set('Authorization', `Bearer ${testToken}`)
                .send(payload)
                .expect(400);

            expect(res.body.error).to.equal(
                'La date checkIn doit être strictement inférieure à checkOut'
            );
        });

        // -----------------------------------------------------
        // 404 — catway introuvable
        // -----------------------------------------------------
        it('404 — catway introuvable', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const payload = {
                clientName: 'Alice',
                boatName: 'Sea Breeze',
                checkIn: '2025-05-01T10:00:00Z',
                checkOut: '2025-05-01T12:00:00Z'
            };

            const res = await request(app)
                .post(`/api/catways/${fakeId}/reservations`)
                .set('Authorization', `Bearer ${testToken}`)
                .send(payload)
                .expect(404);

            expect(res.body.error).to.equal('Catway introuvable');
        });

        // -----------------------------------------------------
        // 500 — erreur interne simulée
        // -----------------------------------------------------
        it('500 — erreur interne simulée', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });

            const payload = {
                clientName: 'Alice',
                boatName: 'Sea Breeze',
                checkIn: '2025-05-01T10:00:00Z',
                checkOut: '2025-05-01T12:00:00Z'
            };

            // Stub de Reservation.create pour simuler une erreur interne
            const sinon = require('sinon');
            sinon.stub(Reservation, 'create').throws(new Error('Test error'));

            const res = await request(app)
                .post(`/api/catways/${catway._id}/reservations`)
                .set('Authorization', `Bearer ${testToken}`)
                .send(payload)
                .expect(500);

            expect(res.body.error).to.equal('Erreur interne du serveur');

            sinon.restore();
        });
    });

    // -----------------------------
    // DELETE /catways/:id/reservations/:idReservation
    // -----------------------------
    describe('DELETE /catways/:id/reservations/:idReservation — niveau‑2 (issue‑36)', () => {

        // -----------------------------------------------------
        // 200 — suppression réussie
        // -----------------------------------------------------
        it('200 — supprime une réservation existante', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });

            const reservation = await Reservation.create({
                clientName: 'Alice',
                boatName: 'Sea Breeze',
                checkIn: new Date('2025-05-01T10:00:00Z'),
                checkOut: new Date('2025-05-01T12:00:00Z'),
                catwayNumber: 1
            });

            const res = await request(app)
                .delete(`/api/catways/${catway._id}/reservations/${reservation._id}`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(200);

            expect(res.body.message).to.equal('Réservation supprimée avec succès');

            const deleted = await Reservation.findById(reservation._id);
            expect(deleted).to.be.null;
        });

        // -----------------------------------------------------
        // 404 — réservation introuvable
        // -----------------------------------------------------
        it('404 — réservation introuvable', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });

            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .delete(`/api/catways/${catway._id}/reservations/${fakeId}`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(404);

            expect(res.body.error).to.equal('Réservation introuvable');
        });

        // -----------------------------------------------------
        // 404 — réservation non associée au catway
        // -----------------------------------------------------
        it('404 — réservation non associée à ce catway', async () => {
            const catway1 = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });

            const catway2 = await Catway.create({
                catwayNumber: 2,
                type: 'long',
                catwayState: 'free'
            });

            const reservation = await Reservation.create({
                clientName: 'Bob',
                boatName: 'Blue Wave',
                checkIn: new Date('2025-05-01T10:00:00Z'),
                checkOut: new Date('2025-05-01T12:00:00Z'),
                catwayNumber: 2
            });

            const res = await request(app)
                .delete(`/api/catways/${catway1._id}/reservations/${reservation._id}`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(404);

            expect(res.body.error).to.equal('Réservation non associée à ce catway');
        });

        // -----------------------------------------------------
        // 400 — identifiant de réservation invalide
        // -----------------------------------------------------
        it('400 — identifiant de réservation invalide', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });

            const res = await request(app)
                .delete(`/api/catways/${catway._id}/reservations/invalid-id`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(400);

            expect(res.body.error).to.equal('Identifiant de réservation invalide');
        });

        // -----------------------------------------------------
        // 404 — catway introuvable
        // -----------------------------------------------------
        it('404 — catway introuvable', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .delete(`/api/catways/${fakeId}/reservations/${fakeId}`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(404);

            expect(res.body.error).to.equal('Catway introuvable');
        });

        // -----------------------------------------------------
        // 500 — erreur interne simulée
        // -----------------------------------------------------
        it('500 — erreur interne simulée', async () => {
            const catway = await Catway.create({
                catwayNumber: 1,
                type: 'short',
                catwayState: 'free'
            });

            const reservation = await Reservation.create({
                clientName: 'Alice',
                boatName: 'Sea Breeze',
                checkIn: new Date('2025-05-01T10:00:00Z'),
                checkOut: new Date('2025-05-01T12:00:00Z'),
                catwayNumber: 1
            });

            const sinon = require('sinon');
            sinon.stub(Reservation, 'findByIdAndDelete').throws(new Error('Test error'));

            const res = await request(app)
                .delete(`/api/catways/${catway._id}/reservations/${reservation._id}`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(500);

            expect(res.body.error).to.equal('Erreur interne du serveur');

            sinon.restore();
        });
    });

});
