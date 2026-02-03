// Utilitaires de mock pour le modèle User (tests unitaires)

const sinon = require('sinon');
const User = require('../../src/models/user');

function mockFindOne(result) {
    return sinon.stub(User, 'findOne').resolves(result);
}

function mockCreate(result) {
    return sinon.stub(User, 'create').resolves(result);
}

function mockDelete(result) {
    return sinon.stub(User, 'findByIdAndDelete').resolves(result);
}

module.exports = { mockFindOne, mockCreate, mockDelete };
