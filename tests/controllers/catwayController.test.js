const { expect } = require('chai');
const { mockResponse, afterEachRestore } = require('../mocks/tests.mock');
const { mockFindAll, mockFindAllError } = require('../mocks/catway.mock');
const { getAllCatways } = require('../../src/controllers/catwayController');

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
