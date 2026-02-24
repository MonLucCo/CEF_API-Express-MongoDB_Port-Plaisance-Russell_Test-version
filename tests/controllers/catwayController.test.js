const { expect } = require('chai');
const sinon = require('sinon');

const { mockResponse, afterEachRestore } = require('../mocks/tests.mock');
const {
    mockFindAll,
    mockFindAllError,
} = require('../mocks/catway.mock');

const Catway = require('../../src/models/catway');

const {
    getAllCatways,
    getCatwayById,
    createCatway,
    updateCatway,
    patchCatway,
} = require('../../src/controllers/catwayController');

// ----------------------------- 
// GET ALL CATWAYS
// -----------------------------
describe('Controller Catways — getAllCatways (niveau‑1)', () => {

    afterEachRestore();

    it('devrait renvoyer 200 et la liste des catways', async () => {
        const fakeData = [
            { catwayNumber: 1, type: 'short', catwayState: 'bon état' },
            { catwayNumber: 2, type: 'long', catwayState: 'bon état' },
            { catwayNumber: 3, type: 'long', catwayState: 'en réparation' }
        ];

        mockFindAll(fakeData);

        const req = {};
        const res = mockResponse();

        await getAllCatways(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(fakeData)).to.be.true;
    });

    it('devrait renvoyer 500 en cas d’erreur interne', async () => {
        mockFindAllError(new Error('Erreur Mongo'));

        const req = {};
        const res = mockResponse();

        await getAllCatways(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Erreur interne du serveur' })).to.be.true;
    });
});

// -----------------------------
// GET CATWAY BY ID
// -----------------------------
describe('Controller Catways — getCatwayById (niveau‑1)', () => {

    it('retourne 200 si catway trouvé et attaché par les middlewares', () => {
        const req = { catway: { catwayNumber: 7 } };
        const res = mockResponse();

        getCatwayById(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ catwayNumber: 7 })).to.be.true;
    });

});

// -----------------------------
// POST CATWAY
// -----------------------------
describe('Controller Catways — createCatway (niveau‑1)', () => {

    afterEachRestore();

    it('retourne 201 si le catway est créé', async () => {
        const fakeCatway = { catwayNumber: 1, type: 'short', catwayState: 'bon état' };
        sinon.stub(Catway, 'create').resolves(fakeCatway);

        const req = { body: fakeCatway };
        const res = mockResponse();

        await createCatway(req, res);

        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(fakeCatway)).to.be.true;
    });

    it('retourne 409 si catwayNumber existe déjà (E11000)', async () => {
        sinon.stub(Catway, 'create').throws({ code: 11000 });

        const req = { body: { catwayNumber: 1, type: 'short', catwayState: 'bon état' } };
        const res = mockResponse();

        await createCatway(req, res);

        expect(res.status.calledWith(409)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'catwayNumber déjà existant' })).to.be.true;
    });

    it('retourne 500 si une erreur interne survient', async () => {
        sinon.stub(Catway, 'create').throws(new Error('Erreur Mongo'));

        const req = { body: { catwayNumber: 1, type: 'short', catwayState: 'bon état' } };
        const res = mockResponse();

        await createCatway(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Erreur interne du serveur' })).to.be.true;
    });

});

// -----------------------------
// PUT CATWAY BY ID
// -----------------------------
describe('Controller Catways — updateCatway (niveau‑1)', () => {

    afterEachRestore();

    it('retourne 200 si la mise à jour réussit', async () => {
        const fakeCatway = {
            catwayNumber: 1,
            type: 'short',
            catwayState: 'bon état',
            save: sinon.stub().resolves({
                catwayNumber: 99,
                type: 'long',
                catwayState: 'neuf'
            })
        };

        const req = {
            catway: fakeCatway,
            body: {
                catwayNumber: 99,
                type: 'long',
                catwayState: 'neuf'
            }
        };

        const res = mockResponse();

        await updateCatway(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({ catwayNumber: 99 })).to.be.true;
    });

    it('retourne 409 si catwayNumber existe déjà (E11000)', async () => {
        const fakeCatway = {
            save: sinon.stub().throws({ code: 11000 })
        };

        const req = { catway: fakeCatway, body: {} };
        const res = mockResponse();

        await updateCatway(req, res);

        expect(res.status.calledWith(409)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'catwayNumber déjà existant' })).to.be.true;
    });

    it('retourne 500 si une erreur interne survient', async () => {
        const fakeCatway = {
            save: sinon.stub().throws(new Error('Erreur interne'))
        };

        const req = { catway: fakeCatway, body: {} };
        const res = mockResponse();

        await updateCatway(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Erreur interne du serveur' })).to.be.true;
    });

});

// -----------------------------
// PATCH CATWAY BY ID
// -----------------------------
describe('Controller Catways – patchCatway (niveau‑1)', () => {

    afterEach(() => sinon.restore());

    it('retourne 200 si la mise à jour partielle réussit', async () => {
        const fakeCatway = {
            catwayNumber: 1,
            type: 'short',
            catwayState: 'bon état',
            save: sinon.stub().resolves({
                catwayNumber: 1,
                type: 'long',
                catwayState: 'bon état'
            })
        };

        const req = {
            catway: fakeCatway,
            body: { type: 'long' }
        };

        const res = mockResponse();

        await patchCatway(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({ type: 'long' })).to.be.true;
    });

    it('retourne 409 si catwayNumber existe déjà (E11000)', async () => {
        const fakeCatway = {
            save: sinon.stub().throws({ code: 11000 })
        };

        const req = { catway: fakeCatway, body: { catwayNumber: 2 } };
        const res = mockResponse();

        await patchCatway(req, res);

        expect(res.status.calledWith(409)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'catwayNumber déjà existant' })).to.be.true;
    });

    it('retourne 500 si une erreur interne survient', async () => {
        const fakeCatway = {
            save: sinon.stub().throws(new Error('Erreur interne'))
        };

        const req = { catway: fakeCatway, body: { type: 'long' } };
        const res = mockResponse();

        await patchCatway(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Erreur interne du serveur' })).to.be.true;
    });

});

