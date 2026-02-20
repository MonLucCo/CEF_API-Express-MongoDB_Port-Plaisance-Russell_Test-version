/**
 * @description Définition des routes Catways de l’API Port de Plaisance Russell.
 *
 * Ce module regroupe l’ensemble des endpoints liés aux catways.
 * Il intègre les middlewares de validation et de résolution d’identifiant
 * introduits dans l’issue‑26 (étape 3).
 *
 * Routes disponibles :
 * - GET /catways               → liste des catways
 * - GET /catways/:id           → détail d’un catway (identifiant hybride)
 *
 * Les opérations POST, PUT, PATCH et DELETE seront implémentées dans les issues 27 → 30.
 * Elles sont présentes sous forme de placeholders pour faciliter l’intégration future.
 * 
 * @todo Implémentation prévue dans les issues 27 → 30
 * - POST /catways              → création d’un catway
 * - PUT /catways/:id            → mise à jour complète d’un catway
 * - PATCH /catways/:id          → mise à jour partielle d’un catway
 * - DELETE /catways/:id         → suppression d’un catway
 *
 * @module routes/catwayRoutes
 * @requires express
 * @requires module:controllers/catwayController
 * @requires module:middlewares/catwayMiddleware
 * @version 0.3.0
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

/**
 * GET /catways
 * @summary Récupère la liste complète des catways.
 * @description
 * Retourne tous les catways présents en base MongoDB.
 *
 * Aucun middleware n’est nécessaire pour cette route.
 *
 * @returns {Array<Object>} 200 - Liste des catways
 * @returns {Object} 500 - Erreur interne du serveur
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
 * @returns {Object} 400 - Identifiant invalide
 * @returns {Object} 404 - Catway introuvable
 * @returns {Object} 500 - Erreur interne du serveur
 *
 * @see module:middlewares/catwayMiddleware.validateCatwayId
 * @see module:middlewares/catwayMiddleware.resolveCatwayIdentifier
 * @see module:controllers/catwayController.getCatwayById
 */
router.get('/:id', validateCatwayId, resolveCatwayIdentifier, getCatwayById);

// POST /catways — création d’un catway
router.post('/', createCatway);

// PUT /catways/:id — mise à jour complète
router.put('/:id', validateCatwayId, resolveCatwayIdentifier, updateCatway);

// PATCH /catways/:id — mise à jour partielle
router.patch('/:id', validateCatwayId, resolveCatwayIdentifier, patchCatway);

// DELETE /catways/:id — suppression
router.delete('/:id', validateCatwayId, resolveCatwayIdentifier, deleteCatway);

module.exports = router;
