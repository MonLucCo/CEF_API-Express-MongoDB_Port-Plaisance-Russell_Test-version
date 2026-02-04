const sinon = require('sinon');
const jwt = require('jsonwebtoken');

/**
 * Stub de jwt.verify() retournant un résultat valide.
 * @param {Object} result - Valeur retournée par jwt.verify()
 */
function mockJwtVerify(result) {
    return sinon.stub(jwt, 'verify').returns(result);
}

/**
 * Stub de jwt.verify() lançant une erreur spécifique.
 * @param {Error|Object} error - Erreur simulée (ex : { name: 'JsonWebTokenError' })
 */
function mockJwtVerifyError(error) {
    return sinon.stub(jwt, 'verify').throws(error);
}

/**
 * Stub de jwt.sign() retournant un token simulé.
 * @param {string} token - Token simulé
 */
function mockJwtSign(token) {
    return sinon.stub(jwt, 'sign').returns(token);
}

module.exports = {
    mockJwtVerify,
    mockJwtVerifyError,
    mockJwtSign
};
