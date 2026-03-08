const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const sinon = require('sinon');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../../src/app');
const Catway = require('../../src/models/catway');
const Reservation = require('../../src/models/reservation');

describe('GET /catways/:id/reservations — niveau‑2 (issue‑33)', () => {
    let mongoServer;
    let catway;

    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);

        catway = await Catway.create({
            catwayNumber: 1,
            type: 'short',
            catwayState: 'available'
        });
    });

    after(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Reservation.deleteMany({});
    });

    it('200 — retourne un tableau vide si aucune réservation', async () => {
        const res = await request(app)
            .get(`/catways/${catway._id}/reservations`);
        // .get(`/catways/${catway.catwayNumber}/reservations`)

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
            // .get(`/catways/${catway._id}/reservations`);
            .get(`/catways/${catway.catwayNumber}/reservations`);

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
            .get(`/catways/${catway._id}/reservations`);
        // .get(`/catways/${catway.catwayNumber}/reservations`);

        expect(res.status).to.equal(500);

        expect(res.body).to.have.property('error');

        stub.restore();
    });
});

describe('GET /catways/:id/reservations/:idReservation — niveau-2 (issue‑34)', () => {

    let mongoServer;

    const now = new Date();

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
        await Reservation.deleteMany({});
    });

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
            .get(`/catways/${catway._id}/reservations/${reservation._id}`)
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
            .get(`/catways/${catway._id}/reservations/${fakeId}`)
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
            .get(`/catways/${catway1._id}/reservations/${reservation._id}`)
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
            .get(`/catways/${catway._id}/reservations/abc123`)
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
            .get(`/catways/${catway._id}/reservations/${reservation._id}`)
            .expect(500);

        expect(res.body.error).to.equal('Erreur interne du serveur');

        sinon.restore();
    });
});

describe('POST /catways/:id/reservations — niveau‑2 (issue‑35)', () => {

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
        await Reservation.deleteMany({});
    });

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
            .post(`/catways/${catway._id}/reservations`)
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
            .post(`/catways/${catway._id}/reservations`)
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
            .post(`/catways/${catway._id}/reservations`)
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
            .post(`/catways/${catway._id}/reservations`)
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
            .post(`/catways/${fakeId}/reservations`)
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
            .post(`/catways/${catway._id}/reservations`)
            .send(payload)
            .expect(500);

        expect(res.body.error).to.equal('Erreur interne du serveur');

        sinon.restore();
    });
});
