const { expect } = require('chai');
const sinon = require('sinon');

const { mockResponse, afterEachRestore } = require('../mocks/tests.mock');
const {
    mockFindAll,
    mockFindAllError,
} = require('../mocks/reservation.mock');

const {
    getReservationsByCatway,
    getReservationById,
    createReservation
} = require('../../src/controllers/reservationController');

const Reservation = require('../../src/models/reservation');

// ----------------------------- 
// GET ALL RESERVATIONS BY CATWAY
// -----------------------------
describe('Controller Reservations — getReservationsByCatway (niveau‑1)', () => {

    afterEachRestore();

    it('devrait renvoyer 200 et la liste des réservations', async () => {
        const fakeDataReservation = [
            { catwayNumber: 1, clientName: 'Alice', boatName: 'Boaty McBoatface', checkIn: "2022-05-21T06:00:00Z", checkOut: "2022-05-22T06:00:00Z" },
            { catwayNumber: 1, clientName: 'Diana', boatName: 'Ocean Breeze', checkIn: "2022-05-23T06:00:00Z", checkOut: "2022-05-25T06:00:00Z" },
            { catwayNumber: 1, clientName: 'Eve', boatName: 'Wave Rider', checkIn: "2022-05-25T06:00:00Z", checkOut: "2022-05-30T06:00:00Z" }
        ];

        mockFindAll(fakeDataReservation);

        const req = { catway: { catwayNumber: 1 } };
        const res = mockResponse();

        await getReservationsByCatway(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(fakeDataReservation)).to.be.true;
    });

    it('devrait renvoyer 500 en cas d’erreur interne', async () => {
        mockFindAllError(new Error('Erreur Mongo'));

        const req = { catway: { catwayNumber: 1 } };

        const res = mockResponse();

        await getReservationsByCatway(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Erreur interne du serveur' })).to.be.true;
    });
});

// -----------------------------
// GET DETAIL RESERVATION BY CATWAY
// -----------------------------
describe('Controller Reservations — getReservationById (niveau-1)', () => {

    afterEachRestore();

    it('200 — renvoie la réservation depuis req.reservation', () => {
        const req = {
            reservation: {
                boatName: 'Sea Breeze',
                clientName: 'Bob'
            }
        };

        const res = mockResponse();

        getReservationById(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(req.reservation)).to.be.true;
    });

    it('500 — erreur interne simulée', () => {
        const req = {};

        // Définir un getter qui jette une erreur quand le contrôleur accède à req.reservation
        Object.defineProperty(req, 'reservation', {
            get() {
                throw new Error('Test error');
            }
        });

        const res = mockResponse();

        getReservationById(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Erreur interne du serveur' })).to.be.true;
    });
});

// -----------------------------
// POST CREATION RESERVATION BY CATWAY
// -----------------------------
describe('Controller Reservations — createReservation (niveau‑1)', () => {

    afterEachRestore();

    // -----------------------------------------------------
    // 201 — création réussie
    // -----------------------------------------------------
    it('201 — crée une réservation et renvoie l’objet créé', async () => {
        const fakeReservation = {
            clientName: 'Alice',
            boatName: 'Sea Breeze',
            checkIn: '2025-05-01T10:00:00Z',
            checkOut: '2025-05-01T12:00:00Z',
            catwayNumber: 1
        };

        // Stub de Reservation.create
        sinon.stub(Reservation, 'create').resolves(fakeReservation);

        const req = {
            body: {
                clientName: 'Alice',
                boatName: 'Sea Breeze',
                checkIn: '2025-05-01T10:00:00Z',
                checkOut: '2025-05-01T12:00:00Z'
            },
            catway: { catwayNumber: 1 }
        };

        const res = mockResponse();

        await createReservation(req, res);

        expect(Reservation.create.calledOnce).to.be.true;
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(fakeReservation)).to.be.true;
    });

    // -----------------------------------------------------
    // 500 — erreur interne simulée
    // -----------------------------------------------------
    it('500 — erreur interne simulée', async () => {
        sinon.stub(Reservation, 'create').throws(new Error('Test error'));

        const req = {
            body: {
                clientName: 'Alice',
                boatName: 'Sea Breeze',
                checkIn: '2025-05-01T10:00:00Z',
                checkOut: '2025-05-01T12:00:00Z'
            },
            catway: { catwayNumber: 1 }
        };

        const res = mockResponse();

        await createReservation(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({
            error: 'Erreur interne du serveur'
        })).to.be.true;
    });
});
