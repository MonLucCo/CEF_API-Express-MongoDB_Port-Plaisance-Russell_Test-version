/**
 * Fonctions utilitaires pour la génération et la vérification des JSON Web Tokens (JWT).
 *
 * Ce module centralise toute la logique liée aux JWT afin d'assurer une gestion
 * cohérente et uniforme entre les pages (frontend EJS) et l'API.
 *
 * Structure du payload du token :
 *   {
 *     userId: <ObjectId MongoDB>
 *   }
 *
 * Le token est signé à l'aide des paramètres définis dans config/jwt.js :
 *   - secret : clé secrète utilisée pour la signature
 *   - expiresIn : durée de validité du token
 *
 * @module utils/jwt
 * @requires jsonwebtoken
 * @requires config/jwt
 * @version 0.1.0
 */
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');

/**
 * Génère un JWT signé pour un utilisateur donné.
 *
 * @param {Object} user - Objet utilisateur provenant de la base de données.
 * @param {string|ObjectId} user._id - Identifiant unique de l'utilisateur.
 * @returns {string} Un token JWT signé contenant l'identifiant de l'utilisateur.
 * 
 * @requires jsonwebtoken
 * @requires config/jwt
 * @version 0.1.0
 */
function generateToken(user) {
    return jwt.sign(
        { userId: user._id },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
    );
}

/**
 * Vérifie la validité d'un JWT et renvoie son contenu décodé.
 *
 * @param {string} token - Le token JWT à vérifier.
 * @returns {Object|null} Le payload décodé si le token est valide, sinon null.
 * 
 * @requires jsonwebtoken
 * @requires config/jwt
 * @version 0.1.0
 */
function verifyToken(token) {
    return jwt.verify(token, jwtConfig.secret);
}

module.exports = {
    generateToken,
    verifyToken
};
