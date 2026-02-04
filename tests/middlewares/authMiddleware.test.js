const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../../src/middlewares/authMiddleware');

// Helper pour simuler res.status().json()
function mockResponse() {
    return {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
    };
}

describe('authMiddleware – tests niveau 1', () => {

    afterEach(() => {
        sinon.restore();
    });

    it('retourne 401 si aucun token n’est fourni', () => {
        const req = { headers: {} };
        const res = mockResponse();
        const next = sinon.spy();

        authMiddleware(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(next.called).to.be.false;
    });

    it('retourne 401 si le token est invalide', () => {
        sinon.stub(jwt, 'verify').throws({ name: 'JsonWebTokenError' });

        const req = { headers: { authorization: 'Bearer invalidtoken' } };
        const res = mockResponse();
        const next = sinon.spy();

        authMiddleware(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Token invalide' })).to.be.true;
        expect(next.called).to.be.false;
    });

    it('retourne 401 si le token est expiré', () => {
        sinon.stub(jwt, 'verify').throws({ name: 'TokenExpiredError' });

        const req = { headers: { authorization: 'Bearer expiredtoken' } };
        const res = mockResponse();
        const next = sinon.spy();

        authMiddleware(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Token expiré' })).to.be.true;
        expect(next.called).to.be.false;
    });

    it('appelle next() si le token est valide', () => {
        sinon.stub(jwt, 'verify').returns({ userId: '123' });

        const req = { headers: { authorization: 'Bearer validtoken' } };
        const res = mockResponse();
        const next = sinon.spy();

        authMiddleware(req, res, next);

        expect(req.userId).to.equal('123');
        expect(next.calledOnce).to.be.true;
    });

    it('retourne 500 en cas d’erreur interne', () => {
        sinon.stub(jwt, 'verify').throws(new Error('Unexpected error'));

        const req = { headers: { authorization: 'Bearer sometoken' } };
        const res = mockResponse();
        const next = sinon.spy();

        authMiddleware(req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Erreur interne lors de la vérification du token' })).to.be.true;
        expect(next.called).to.be.false;
    });

});
