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
