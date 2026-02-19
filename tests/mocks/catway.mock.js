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

/**
 * Stub de Catway.findById() retournant un résultat simulé.
 * @param {Object} result - Catway simulé
 */
function mockFindById(result) {
    return sinon.stub(Catway, 'findById').resolves(result);
}

/**
 * Stub de Catway.findById() lançant une erreur simulée.
 * @param {Error} [error] - Erreur simulée
 */
function mockFindByIdError(error = new Error('DB error')) {
    return sinon.stub(Catway, 'findById').throws(error);
}

module.exports = {
    mockFindAll,
    mockFindAllError,
    mockFindById,
    mockFindByIdError
};
