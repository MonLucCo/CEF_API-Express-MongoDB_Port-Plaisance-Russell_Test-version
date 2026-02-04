const { expect } = require('chai');
const sinon = require('sinon');

const { mockResponse, mockNext } = require('../mocks/tests.mock');
const { mockJwtVerify, mockJwtVerifyError } = require('../mocks/jwt.mock');

const authMiddleware = require('../../src/middlewares/authMiddleware');

describe('authMiddleware – tests niveau 1', () => {

    afterEach(() => {
        sinon.restore();
    });

    it('retourne 401 si aucun token n’est fourni', () => {
        const req = { headers: {} };
        const res = mockResponse();
        const next = mockNext();

        authMiddleware(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(next.called).to.be.false;
    });

    it('retourne 401 si le token est invalide', () => {
        mockJwtVerifyError({ name: 'JsonWebTokenError' });

        const req = { headers: { authorization: 'Bearer invalidtoken' } };
        const res = mockResponse();
        const next = mockNext();

        authMiddleware(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Token invalide' })).to.be.true;
        expect(next.called).to.be.false;
    });

    it('retourne 401 si le token est expiré', () => {
        mockJwtVerifyError({ name: 'TokenExpiredError' });

        const req = { headers: { authorization: 'Bearer expiredtoken' } };
        const res = mockResponse();
        const next = mockNext();

        authMiddleware(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Token expiré' })).to.be.true;
        expect(next.called).to.be.false;
    });

    it('appelle next() si le token est valide', () => {
        mockJwtVerify({ userId: '123' });

        const req = { headers: { authorization: 'Bearer validtoken' } };
        const res = mockResponse();
        const next = mockNext();

        authMiddleware(req, res, next);

        expect(req.userId).to.equal('123');
        expect(next.calledOnce).to.be.true;
    });

    it('retourne 500 en cas d’erreur interne', () => {
        mockJwtVerifyError(new Error('Unexpected error'));

        const req = { headers: { authorization: 'Bearer sometoken' } };
        const res = mockResponse();
        const next = mockNext();

        authMiddleware(req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Erreur interne lors de la vérification du token' })).to.be.true;
        expect(next.called).to.be.false;
    });

});
