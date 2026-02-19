/**
 * @description Contrôleur Catways — version partielle.
 * 
 * Cette version définit la structure des fonctions du contrôleur Catways.
 * Seule la méthode `getAllCatways` est implémentée (issue‑25). Les autres
 * méthodes restent des placeholders et seront complétées dans les issues
 * 26 à 30.
 * 
 * @module controllers/catwayController
 * @requires module:models/catway
 * @version 0.1.0
 */

const Catway = require('../models/catway');

/**
 * @function getAllCatways
 * @async
 * @route GET /catways
 * @description Récupère la liste complète des catways depuis la base MongoDB.
 * @returns {Array<Object>} 200 - Liste des catways
 * @returns {Object} 500 - Erreur interne du serveur
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
 * GET /catways/:id
 * @description Récupère un catway par ID (non implémenté)
 */
exports.getCatwayById = (req, res) => {
    res.status(501).json({ message: 'Récupère un catway par ID - Non implémenté (issue‑26)' });
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
