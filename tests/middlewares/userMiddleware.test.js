const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const { mockResponse, mockNext, afterEachRestore } = require('../mocks/tests.mock');

const User = require('../../src/models/user');
const {
    validateUserId,
    resolveUserIdentifier,
    validateUserPayload,
    validateUserPayloadPartial
} = require('../../src/middlewares/userMiddleware');

// -----------------------------------------------------
// validateUserId
// -----------------------------------------------------
describe('Middleware Users — validateUserId (niveau‑1)', () => {

    afterEachRestore();

    it('next() — si identifiant valide', () => {
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
        const res = mockResponse();
        const next = mockNext();

        validateUserId(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

    it('400 - si id invalide', () => {
        const req = { params: { id: 'abc' } };
        const res = mockResponse();
        const next = mockNext();

        validateUserId(req, res, next);

        sinon.assert.calledWith(res.status, 400);
        sinon.assert.notCalled(next);
    });

});

// -----------------------------------------------------
// resolveUserIdentifier
// -----------------------------------------------------
describe('Middleware Users — resolveUserIdentifier (niveau‑1)', () => {

    afterEachRestore();

    it('next() - attache req.user', async () => {
        sinon.stub(User, 'findById').resolves({ name: 'John' });

        const req = { params: { id: new mongoose.Types.ObjectId() } };
        const res = mockResponse();
        const next = mockNext();

        await resolveUserIdentifier(req, res, next);

        sinon.assert.calledOnce(next);
        sinon.assert.match(req.user, { name: 'John' });
    });

    it('404 - si utilisateur introuvable', async () => {
        sinon.stub(User, 'findById').resolves(null);

        const req = { params: { id: new mongoose.Types.ObjectId() } };
        const res = mockResponse();
        const next = mockNext();

        await resolveUserIdentifier(req, res, next);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(next.called).to.be.false;
    });

    it('500 - si erreur interne', async () => {
        sinon.stub(User, 'findById').throws(new Error('Test error'));

        const req = { params: { id: new mongoose.Types.ObjectId() } };
        const res = mockResponse();
        const next = mockNext();

        await resolveUserIdentifier(req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
    });

});

// -----------------------------------------------------
// validateUserPayload
// -----------------------------------------------------
describe('Middleware Users — validateUserPayload (niveau‑1)', () => {

    afterEachRestore();

    it('next() - si payload valide', () => {
        const req = { body: { name: 'John', email: 'john@test.com', password: '123' } };
        const res = mockResponse();
        const next = mockNext();

        validateUserPayload(req, res, next);

        expect(next.calledOnce).to.be.true;
        expect(res.status.called).to.be.false;
    });

    it('400 - si champs manquants', () => {
        const req = { body: { name: 'A' } };
        const res = mockResponse();
        const next = mockNext();

        validateUserPayload(req, res, next);

        sinon.assert.calledWith(res.status, 400);
    });

});

// -----------------------------------------------------
// validateUserPayloadPartial
// -----------------------------------------------------
describe('Middleware Users — validateUserPayloadPartial (niveau‑1)', () => {

    afterEachRestore();

    it('next() - si payload partiel valide', () => {
        const req = { body: { name: 'New Name' } };
        const res = mockResponse();
        const next = mockNext();

        validateUserPayloadPartial(req, res, next);

        expect(next.calledOnce).to.be.true;
        expect(res.status.called).to.be.false;
    });

    it('validateUserPayloadPartial → 400 si aucun champ', () => {
        const req = { body: {} };
        const res = mockResponse();
        const next = mockNext();

        validateUserPayloadPartial(req, res, next);

        sinon.assert.calledWith(res.status, 400);
    });

    it('validateUserPayloadPartial → 400 si name n’est pas une string', () => {
        const req = { body: { name: 123 } };
        const res = mockResponse();
        const next = mockNext();

        validateUserPayloadPartial(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
    });

});
