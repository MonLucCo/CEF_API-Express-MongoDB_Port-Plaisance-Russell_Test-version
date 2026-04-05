/**
 * Middleware de dépréciation d'une route.
 * Ajoute un header HTTP et un indicateur interne.
 * Utilisé pour les routes obsolètes mais encore fonctionnelles.
 *
 * @version 1.0.0
 */
module.exports = (req, res, next) => {
    res.setHeader("X-Deprecated", "true");
    res.locals.deprecated = true;
    next();
};
