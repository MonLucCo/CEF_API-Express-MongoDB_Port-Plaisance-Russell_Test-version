const sinon = require('sinon');

/**
 * Mock de la réponse Express : res.status().json()
 */
function mockResponse() {
    return {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
    };
}

/**
 * Mock de next() pour les middlewares
 */
function mockNext() {
    return sinon.spy();
}

module.exports = {
    mockResponse,
    mockNext
};
