const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const { mockFindOne, mockCreate, mockDelete } = require('../mocks/user.mock');

const { register, login, deleteUser } = require('../../src/controllers/authController');
const User = require('../../src/models/user');

describe('authController – tests niveau 1', () => {

    afterEach(() => {
        sinon.restore();
    });

    // -----------------------------
    // LOGIN
    // -----------------------------
    describe('login()', () => {

        it('retourne 400 si champs manquants', async () => {
            const req = { body: { email: '' } };
            const res = mockResponse();

            await login(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ error: "Email et mot de passe requis" })).to.be.true;
        });

        it('retourne 401 si utilisateur inexistant', async () => {
            mockFindOne(null);

            const req = { body: { email: 'x@test.com', password: '1234' } };
            const res = mockResponse();

            await login(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWithMatch({ error: "Identifiants invalides" })).to.be.true;
        });

        it('retourne 401 si mot de passe incorrect', async () => {
            const fakeUser = { comparePassword: sinon.stub().resolves(false) };
            mockFindOne(fakeUser);

            const req = { body: { email: 'x@test.com', password: 'wrong' } };
            const res = mockResponse();

            await login(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWithMatch({ error: "Identifiants invalides" })).to.be.true;
        });

        it('retourne 200 et un token si identifiants valides', async () => {
            const fakeUser = {
                _id: '123',
                comparePassword: sinon.stub().resolves(true)
            };

            mockFindOne(fakeUser);
            sinon.stub(jwt, 'sign').returns('header.payload.signature');

            const req = { body: { email: 'x@test.com', password: '1234' } };
            const res = mockResponse();

            await login(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ token: 'header.payload.signature' })).to.be.true;
        });

        it('retourne 500 en cas d’erreur interne', async () => {
            sinon.stub(User, 'findOne').throws(new Error('DB error'));

            const req = { body: { email: 'x@test.com', password: '1234' } };
            const res = mockResponse();

            await login(req, res);

            expect(res.status.calledWith(500)).to.be.true;
        });

    });

    // -----------------------------
    // REGISTER
    // -----------------------------
    describe('register()', () => {

        it('retourne 400 si champs manquants', async () => {
            const req = { body: { email: 'x@test.com' } };
            const res = mockResponse();

            await register(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });

        it('retourne 400 si ValidationError', async () => {
            const error = new Error('Validation failed');
            error.name = 'ValidationError';

            sinon.stub(User, 'create').throws(error);

            const req = { body: { name: 'X', email: 'x@test.com', password: '1234' } };
            const res = mockResponse();

            await register(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });

        it('retourne 201 si création valide', async () => {
            mockCreate({ _id: '123', name: 'X' });

            const req = { body: { name: 'X', email: 'x@test.com', password: '1234' } };
            const res = mockResponse();

            await register(req, res);

            expect(res.status.calledWith(201)).to.be.true;
        });

        it('retourne 500 en cas d’erreur interne', async () => {
            sinon.stub(User, 'create').throws(new Error('DB error'));

            const req = { body: { name: 'X', email: 'x@test.com', password: '1234' } };
            const res = mockResponse();

            await register(req, res);

            expect(res.status.calledWith(500)).to.be.true;
        });

    });

    // -----------------------------
    // DELETE USER
    // -----------------------------
    describe('deleteUser()', () => {

        it('retourne 404 si utilisateur introuvable', async () => {
            mockDelete(null);

            const req = { params: { id: '123' } };
            const res = mockResponse();

            await deleteUser(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });

        it('retourne 200 si suppression valide', async () => {
            mockDelete({ _id: '123' });

            const req = { params: { id: '123' } };
            const res = mockResponse();

            await deleteUser(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('retourne 500 en cas d’erreur interne', async () => {
            sinon.stub(User, 'findByIdAndDelete').throws(new Error('DB error'));

            const req = { params: { id: '123' } };
            const res = mockResponse();

            await deleteUser(req, res);

            expect(res.status.calledWith(500)).to.be.true;
        });

    });

});

// -----------------------------
// MOCK RESPONSE
// -----------------------------
function mockResponse() {
    return {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
    };
}
