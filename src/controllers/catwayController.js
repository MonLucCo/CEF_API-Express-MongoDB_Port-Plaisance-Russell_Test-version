/**
 * @description Contrôleur Catways — logique métier des routes Catways.
 *
 * Ce module regroupe l’ensemble des opérations CRUD liées aux catways.
 * Les méthodes sont implémentées progressivement dans les issues 25 à 30.
 * 
 * Les middlewares de validation et de résolution d’identifiant introduits dans l’issue‑26
 * sont utilisés par les méthodes nécessitant un identifiant de catway.
 * Ils assurent la validation syntaxique de l’identifiant `/:id`, la résolution de l’identifiant hybride
 * (ObjectId MongoDB ou catwayNumber) et l’attachement du catway trouvé à `req.catway`.
 * Ainsi, les méthodes du contrôleur peuvent se concentrer sur la logique métier sans se soucier de la 
 * validation ou de la résolution d’identifiant.
 * @see module:middlewares/catwayMiddleware
 *
 * Méthodes actuellement implémentées :
 * - getAllCatways (issue‑25) : retourne la liste complète des catways
 * - getCatwayById (issue‑26) : retourne un catway selon son identifiant
 *
 * Les autres méthodes (createCatway, updateCatway, patchCatway, deleteCatway)
 * sont présentes sous forme de placeholders et seront complétées dans les issues suivantes.
 *
 * @module controllers/catwayController
 * @requires module:models/catway
 * @version 0.4.0
 */

const Catway = require('../models/catway');

/**
 * @function getAllCatways
 * @async
 * @route GET /catways
 * @description Récupère la liste complète des catways depuis la base MongoDB.
 * 
 * @returns {Array<Object>} 200 - Liste des catways
 * @returns {Object} 500 - Erreur interne du serveur
 * 
 * @requires module:models/catway
 * @see module:models/catway
 * @version 0.1.0
 */
exports.getAllCatways = async (req, res) => {
    try {
        const catways = await Catway.find();
        return res.status(200).json(catways);
    } catch (error) {
        console.error('Erreur lors de la récupération des catways :', error.message);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

/**
 * @function getCatwayById
 * @route GET /catways/:id
 * @description
 * Retourne le catway déjà résolu par les middlewares `validateCatwayId` et `resolveCatwayIdentifier`.
 *
 * À ce stade, l’identifiant a été validé et le catway a été attaché à `req.catway` par les middlewares.
 *
 * Le contrôleur se contente donc de renvoyer la ressource.
 *
 * @returns {Object} 200 - Catway trouvé
 *
 * @see module:middlewares/catwayMiddleware.validateCatwayId
 * @see module:middlewares/catwayMiddleware.resolveCatwayIdentifier
 *
 * @example
 * router.get('/:id', validateCatwayId, resolveCatwayIdentifier, getCatwayById);
 *
 * @version 0.4.0
 */
exports.getCatwayById = (req, res) => {
    return res.status(200).json(req.catway);
};


/**
 * POST /catways
 * @description Crée un nouveau catway (non implémenté)
 */
exports.createCatway = (req, res) => {
    res.status(501).json({ message: 'Crée un nouveau catway - Non implémenté (issue‑27)' });
};

/**
 * PUT /catways/:id
 * @description Met à jour un catway (non implémenté)
 */
exports.updateCatway = (req, res) => {
    res.status(501).json({ message: 'Mise à jour d’un catway - Non implémenté (issue‑28)' });
};

/**
 * PATCH /catways/:id
 * @description Actualise un catway (non implémenté)
 */
exports.patchCatway = (req, res) => {
    res.status(501).json({ message: 'Actualise un catway - Non implémenté (issue‑29)' });
};

/**
 * DELETE /catways/:id
 * @description Supprime un catway (non implémenté)
 */
exports.deleteCatway = (req, res) => {
    res.status(501).json({ message: 'Supprime un catway - Non implémenté (issue‑30)' });
};
