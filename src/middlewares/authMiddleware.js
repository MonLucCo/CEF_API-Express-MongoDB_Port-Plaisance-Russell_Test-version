const { verifyToken } = require('../utils/jwt');

/**
 * Middleware d'authentification JWT.
 *
 * Vérifie la présence et la validité du token transmis dans l'en-tête HTTP `Authorization: Bearer <token>`,
 * ou dans les cookies. La priorité est donnée au token dans les cookies, puis à celui dans les headers.
 *
 * Comportements possibles :
 * - 401 : token manquant ou mal formé
 * - 401 : token invalide (JsonWebTokenError)
 * - 401 : token expiré (TokenExpiredError)
 * - 500 : erreur interne lors de la vérification du token
 * - next() : token valide → `req.userId` défini
 *
 * Effets de bord :
 * - Ajoute `req.userId` contenant l'identifiant utilisateur extrait du token.
 *
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction permettant de passer au middleware suivant
 * 
 * @returns {Object} 401 - Token manquant ou invalide
 * @returns {Object} 500 - Erreur interne lors de la vérification du token
 * @returns {void} next() - Token valide, passage au middleware suivant avec `req.userId` défini
 * 
 * @requires utils/jwt
 * @version 0.1.1
 */
function authMiddleware(req, res, next) {
    try {
        // Token depuis cookie
        const cookieToken = req.cookies?.token;

        // Token depuis header Authorization
        let headerToken = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            headerToken = req.headers.authorization.split(' ')[1];
        }

        // Sélection du token (cookie prioritaire)
        const token = cookieToken || headerToken;

        // Vérification du token
        const decoded = verifyToken(token);

        // Aucun token ou mauvais format
        if (!token || !decoded) {
            return res.status(401).json({ error: 'Token manquant ou invalide' });
        }

        // Ajout de l'identifiant utilisateur dans la requête
        req.userId = decoded.userId;

        next();

    } catch (error) {
        // Token expiré
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expiré' });
        }

        // Token invalide
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token invalide' });
        }

        // Erreur interne inattendue
        return res.status(500).json({ error: 'Erreur interne lors de la vérification du token' });
    }
}

module.exports = authMiddleware;
