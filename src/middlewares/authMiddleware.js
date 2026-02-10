const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');

/**
 * Middleware d'authentification JWT.
 *
 * Vérifie la présence et la validité du token transmis dans l'en-tête HTTP
 * `Authorization: Bearer <token>`.
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
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @param {import('express').NextFunction} next - Fonction permettant de passer au middleware suivant
 */
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        // Aucun header ou mauvais format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token manquant ou invalide' });
        }

        const token = authHeader.split(' ')[1];

        // Vérification du token
        const decoded = jwt.verify(token, jwtConfig.secret);

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
