/**
 * Middleware d'authentification pour les pages nécessitant une session utilisateur.
 *
 * Ce middleware vérifie la présence d'un token JWT dans les cookies de la requête.
 * Si le token est valide, il extrait l'identifiant utilisateur et le stocke dans `req.userId`.
 * Si le token est absent ou invalide, l'utilisateur est redirigé vers la page de connexion.
 *
 * Utilisation :
 * - Ce middleware doit être appliqué aux routes de pages nécessitant une authentification.
 * - Exemple : app.get('/dashboard', requireAuthPage, dashboardController);
 * - Les pages protégées doivent gérer la présence de `req.userId` pour personnaliser le contenu.
 *
 * Comportement :
 * - Si le token est valide : `req.userId` est défini et la requête continue vers le contrôleur.
 * - Si le token est absent ou invalide : redirection vers '/login'.
 * - En cas d'erreur lors de la vérification du token : redirection vers '/login'.
 *
 * @module middlewares/requireAuthPages
 * @requires jsonwebtoken
 * @requires config/jwt
 * @version 0.1.0
 */
const { verifyToken } = require('../utils/jwt');

module.exports = function requireAuthPage(req, res, next) {
    try {
        const token = req.cookies?.token;
        const decoded = verifyToken(token);

        if (!token || !decoded) {
            return res.redirect('/login');
        }

        req.userId = decoded.userId;

        next();
    } catch (error) {
        return res.redirect('/login');
    }
};
