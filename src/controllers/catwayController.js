/**
 * @description Contrôleur Catways — logique métier des routes Catways.
 *
 * Ce module regroupe l’ensemble des opérations CRUD liées aux catways.
 * Les méthodes sont implémentées progressivement dans les issues 25 à 30.
 * 
 * Les middlewares :
 * - de validation et de résolution d’identifiant (issue‑26) sont utilisés par les méthodes nécessitant un identifiant de catway.
 * - de validation de payload (issue‑27) est utilisé par les méthodes de création et de mise à jour.
 * 
 * Ainsi, les méthodes du contrôleur peuvent se concentrer sur la logique métier sans se soucier de la validation ou de la résolution 
 * d’identifiant, ainsi que la validité des données métiers (payload).
 * @see module:middlewares/catwayMiddleware
 * @see module:middlewares/catwayPayloadMiddleware
 *
 * Méthodes actuellement implémentées :
 * - getAllCatways (issue‑25) : retourne la liste complète des catways
 * - getCatwayById (issue‑26) : retourne un catway selon son identifiant
 * - createCatway (issue‑27) : crée un nouveau catway à partir d’un payload validé
 * - updateCatway (issue‑28) : met à jour complètement un catway à partir d’un payload validé et d’un identifiant validé
 * - patchCatway (issue‑29) : met à jour partiellement un catway à partir d’un payload validé et d’un identifiant validé
 * - deleteCatway (issue‑30) : supprime un catway selon son identifiant
 *
 * @module controllers/catwayController
 * @requires module:models/catway
 * @version 0.8.0
 */

const Catway = require('../models/catway');

/**
 * @function getAllCatways
 * @async
 * @route GET /catways
 * @description Récupère la liste complète des catways depuis la base MongoDB.
 * 
 * @returns {Array<Object>} 200 - Liste des catways
 * @throws {Object} 500 - Erreur interne du serveur
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
 * @function createCatway
 * @route POST /catways
 * @description Crée un nouveau catway dans la base MongoDB.
 *
 * Ce contrôleur suppose que le payload a été validé par le middleware `validateCatwayPayload`.
 *
 * @returns {Object} 201 - Catway créé
 * @throws {Object} 409 - catwayNumber déjà existant
 * @throws {Object} 500 - Erreur interne du serveur
 *
 * @version 0.1.0
 */
exports.createCatway = async (req, res) => {
    try {
        const { catwayNumber, type, catwayState } = req.body;

        const catway = await Catway.create({ catwayNumber, type, catwayState });

        return res.status(201).json(catway);

    } catch (error) {
        console.error('Erreur création catway :', error.message);

        if (error.code === 11000) {
            return res.status(409).json({ error: 'catwayNumber déjà existant' });
        }

        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

/**
 * PUT /catways/:id
 * @description Met à jour un catway (mise à jour complète)
 * Le contrôleur se concentre donc sur la logique métier de mise à jour complète.
 * Le middleware de validation de payload assure que les données métiers sont valides avant d’atteindre le contrôleur.
 * Le middleware de validation d’identifiant assure que l’identifiant est valide et que le catway existe avant d’atteindre le contrôleur.
 * Le middleware de résolution d’identifiant assure que le catway est attaché à `req.catway` pour que le contrôleur puisse le mettre à jour.
 *
 * @returns {Object} 200 - Catway mis à jour complètement
 * @throws {Object} 409 - Catway déjà existant
 * @throws {Object} 500 - Erreur interne du serveur
 *  
 * @example
 * router.put('/:id', validateCatwayId, resolveCatwayIdentifier, validateCatwayPayload, updateCatway);
 * 
 * @version 0.1.0
 */
exports.updateCatway = async (req, res) => {
    try {
        const catway = req.catway;
        const { catwayNumber, type, catwayState } = req.body;

        catway.catwayNumber = catwayNumber;
        catway.type = type;
        catway.catwayState = catwayState;

        const updated = await catway.save();

        return res.status(200).json(updated);

    } catch (error) {
        console.error('Erreur update catway :', error.message);

        if (error.code === 11000) {
            return res.status(409).json({ error: 'catwayNumber déjà existant' });
        }

        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

/**
 * PATCH /catways/:id
 * @description Actualise un catway
 * Le contrôleur se concentre donc sur la logique métier de mise à jour partielle.
 * Le middleware de validation de payload assure que les données métiers sont valides avant d’atteindre le contrôleur.
 * Le middleware de validation d’identifiant assure que l’identifiant est valide et que le catway existe avant d’atteindre le contrôleur.
 * Le middleware de résolution d’identifiant assure que le catway est attaché à `req.catway` pour que le contrôleur puisse le mettre à jour.
 * 
 * @returns {Object} 200 - Catway mis à jour partiellement
 * @throws {Object} 409 - Catway déjà existant
 * @throws {Object} 500 - Erreur interne du serveur
 * 
 * @example
 * router.patch('/:id', validateCatwayId, resolveCatwayIdentifier, validateCatwayPartialPayload, patchCatway);
 * 
 * @version 0.1.0
 */
exports.patchCatway = async (req, res) => {
    try {
        const catway = req.catway;

        if (req.body.catwayNumber !== undefined) {
            catway.catwayNumber = req.body.catwayNumber;
        }
        if (req.body.type !== undefined) {
            catway.type = req.body.type;
        }
        if (req.body.catwayState !== undefined) {
            catway.catwayState = req.body.catwayState;
        }

        const updated = await catway.save();
        return res.status(200).json(updated);

    } catch (error) {
        console.error('Erreur patch catway :', error.message);

        if (error.code === 11000) {
            return res.status(409).json({ error: 'catwayNumber déjà existant' });
        }

        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

/**
 * DELETE /catways/:id
 * @description Supprime un catway (non implémenté)
 * Le contrôleur se concentre donc sur la logique métier de suppression.
 * Le middleware de validation d’identifiant assure que l’identifiant est valide et que le catway existe avant d’atteindre le contrôleur.
 * Le middleware de résolution d’identifiant assure que le catway est attaché à `req.catway` pour que le contrôleur puisse le supprimer.
 * 
 * @returns {Object} 204 - Catway supprimé
 * @throws {Object} 500 - Erreur interne du serveur
 * 
 * @example
 * router.delete('/:id', validateCatwayId, resolveCatwayIdentifier, deleteCatway);
 * 
 * @version 0.1.0
 */
exports.deleteCatway = async (req, res) => {
    try {
        const catway = req.catway;

        await catway.deleteOne();

        return res.status(204).send();

    } catch (error) {
        console.error('Erreur delete catway :', error.message);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
