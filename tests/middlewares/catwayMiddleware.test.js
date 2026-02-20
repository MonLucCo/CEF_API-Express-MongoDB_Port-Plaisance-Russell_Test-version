
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const { mockResponse, mockNext, afterEachRestore } = require('../mocks/tests.mock');

const Catway = require('../../src/models/catway');
const {
    resolveCatwayIdentifier,
    validateCatwayId
} = require('../../src/middlewares/catwayMiddleware');

describe('Middleware Catways — validateCatwayId (niveau‑1)', () => {

    it('retourne 400  si id invalide (ni un ObjectId ni un nombre)', () => {
        const req = { params: { id: 'abc123' } };
        const res = mockResponse();
        const next = mockNext();

        validateCatwayId(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(next.called).to.be.false;
    });

    it('laisse passer un ObjectId valide', () => {
        const validObjectId = new mongoose.Types.ObjectId().toString();
        const req = { params: { id: validObjectId } };
        const res = mockResponse();
        const next = mockNext();

        validateCatwayId(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

    it('laisse passer un catwayNumber valide', () => {
        const req = { params: { id: '12' } };
        const res = mockResponse();
        const next = mockNext();

        validateCatwayId(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

});

describe('Middleware Catways — resolveCatwayIdentifier (niveau‑1)', () => {

    afterEachRestore();

    it('attache le catway trouvé via ObjectId', async () => {
        const fakeCatway = { catwayNumber: 1 };
        sinon.stub(Catway, 'findById').resolves(fakeCatway);

        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
        const res = mockResponse();
        const next = mockNext();

        await resolveCatwayIdentifier(req, res, next);

        expect(req.catway).to.equal(fakeCatway);
        expect(next.calledOnce).to.be.true;
    });

    it('attache le catway trouvé via catwayNumber', async () => {
        const fakeCatway = { catwayNumber: 7 };
        sinon.stub(Catway, 'findOne').resolves(fakeCatway);

        const req = { params: { id: '7' } };
        const res = mockResponse();
        const next = mockNext();

        await resolveCatwayIdentifier(req, res, next);

        expect(req.catway).to.equal(fakeCatway);
        expect(next.calledOnce).to.be.true;
    });

    it('retourne 404 si catway introuvable', async () => {
        sinon.stub(Catway, 'findOne').resolves(null);

        const req = { params: { id: '99' } };
        const res = mockResponse();
        const next = mockNext();

        await resolveCatwayIdentifier(req, res, next);

        expect(res.status.calledWith(404)).to.be.true;
        expect(next.called).to.be.false;
    });

    it('retourne 500 si erreur interne', async () => {
        sinon.stub(Catway, 'findOne').throws(new Error('Erreur Mongo'));

        const req = { params: { id: '7' } };
        const res = mockResponse();
        const next = mockNext();

        await resolveCatwayIdentifier(req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(next.called).to.be.false;
    });

    it('n’appelle pas findOne si ObjectId valide', async () => {
        sinon.stub(Catway, 'findById').resolves({ catwayNumber: 1 });
        const spy = sinon.spy(Catway, 'findOne');

        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
        const res = mockResponse();
        const next = mockNext();

        await resolveCatwayIdentifier(req, res, next);

        expect(spy.notCalled).to.be.true;
    });

});
