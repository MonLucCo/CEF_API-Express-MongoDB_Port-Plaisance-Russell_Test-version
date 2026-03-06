const sinon = require('sinon');
const Reservation = require('../../src/models/reservation');

/**
 * Stub de Reservation.find() retournant un résultat simulé.
 * @param {Array<Object>} result - Liste simulée de réservations
 */
function mockFindAll(result) {
    return sinon.stub(Reservation, 'find').resolves(result);
}

/**
 * Stub de Reservation.find() lançant une erreur simulée.
 * @param {Error} [error] - Erreur simulée
 */
function mockFindAllError(error = new Error('DB error')) {
    return sinon.stub(Reservation, 'find').throws(error);
}

/**
 * Stub de Reservation.findById() retournant un résultat simulé.
 * @param {Object} result - Reservation simulée
 */
function mockFindById(result) {
    return sinon.stub(Reservation, 'findById').resolves(result);
}

/**
 * Stub de Reservation.findById() lançant une erreur simulée.
 * @param {Error} [error] - Erreur simulée
 */
function mockFindByIdError(error = new Error('DB error')) {
    return sinon.stub(Reservation, 'findById').throws(error);
}

module.exports = {
    mockFindAll,
    mockFindAllError,
    mockFindById,
    mockFindByIdError
};
