const sinon = require('sinon');
const Catway = require('../../src/models/catway');

/**
 * Stub de Catway.find() retournant un résultat simulé.
 * @param {Array<Object>} result - Liste simulée de catways
 */
function mockFindAll(result) {
    return sinon.stub(Catway, 'find').resolves(result);
}

/**
 * Stub de Catway.find() lançant une erreur simulée.
 * @param {Error} [error] - Erreur simulée
 */
function mockFindAllError(error = new Error('DB error')) {
    return sinon.stub(Catway, 'find').throws(error);
}

module.exports = {
    mockFindAll,
    mockFindAllError
};
