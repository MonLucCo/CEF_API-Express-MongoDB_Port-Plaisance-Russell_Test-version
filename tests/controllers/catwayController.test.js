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

    it('retourne 200 si catway trouvé et attaché par les middlewares', () => {
        const req = { catway: { catwayNumber: 7 } };
        const res = mockResponse();

        getCatwayById(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ catwayNumber: 7 })).to.be.true;
    });

});
