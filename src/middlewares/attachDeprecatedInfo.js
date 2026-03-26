/**
 * Ajoute automatiquement un bloc "deprecated" dans la réponse JSON
 * si la route est marquée comme dépréciée.
 * 
 * @see middleware/deprecatedRoute
 *
 * @version 1.0.0
 */
module.exports = (req, res, next) => {
    const originalJson = res.json;

    res.json = function (body) {
        if (res.locals.deprecated && typeof body === 'object') {
            body.deprecated = {
                since: "v0.2.1-dev",
                alternative: "/api/users"
            };
        }
        return originalJson.call(this, body);
    };

    next();
};
