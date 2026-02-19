/**
 * @description Contrôleur Catways — logique métier des routes Catways.
 *
 * Ce module regroupe l’ensemble des opérations CRUD liées aux catways.
 * Les méthodes sont implémentées progressivement dans les issues 25 à 30.
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
 * @version 0.2.0
 */

const mongoose = require('mongoose');
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
 * @function getCatwayById
 * @async
 * @route GET /catways/:id
 * @description Récupère un catway par son ID.
 * @returns {Object} 200 - Catway trouvé
 * @returns {Object} 400 - ID invalide
 * @returns {Object} 404 - Catway introuvable
 * @returns {Object} 500 - Erreur interne du serveur
 * @see module:models/catway
 * @note Version initiale — identifiant MongoDB uniquement (issue‑26, étape 1)
 * @version 0.1.0
 */
exports.getCatwayById = async (req, res) => {
    const { id } = req.params;

    // Validation de l'ID : doit être un ObjectId valide de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID catway invalide' });
    }

    try {
        const catway = await Catway.findById(id);

        if (!catway) {
            return res.status(404).json({ error: 'Catway introuvable' });
        }

        return res.status(200).json(catway);

    } catch (error) {
        console.error('Erreur lors de la récupération du catway :', error.message);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
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
