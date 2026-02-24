const sinon = require('sinon');

/**
 * Mock de la réponse Express : res.status().json()
 * Permet de simuler les réponses HTTP dans les tests unitaires.
 */
function mockResponse() {
    return {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis(),
        send: sinon.stub().returnsThis()
    };
}

/**
 * Mock de next() pour les middlewares.
 * Utilisé pour vérifier si le middleware passe correctement au suivant.
 */
function mockNext() {
    return sinon.spy();
}

/**
 * Fonction utilitaire permettant de restaurer automatiquement
 * tous les stubs/spies Sinon après chaque test.
 *
 * À utiliser dans les fichiers de tests :
 *   const { afterEachRestore } = require('../mocks/tests.mock');
 *   afterEachRestore();
 */
function afterEachRestore() {
    afterEach(() => sinon.restore());
}

module.exports = {
    mockResponse,
    mockNext,
    afterEachRestore
};
