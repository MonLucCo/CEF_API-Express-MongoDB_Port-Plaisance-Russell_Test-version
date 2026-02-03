// Utilitaires de mock pour le modèle User (tests unitaires)

const sinon = require('sinon');
const User = require('../../src/models/user');

// --- SUCCESS CASES ---

function mockFindOne(result) {
    return sinon.stub(User, 'findOne').resolves(result);
}

function mockCreate(result) {
    return sinon.stub(User, 'create').resolves(result);
}

function mockDelete(result) {
    return sinon.stub(User, 'findByIdAndDelete').resolves(result);
}

// --- ERROR CASES ---

function mockFindOneError(error = new Error('DB error')) {
    return sinon.stub(User, 'findOne').throws(error);
}

function mockCreateError(error = new Error('DB error')) {
    return sinon.stub(User, 'create').throws(error);
}

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
