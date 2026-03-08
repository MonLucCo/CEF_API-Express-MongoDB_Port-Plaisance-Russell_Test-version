const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const {
    validateReservationId,
    resolveReservationIdentifier,
    validateReservationPayload
} = require('../../src/middlewares/reservationMiddleware');

const {
    mockFindById,
    mockFindByIdError,
} = require('../mocks/reservation.mock');

const {
    mockResponse,
    mockNext,
    afterEachRestore,
} = require('../mocks/tests.mock');

// -----------------------------------------------------
// validateReservationId
// -----------------------------------------------------
describe('Middleware Reservations — validateReservationId (niveau‑1)', () => {

    afterEachRestore();

    it('400 — identifiant invalide', () => {
        const req = { params: { idReservation: 'abc' } };
        const res = mockResponse();
        const next = mockNext();

        validateReservationId(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(next.called).to.be.false;
    });

    it('next() — identifiant valide', () => {
        const validId = new mongoose.Types.ObjectId().toString();

        const req = { params: { idReservation: validId } };
        const res = mockResponse();
        const next = mockNext();

        validateReservationId(req, res, next);

        expect(next.calledOnce).to.be.true;
        expect(res.status.called).to.be.false;
    });
});

// -----------------------------------------------------
// resolveReservationIdentifier
// -----------------------------------------------------
describe('Middleware Reservations — resolveReservationIdentifier (niveau‑1)', () => {

    afterEachRestore();

    it('404 — réservation introuvable', async () => {
        mockFindById(null);

        const req = {
            params: { idReservation: new mongoose.Types.ObjectId() },
            catway: { catwayNumber: 1 }
        };
        const res = mockResponse();
        const next = mockNext();

        await resolveReservationIdentifier(req, res, next);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(next.called).to.be.false;
    });

    it('404 — réservation non associée à ce catway', async () => {
        mockFindById({ catwayNumber: 2 });

        const req = {
            params: { idReservation: new mongoose.Types.ObjectId() },
            catway: { catwayNumber: 1 }
        };
        const res = mockResponse();
        const next = mockNext();

        await resolveReservationIdentifier(req, res, next);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(next.called).to.be.false;
    });

    it('next() — réservation trouvée et cohérente', async () => {
        const fakeReservation = { catwayNumber: 1 };
        mockFindById(fakeReservation);

        const req = {
            params: { idReservation: new mongoose.Types.ObjectId() },
            catway: { catwayNumber: 1 }
        };
        const res = mockResponse();
        const next = mockNext();

        await resolveReservationIdentifier(req, res, next);

        expect(req.reservation).to.equal(fakeReservation);
        expect(next.calledOnce).to.be.true;
        expect(res.status.called).to.be.false;
    });

    it('500 — erreur interne simulée', async () => {
        mockFindByIdError();

        const req = {
            params: { idReservation: new mongoose.Types.ObjectId() },
            catway: { catwayNumber: 1 }
        };
        const res = mockResponse();
        const next = mockNext();

        await resolveReservationIdentifier(req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(next.called).to.be.false;
    });
});

// -----------------------------------------------------
// validateReservationPayload
// -----------------------------------------------------
describe('Middleware Reservations — validateReservationPayload (niveau‑1)', () => {

    afterEachRestore();

    // -----------------------------------------------------
    // 400 — catwayNumber ne doit pas être fourni
    // -----------------------------------------------------
    it('400 — catwayNumber ne doit pas être fourni dans le payload', () => {
        const req = {
            body: {
                clientName: 'Alice',
                boatName: 'Sea Breeze',
                checkIn: '2025-05-01T10:00:00Z',
                checkOut: '2025-05-01T12:00:00Z',
                catwayNumber: 99
            }
        };

        const res = mockResponse();
        const next = mockNext();

        validateReservationPayload(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({
            error: 'Le champ catwayNumber ne doit pas être fourni dans le payload'
        })).to.be.true;
        expect(next.called).to.be.false;
    });

    // -----------------------------------------------------
    // 400 — champs obligatoires manquants
    // -----------------------------------------------------
    it('400 — champs obligatoires manquants', () => {
        const req = { body: {} };
        const res = mockResponse();
        const next = mockNext();

        validateReservationPayload(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({
            error: 'Les champs clientName, boatName, checkIn et checkOut sont obligatoires'
        })).to.be.true;
        expect(next.called).to.be.false;
    });

    // -----------------------------------------------------
    // 400 — dates invalides
    // -----------------------------------------------------
    it('400 — dates invalides', () => {
        const req = {
            body: {
                clientName: 'Alice',
                boatName: 'Sea Breeze',
                checkIn: 'not-a-date',
                checkOut: '2025-05-01T12:00:00Z'
            }
        };

        const res = mockResponse();
        const next = mockNext();

        validateReservationPayload(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({
            error: 'Les champs checkIn et checkOut doivent être des dates valides'
        })).to.be.true;
        expect(next.called).to.be.false;
    });

    // -----------------------------------------------------
    // 400 — checkIn >= checkOut
    // -----------------------------------------------------
    it('400 — checkIn doit être strictement inférieur à checkOut', () => {
        const req = {
            body: {
                clientName: 'Alice',
                boatName: 'Sea Breeze',
                checkIn: '2025-05-01T12:00:00Z',
                checkOut: '2025-05-01T12:00:00Z'
            }
        };

        const res = mockResponse();
        const next = mockNext();

        validateReservationPayload(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({
            error: 'La date checkIn doit être strictement inférieure à checkOut'
        })).to.be.true;
        expect(next.called).to.be.false;
    });

    // -----------------------------------------------------
    // next() — payload valide
    // -----------------------------------------------------
    it('next() — payload valide', () => {
        const req = {
            body: {
                clientName: 'Alice',
                boatName: 'Sea Breeze',
                checkIn: '2025-05-01T10:00:00Z',
                checkOut: '2025-05-01T12:00:00Z'
            }
        };

        const res = mockResponse();
        const next = mockNext();

        validateReservationPayload(req, res, next);

        expect(next.calledOnce).to.be.true;
        expect(res.status.called).to.be.false;
    });
});
