/**
 * @description Définition des routes Catways de l’API Port de Plaisance Russell.
 *
 * Ce module regroupe l’ensemble des endpoints liés aux catways.
 * Il intègre les middlewares :
 * - de validation et de résolution d’identifiant (issue‑26)
 * - de validation de payload (issue‑27)
 *
 * Routes disponibles :
 * - GET /catways               → liste des catways
 * - GET /catways/:id           → détail d’un catway (identifiant hybride)
 * - POST /catways              → création d’un catway
 *
 * Les opérations POST, PUT, PATCH et DELETE seront implémentées dans les issues 27 → 30.
 * Elles sont présentes sous forme de placeholders pour faciliter l’intégration future.
 * 
 * @todo Implémentation prévue dans les issues 27 → 30
 * - PUT /catways/:id            → mise à jour complète d’un catway
 * - PATCH /catways/:id          → mise à jour partielle d’un catway
 * - DELETE /catways/:id         → suppression d’un catway
 *
 * @module routes/catwayRoutes
 * @requires express
 * @requires module:controllers/catwayController
 * @requires module:middlewares/catwayMiddleware
 * @requires module:middlewares/catwayPayloadMiddleware
 * @version 0.4.0
 */

const express = require('express');
const router = express.Router();

const {
    validateCatwayId,
    resolveCatwayIdentifier
} = require('../middlewares/catwayMiddleware');

const {
    getAllCatways,
    getCatwayById,
    createCatway,
    updateCatway,
    patchCatway,
    deleteCatway
} = require('../controllers/catwayController');

const {
    validateCatwayPayload,
    validateCatwayPartialPayload
} = require('../middlewares/catwayPayloadMiddleware');

/**
 * GET /catways
 * @summary Récupère la liste complète des catways.
 * @description
 * Retourne tous les catways présents en base MongoDB.
 *
 * Aucun middleware n’est nécessaire pour cette route.
 *
 * @returns {Array<Object>} 200 - Liste des catways
 * @throws {Object} 500 - Erreur interne du serveur
 *
 * @see module:controllers/catwayController.getAllCatways
 */
router.get('/', getAllCatways);

/**
 * GET /catways/:id
 * @summary Récupère un catway selon un identifiant hybride.
 * @description
 * Cette route utilise deux middlewares :
 *
 * - `validateCatwayId` : vérifie la validité syntaxique de l’identifiant
 * - `resolveCatwayIdentifier` : résout l’identifiant hybride et attache le catway à `req.catway`
 *
 * Le contrôleur `getCatwayById` se contente ensuite de renvoyer `req.catway`.
 *
 * @param {string} id - Identifiant Catway (ObjectId ou catwayNumber)
 *
 * @returns {Object} 200 - Catway trouvé
 * @throws {Object} 400 - Identifiant invalide
 * @throws {Object} 404 - Catway introuvable
 * @throws {Object} 500 - Erreur interne du serveur
 *
 * @see module:middlewares/catwayMiddleware.validateCatwayId
 * @see module:middlewares/catwayMiddleware.resolveCatwayIdentifier
 * @see module:controllers/catwayController.getCatwayById
 */
router.get('/:id', validateCatwayId, resolveCatwayIdentifier, getCatwayById);

/**
 * POST /catways
 * @summary Crée un nouveau catway.
 * @description
 * Cette route utilise le middleware `validateCatwayPayload` pour valider le payload de création.
 *
 * Le contrôleur `createCatway` suppose que le payload est valide et se concentre sur la logique métier de création.
 * Le middleware assure que les champs requis sont présents et valides avant d’atteindre le contrôleur.
 *
 * @returns {Object} 201 - Catway créé
 * @throws {Object} 400 - Données invalides
 * @throws {Object} 409 - catwayNumber déjà existant
 * @throws {Object} 500 - Erreur interne du serveur
 * 
 * @see module:middlewares/catwayPayloadMiddleware.validateCatwayPayload
 * @see module:controllers/catwayController.createCatway
 */
router.post('/', validateCatwayPayload, createCatway);

/**
 * PUT /catways/:id
 * @summary Met à jour complètement un catway.
 * @description
 * Cette route utilise les middlewares suivants :
 *
 * - `validateCatwayId` : vérifie la validité syntaxique de l’identifiant
 * - `resolveCatwayIdentifier` : résout l’identifiant hybride et attache le catway à `req.catway`
 * - `validateCatwayPayload` : valide le payload de mise à jour complète
 * 
 * Le contrôleur `updateCatway` suppose que l’identifiant est valide, que le catway existe et que le payload est valide.
 * Il se concentre donc sur la logique métier de mise à jour complète.
 * Le middleware de validation de payload assure que les données métiers sont valides avant d’atteindre le contrôleur.
 * 
 * @returns {Object} 200 - Catway mis à jour
 * @throws {Object} 400 - Identifiant ou données invalides
 * @throws {Object} 404 - Catway introuvable
 * @throws {Object} 500 - Erreur interne du serveur
 * 
 * @see module:middlewares/catwayMiddleware.validateCatwayId
 * @see module:middlewares/catwayMiddleware.resolveCatwayIdentifier
 * @see module:middlewares/catwayPayloadMiddleware.validateCatwayPayload
 * @see module:controllers/catwayController.updateCatway
 * 
 * @todo Implémentation de la logique métier dans le contrôleur `updateCatway` (issue‑28)
 */
router.put('/:id', validateCatwayId, resolveCatwayIdentifier, validateCatwayPayload, updateCatway);

/**
 * PATCH /catways/:id
 * @summary Met à jour partiellement un catway.
 * @description
 * Cette route utilise les middlewares de validation d’identifiant et de résolution, ainsi qu’un middleware dédié à la validation partielle du payload.
 * Le contrôleur `patchCatway` suppose que l’identifiant est valide, que le catway existe et que le payload est valide.
 * Il se concentre donc sur la logique métier de mise à jour partielle.
 * Le middleware de validation de payload assure que les données métiers sont valides avant d’atteindre le contrôleur.
 * 
 * @returns {Object} 200 - Catway mis à jour
 * @throws {Object} 400 - Identifiant ou données invalides
 * @throws {Object} 404 - Catway introuvable
 * @throws {Object} 500 - Erreur interne du serveur
 * 
 * @see module:middlewares/catwayMiddleware.validateCatwayId
 * @see module:middlewares/catwayMiddleware.resolveCatwayIdentifier
 * @see module:middlewares/catwayPayloadMiddleware.validateCatwayPartialPayload
 * @see module:controllers/catwayController.patchCatway
 * 
 * @todo Implémentation de la logique métier dans le contrôleur `patchCatway` (issue‑29)
 */
router.patch('/:id', validateCatwayId, resolveCatwayIdentifier, validateCatwayPartialPayload, patchCatway);

// DELETE /catways/:id — suppression
/**
 * DELETE /catways/:id
 * @summary Supprime un catway.
 * @description
 * Cette route utilise les middlewares suivants :
 *
 * - `validateCatwayId` : vérifie la validité syntaxique de l’identifiant
 * - `resolveCatwayIdentifier` : résout l’identifiant hybride et attache le catway à `req.catway`
 *
 * Le contrôleur `deleteCatway` suppose que l’identifiant est valide et que le catway existe.
 * Il se concentre donc sur la logique métier de suppression.
 * Le middleware de validation d’identifiant assure que l’identifiant est valide et que le catway existe avant d’atteindre le contrôleur.
 * Le middleware de résolution d’identifiant assure que le catway est attaché à `req.catway` pour que le contrôleur puisse le supprimer.
 * 
 * @returns {Object} 200 - Catway supprimé
 * @returns {Object} 400 - Identifiant invalide
 * @returns {Object} 404 - Catway introuvable
 * @returns {Object} 500 - Erreur interne du serveur
 * 
 * @see module:middlewares/catwayMiddleware.validateCatwayId
 * @see module:middlewares/catwayMiddleware.resolveCatwayIdentifier
 * @see module:controllers/catwayController.deleteCatway
 * 
 * @todo Implémentation de la logique métier dans le contrôleur `deleteCatway` (issue‑30)
 */
router.delete('/:id', validateCatwayId, resolveCatwayIdentifier, deleteCatway);

module.exports = router;
