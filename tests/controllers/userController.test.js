const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');

const { mockResponse, afterEachRestore } = require('../mocks/tests.mock');

const User = require('../../src/models/user');
const {
    getUsers,
    createUser,
    patchUser,
    deleteUser
} = require('../../src/controllers/api/userController');

// ---------------------------
// GET /users
// ---------------------------
describe('Contrôleur Users - getUsers (Niveau 1)', () => {

    afterEachRestore();

    it('getUsers → 200 renvoie la liste des utilisateurs', async () => {
        const fakeUsers = [{ name: 'A' }, { name: 'B' }];
        sinon.stub(User, 'find').resolves(fakeUsers);

        const req = {};
        const res = mockResponse();

        await getUsers(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(fakeUsers)).to.be.true;
        // sinon.assert.calledWith(res.status, 200);
        // sinon.assert.calledWith(res.json, fakeUsers);
    });

    it('getUsers → 500 en cas d’erreur interne', async () => {
        sinon.stub(User, 'find').throws(new Error('Test error'));

        const req = {};
        const res = mockResponse();

        await getUsers(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Erreur interne du serveur' })).to.be.true;
    });

});

// ---------------------------
// POST /users
// ---------------------------
describe('Contrôleur Users - createUser (Niveau 1)', () => {

    afterEachRestore();

    it('createUser → 201 hash le mot de passe et renvoie un user sans hash', async () => {
        sinon.stub(bcrypt, 'hash').resolves('hashed');
        sinon.stub(User, 'create').resolves({
            _id: '123',
            name: 'John',
            email: 'john@test.com'
        });

        const req = { body: { name: 'John', email: 'john@test.com', password: '123' } };
        const res = mockResponse();

        await createUser(req, res);

        sinon.assert.calledWith(res.status, 201);
        sinon.assert.calledWithMatch(res.json, {
            message: "Utilisateur créé",
            user: {
                id: '123',
                name: 'John',
                email: 'john@test.com'
            }
        });
    });

    it('createUser → 400 si email déjà utilisé (E11000)', async () => {
        sinon.stub(bcrypt, 'hash').resolves('hashed');
        sinon.stub(User, 'create').throws({ code: 11000 });

        const req = { body: { name: 'John', email: 'john@test.com', password: '123' } };
        const res = mockResponse();

        await createUser(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Email déjà utilisé' })).to.be.true;
    });

    it('createUser → 400 si ValidationError Mongoose', async () => {
        sinon.stub(bcrypt, 'hash').resolves('hashed');
        sinon.stub(User, 'create').throws({ name: 'ValidationError', message: 'Erreur validation' });

        const req = { body: { name: 'John', email: 'john@test.com', password: '123' } };
        const res = mockResponse();

        await createUser(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Erreur validation' })).to.be.true;
    });

    it('createUser → 500 en cas d’erreur interne', async () => {
        sinon.stub(bcrypt, 'hash').resolves('hashed');
        sinon.stub(User, 'create').throws(new Error('Test error'));

        const req = { body: { name: 'John', email: 'john@test.com', password: '123' } };
        const res = mockResponse();

        await createUser(req, res);

        expect(res.status.calledWith(500)).to.be.true;
    });

});

// ---------------------------
// PATCH /users/:id
// ---------------------------
describe('Contrôleur Users - patchUser (Niveau 1)', () => {

    afterEachRestore();

    it('patchUser → 200 met à jour partiellement un utilisateur', async () => {
        const fakeUser = {
            name: 'Old',
            email: 'old@test.com',
            save: sinon.stub().resolves({
                _id: '123',
                name: 'New',
                email: 'old@test.com'
            })
        };

        const req = {
            user: fakeUser,
            body: { name: 'New' }
        };

        const res = mockResponse();

        await patchUser(req, res);

        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledWithMatch(res.json, {
            id: '123',
            name: 'New',
            email: 'old@test.com'
        });
    });

    it('patchUser → 409 si email déjà existant', async () => {
        const fakeUser = {
            name: 'Old',
            email: 'old@test.com',
            save: sinon.stub().throws({ code: 11000 })
        };

        const req = { user: fakeUser, body: { email: 'new@test.com' } };
        const res = mockResponse();

        await patchUser(req, res);

        expect(res.status.calledWith(409)).to.be.true;
    });

    it('patchUser → 500 si erreur interne lors du save()', async () => {
        const fakeUser = {
            name: 'Old',
            email: 'old@test.com',
            save: sinon.stub().throws(new Error('Test error'))
        };

        const req = { user: fakeUser, body: { name: 'New' } };
        const res = mockResponse();

        await patchUser(req, res);

        expect(res.status.calledWith(500)).to.be.true;
    });

});

// ---------------------------
// DELETE /users/:id
// ---------------------------
describe('Contrôleur Users - deleteUser (Niveau 1)', () => {

    afterEachRestore();

    it('deleteUser → 200 supprime un utilisateur', async () => {
        const fakeUser = {
            _id: '123',
            deleteOne: sinon.stub().resolves()
        };

        const req = { user: fakeUser };
        const res = mockResponse();

        await deleteUser(req, res);

        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledWithMatch(res.json, {
            message: "Utilisateur supprimé",
            id: '123'
        });
    });

    it('deleteUser → 500 si erreur interne', async () => {
        const fakeUser = {
            _id: '123',
            deleteOne: sinon.stub().throws(new Error('Test error'))
        };

        const req = { user: fakeUser };
        const res = mockResponse();

        await deleteUser(req, res);

        expect(res.status.calledWith(500)).to.be.true;
    });

});
