/**
 * @file catwayPayloadMiddleware.js
 * @description Middlewares de validation métier pour les opérations Catways (POST, PUT, PATCH).
 *
 * Ces middlewares assurent :
 * - la validation des champs requis pour la création d’un catway
 * - la validation des types et formats
 * - la préparation d’une architecture scalable pour PUT et PATCH
 * 
 * Ils sont utilisés dans les routes de création et de mise à jour des catways pour garantir que les 
 * données métiers sont valides avant d’atteindre les contrôleurs :
 * - `validateCatwayPayload` est utilisé pour les routes POST et PUT
 * - `validateCatwayPartialPayload` est prévu pour les routes PATCH (implémentation à venir - issue-29)
 *
 * @module middlewares/catwayPayloadMiddleware
 * @version 0.2.0
 */

/**
 * @middleware validateCatwayPayload
 * @description Valide le payload requis pour créer ou remplacer un catway.
 *
 * Champs requis :
 * - catwayNumber : entier positif
 * - type : 'short' | 'long'
 * - catwayState : string non vide
 *
 * @param {Object} req - Objet Request Express
 * @param {Object} res - Objet Response Express
 * @param {Function} next - Fonction Express pour passer au middleware suivant
 *
 * @returns {void}
 * @throws {Object} 400 - Données invalides
 * 
 * @example
 * router.post('/', validateCatwayPayload, createCatway);
 *
 * @version 0.1.0
 */
exports.validateCatwayPayload = (req, res, next) => {
    const { catwayNumber, type, catwayState } = req.body;

    if (catwayNumber === undefined || type === undefined || catwayState === undefined) {
        return res.status(400).json({ error: 'Champs requis manquants' });
    }

    if (!Number.isInteger(catwayNumber) || catwayNumber <= 0) {
        return res.status(400).json({ error: 'catwayNumber doit être un entier positif' });
    }

    if (!['short', 'long'].includes(type)) {
        return res.status(400).json({ error: 'type doit être short ou long' });
    }

    if (typeof catwayState !== 'string' || catwayState.trim() === '') {
        return res.status(400).json({ error: 'catwayState doit être une chaîne non vide' });
    }

    next();
};

/**
 * @middleware validateCatwayPartialPayload
 * @description Valide le payload pour la mise à jour partielle d’un catway.
 * Il doit permettre de valider les champs présents dans le payload, sans exiger tous les champs requis pour la mise à jour.
 * 
 * Champs optionnels :
 * - catwayNumber : entier positif
 * - type : 'short' | 'long'
 * - catwayState : string non vide
 * 
 * Le middleware vérifie que :
 * - au moins un champ est présent
 * - les champs présents sont valides (type et format)
 * 
 * @param {Object} req - Objet Request Express
 * @param {Object} res - Objet Response Express
 * @param {Function} next - Fonction Express pour passer au middleware suivant
 * 
 * @return {void}
 * @throws {Object} 400 - Données invalides
 * 
 * @example
 * router.patch('/:id', validateCatwayId, resolveCatwayIdentifier, validateCatwayPartialPayload, patchCatway);
 * 
 * @version 0.1.0
 */
exports.validateCatwayPartialPayload = (req, res, next) => {
    const { catwayNumber, type, catwayState } = req.body;

    const hasAtLeastOneField =
        catwayNumber !== undefined ||
        type !== undefined ||
        catwayState !== undefined;

    if (!hasAtLeastOneField) {
        return res.status(400).json({ error: 'Aucun champ valide fourni' });
    }

    if (catwayNumber !== undefined && (!Number.isInteger(catwayNumber) || catwayNumber <= 0)) {
        return res.status(400).json({ error: 'catwayNumber doit être un entier positif' });
    }

    if (type !== undefined && !['short', 'long'].includes(type)) {
        return res.status(400).json({ error: 'type doit être short ou long' });
    }

    if (catwayState !== undefined && (typeof catwayState !== 'string' || catwayState.trim() === '')) {
        return res.status(400).json({ error: 'catwayState doit être une chaîne non vide' });
    }

    next();
};
