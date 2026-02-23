const { expect } = require('chai');
const { mockResponse, mockNext } = require('../mocks/tests.mock');

const {
    validateCatwayPayload,
    validateCatwayPartialPayload
} = require('../../src/middlewares/catwayPayloadMiddleware');

describe('Middleware Catways — validateCatwayPayload (niveau‑1)', () => {

    it('retourne 400 si un champ requis est manquant', () => {
        const req = { body: { type: 'short', catwayState: 'bon état' } };
        const res = mockResponse();
        const next = mockNext();

        validateCatwayPayload(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(next.called).to.be.false;
    });

    it('retourne 400 si catwayNumber n’est pas un entier positif', () => {
        const req = { body: { catwayNumber: -1, type: 'short', catwayState: 'bon état' } };
        const res = mockResponse();
        const next = mockNext();

        validateCatwayPayload(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(next.called).to.be.false;
    });

    it('retourne 400 si type est invalide', () => {
        const req = { body: { catwayNumber: 1, type: 'medium', catwayState: 'bon état' } };
        const res = mockResponse();
        const next = mockNext();

        validateCatwayPayload(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(next.called).to.be.false;
    });

    it('retourne 400 si catwayState est vide', () => {
        const req = { body: { catwayNumber: 1, type: 'short', catwayState: '' } };
        const res = mockResponse();
        const next = mockNext();

        validateCatwayPayload(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(next.called).to.be.false;
    });

    it('laisse passer un payload valide', () => {
        const req = { body: { catwayNumber: 1, type: 'short', catwayState: 'bon état' } };
        const res = mockResponse();
        const next = mockNext();

        validateCatwayPayload(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

});

describe('Middleware Catways — validateCatwayPartialPayload (niveau‑1)', () => {

    it('laisse toujours passer (placeholder)', () => {
        const req = { body: {} };
        const res = mockResponse();
        const next = mockNext();

        validateCatwayPartialPayload(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

});
