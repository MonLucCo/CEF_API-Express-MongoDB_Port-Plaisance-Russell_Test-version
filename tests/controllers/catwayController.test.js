const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const { mockResponse, afterEachRestore } = require('../mocks/tests.mock');
const {
    mockFindAll,
    mockFindAllError,
    mockFindById,
    mockFindByIdError,
} = require('../mocks/catway.mock');

const Catway = require('../../src/models/catway');

const {
    getAllCatways,
    getCatwayById,
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

    afterEachRestore();

    it('retourne 400 si ID invalide', async () => {
        const req = { params: { id: 'ab123' } };
        const res = mockResponse();

        await getCatwayById(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Identifiant catway invalide' })).to.be.true;
    });

    it('retourne 404 si catway introuvable', async () => {
        const validId = new mongoose.Types.ObjectId();
        mockFindById(null);

        const req = { params: { id: validId.toString() } };
        const res = mockResponse();

        await getCatwayById(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Catway introuvable' })).to.be.true;
    });

    it('retourne 200 si catway trouvé', async () => {
        const validId = new mongoose.Types.ObjectId();
        const fakeCatway = { _id: validId, catwayNumber: 1 };

        mockFindById(fakeCatway);

        const req = { params: { id: validId.toString() } };
        const res = mockResponse();

        await getCatwayById(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(fakeCatway)).to.be.true;
    });

    it('retourne 500 en cas d’erreur interne', async () => {
        const validId = new mongoose.Types.ObjectId();
        mockFindByIdError(new Error('Erreur Mongo'));

        const req = { params: { id: validId.toString() } };
        const res = mockResponse();

        await getCatwayById(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'Erreur interne du serveur' })).to.be.true;
    });

    // --------------------------------------
    // Tests supplémentaires pour la logique hybride (issue‑26, étape 2)
    // --------------------------------------
    it('retourne 200 si catway trouvé via catwayNumber', async () => {
        const fakeCatway = { catwayNumber: 12, type: 'short' };

        // On stub findOne car la logique hybride utilise findOne()
        const stub = sinon.stub(Catway, 'findOne').resolves(fakeCatway);

        const req = { params: { id: '12' } };
        const res = mockResponse();

        await getCatwayById(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(fakeCatway)).to.be.true;

        stub.restore();
    });

    it('retourne 404 si catwayNumber valide mais introuvable', async () => {
        const stub = sinon.stub(Catway, 'findOne').resolves(null);

        const req = { params: { id: '99' } };
        const res = mockResponse();

        await getCatwayById(req, res);

        expect(res.status.calledWith(404)).to.be.true;

        stub.restore();
    });

    it('retourne 400 si id n’est ni un ObjectId ni un nombre', async () => {
        const req = { params: { id: 'abc123xyz' } };
        const res = mockResponse();

        await getCatwayById(req, res);

        expect(res.status.calledWith(400)).to.be.true;
    });

});
