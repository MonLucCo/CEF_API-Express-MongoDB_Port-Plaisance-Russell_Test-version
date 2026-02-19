const { expect } = require('chai');
const mongoose = require('mongoose');

const { mockResponse, afterEachRestore } = require('../mocks/tests.mock');
const {
    mockFindAll,
    mockFindAllError,
    mockFindById,
    mockFindByIdError,
} = require('../mocks/catway.mock');

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
        const req = { params: { id: '123' } };
        const res = mockResponse();

        await getCatwayById(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({ error: 'ID catway invalide' })).to.be.true;
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
});
