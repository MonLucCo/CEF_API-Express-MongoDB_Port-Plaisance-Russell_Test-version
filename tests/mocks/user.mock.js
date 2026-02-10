const sinon = require('sinon');
const User = require('../../src/models/user');

/**
 * Stub de User.findOne() retournant un résultat simulé.
 * @param {Object|null} result - Utilisateur simulé ou null
 */
function mockFindOne(result) {
    return sinon.stub(User, 'findOne').resolves(result);
}

/**
 * Stub de User.create() retournant un résultat simulé.
 * @param {Object} result - Utilisateur créé simulé
 */
function mockCreate(result) {
    return sinon.stub(User, 'create').resolves(result);
}

/**
 * Stub de User.findByIdAndDelete() retournant un résultat simulé.
 * @param {Object|null} result - Utilisateur supprimé simulé ou null
 */
function mockDelete(result) {
    return sinon.stub(User, 'findByIdAndDelete').resolves(result);
}

/**
 * Stub de User.findOne() lançant une erreur simulée.
 * @param {Error} [error] - Erreur simulée
 */
function mockFindOneError(error = new Error('DB error')) {
    return sinon.stub(User, 'findOne').throws(error);
}

/**
 * Stub de User.create() lançant une erreur simulée.
 * @param {Error} [error] - Erreur simulée
 */
function mockCreateError(error = new Error('DB error')) {
    return sinon.stub(User, 'create').throws(error);
}

/**
 * Stub de User.findByIdAndDelete() lançant une erreur simulée.
 * @param {Error} [error] - Erreur simulée
 */
function mockDeleteError(error = new Error('DB error')) {
    return sinon.stub(User, 'findByIdAndDelete').throws(error);
}

module.exports = {
    mockFindOne,
    mockCreate,
    mockDelete,
    mockFindOneError,
    mockCreateError,
    mockDeleteError
};
