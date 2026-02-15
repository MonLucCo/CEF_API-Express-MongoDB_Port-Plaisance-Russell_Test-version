/**
 * Tests d’intégration (niveau‑2) du modèle Reservation
 * Issue‑19 — Validation réelle avec MongoMemoryServer
 */

const { expect } = require('chai');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Reservation = require('../../src/models/reservation');

describe('Model Reservation — Tests d’intégration (niveau‑2)', () => {
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
        await Reservation.deleteMany({});
    });

    it('devrait insérer une réservation valide', async () => {
        const reservation = await Reservation.create({
            catwayNumber: 5,
            clientName: 'Thomas Martin',
            boatName: 'Carolina',
            checkIn: new Date('2022-05-21T06:00:00Z'),
            checkOut: new Date('2022-05-22T06:00:00Z'),
        });

        expect(reservation._id).to.exist;
        expect(reservation.catwayNumber).to.equal(5);
        expect(reservation.clientName).to.equal('Thomas Martin');
        expect(reservation.boatName).to.equal('Carolina');
        expect(reservation.checkIn.toISOString()).to.equal('2022-05-21T06:00:00.000Z');
        expect(reservation.checkOut.toISOString()).to.equal('2022-05-22T06:00:00.000Z');
        expect(reservation.createdAt).to.exist;
        expect(reservation.updatedAt).to.exist;
    });

    it('devrait refuser une réservation sans clientName', async () => {
        try {
            await Reservation.create({
                catwayNumber: 5,
                boatName: 'Carolina',
                checkIn: new Date(),
                checkOut: new Date(Date.now() + 3600000),
            });
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error).to.be.instanceOf(mongoose.Error.ValidationError);
            expect(error.errors.clientName).to.exist;
        }
    });

    it('devrait refuser un catwayNumber < 1', async () => {
        try {
            await Reservation.create({
                catwayNumber: 0,
                clientName: 'John Doe',
                boatName: 'Groeland',
                checkIn: new Date(),
                checkOut: new Date(Date.now() + 3600000),
            });
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.catwayNumber).to.exist;
        }
    });

    it('devrait refuser un checkOut antérieur à checkIn', async () => {
        try {
            await Reservation.create({
                catwayNumber: 2,
                clientName: 'John Doe',
                boatName: 'Groeland',
                checkIn: new Date('2022-05-21T06:00:00Z'),
                checkOut: new Date('2022-05-20T06:00:00Z'),
            });
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.checkOut).to.exist;
            expect(error.errors.checkOut.message).to.include('postérieure');
        }
    });

    it('devrait trouver une réservation existante', async () => {
        await Reservation.create({
            catwayNumber: 7,
            clientName: 'Alice',
            boatName: 'Blue Pearl',
            checkIn: new Date(),
            checkOut: new Date(Date.now() + 3600000),
        });

        const found = await Reservation.findOne({ catwayNumber: 7 });
        expect(found).to.exist;
        expect(found.clientName).to.equal('Alice');
    });

    it('devrait supprimer une réservation', async () => {
        const reservation = await Reservation.create({
            catwayNumber: 9,
            clientName: 'Bob',
            boatName: 'SeaWind',
            checkIn: new Date(),
            checkOut: new Date(Date.now() + 3600000),
        });

        await Reservation.findByIdAndDelete(reservation._id);

        const deleted = await Reservation.findById(reservation._id);
        expect(deleted).to.be.null;
    });
});
