/**
 * @description Définition des routes Reservations de l’API Port de Plaisance Russell.
 *
 * Ce module regroupe l’ensemble des endpoints liés aux réservations associées aux catways.
 * Il intègre les middlewares :
 * - Catway : de validation et de résolution d’identifiant (issue‑26)
 * - Reservation : 
 *   - de validation d’identifiant de réservation (issue‑34), 
 *   - de résolution d’identifiant de réservation (issue‑34),
 *   - de validation de payload de réservation (issue 35)
 * 
 * Les fonction de middleware des réservations sont des placeholders.
 * Elles seront implémentées dans les issues 34 et 35.
 * 
 * Les fonctions de contrôleur sont des placeholders.
 * Elles seront implémentées dans les issues 33 → 36.
 *
 * Routes disponibles :
 * - GET /catways/:id/reservations                    → liste des réservations d’un catway
 * - GET /catways/:id/reservations/:idReservation     → détail d’une réservation (catways : identifiant hybride)
 * - POST /catways/:id/reservations                   → création d’une réservation
 * - DELETE /catways/:id/reservations/:idReservation  → suppression d’une réservation
 * 
 * Ce routeur est monté dans `app.js` sur le chemin `/catways` : app.use('/catways', reservationRoutes);
 *
 * @module routes/reservationRoutes
 * @requires express
 * @requires module:middlewares/catwayMiddleware
 * @requires module:middlewares/reservationMiddleware
 * @version 0.1.0
 */

const express = require('express');
const router = express.Router();

// Middlewares Catways
const {
    validateCatwayId,
    resolveCatwayIdentifier
} = require('../middlewares/catwayMiddleware');

// Middlewares Reservations (placeholders – implémentés dans issues 34 et 35)
const {
    validateReservationId,
    resolveReservationIdentifier,
    validateReservationPayload
} = require('../middlewares/reservationMiddleware');

// Contrôleur Reservations (placeholders – implémenté issue 32)
const {
    getReservationsByCatway,
    getReservationById,
    createReservation,
    deleteReservation
} = require('../controllers/reservationController');

/**
 * GET /catways/:id/reservations
 * @summary Récupère les réservations associées à un catway.
 * @description Cette route utilise les middlewares suivants :
 * 
 * - `validateCatwayId` : vérifie la validité syntaxique de l’identifiant
 * - `resolveCatwayIdentifier` : résout l’identifiant hybride et attache le catway à `req.catway`
 * 
 * Le contrôleur `getReservationsByCatway` suppose que l’identifiant est valide et que le catway existe.
 * Il se concentre donc sur la logique métier de récupération des réservations associées à ce catway.
 * Le middleware de validation d’identifiant assure que l’identifiant est valide et que le catway existe avant d’atteindre le contrôleur.
 * Le middleware de résolution d’identifiant assure que le catway est attaché à `req.catway` pour que le contrôleur puisse récupérer ses réservations.
 * 
 * @returns {Array<Object>} 200 - Liste des réservations associées au catway
 * @returns {Object} 400 - Identifiant invalide
 * @returns {Object} 404 - Catway introuvable
 * @returns {Object} 500 - Erreur interne du serveur
 * 
 * @see module:middlewares/catwayMiddleware.validateCatwayId
 * @see module:middlewares/catwayMiddleware.resolveCatwayIdentifier
 * @see module:controllers/reservationController.getReservationsByCatway
 */
router.get(
    '/:id/reservations',
    validateCatwayId,
    resolveCatwayIdentifier,
    getReservationsByCatway
);

/**
 * GET /catways/:id/reservations/:idReservation
 * @summary Récupère le détail d’une réservation d’un catway.
 * @description Cette route utilise les middlewares suivants :
 * 
 * - `validateCatwayId` : vérifie la validité syntaxique de l’identifiant du catway
 * - `resolveCatwayIdentifier` : résout l’identifiant hybride du catway et attache le catway à `req.catway`
 * - `validateReservationId` : vérifie la validité syntaxique de l’identifiant de réservation
 * - `resolveReservationIdentifier` : résout l’identifiant de réservation et attache la réservation à `req.reservation`
 * 
 * Le contrôleur `getReservationById` suppose que les identifiants sont valides, que le catway existe et que la réservation existe.
 * Il se concentre donc sur la logique métier de récupération du détail de la réservation.
 * Le middleware de validation d’identifiant assure que les identifiants sont valides et que les ressources existent avant d’atteindre le contrôleur.
 * Les middlewares de résolution d’identifiant assurent que les ressources sont attachées à `req.catway` et `req.reservation` pour que le contrôleur puisse les utiliser.
 * 
 * @returns {Object} 200 - Détail de la réservation
 * @returns {Object} 400 - Identifiant invalide
 * @returns {Object} 404 - Catway ou réservation introuvable
 * @returns {Object} 500 - Erreur interne du serveur
 * 
 * @see module:middlewares/catwayMiddleware.validateCatwayId
 * @see module:middlewares/catwayMiddleware.resolveCatwayIdentifier
 * @see module:middlewares/reservationMiddleware.validateReservationId
 * @see module:middlewares/reservationMiddleware.resolveReservationIdentifier
 * @see module:controllers/reservationController.getReservationById
 */
router.get(
    '/:id/reservations/:idReservation',
    validateCatwayId,
    resolveCatwayIdentifier,
    validateReservationId,
    resolveReservationIdentifier,
    getReservationById
);

/**
 * POST /catways/:id/reservations
 * @summary Crée une nouvelle réservation pour un catway.
 * @description Cette route utilise les middlewares suivants :
 * 
 * - `validateCatwayId` : vérifie la validité syntaxique de l’identifiant du catway
 * - `resolveCatwayIdentifier` : résout l’identifiant hybride du catway et attache le catway à `req.catway`
 * - `validateReservationPayload` : valide le payload de création de réservation
 * 
 * Le contrôleur `createReservation` suppose que l’identifiant du catway est valide, que le catway existe et que le payload de réservation est valide.
 * Il se concentre donc sur la logique métier de création d’une réservation pour ce catway.
 * Le middleware de validation d’identifiant assure que l’identifiant du catway est valide et que le catway existe avant d’atteindre le contrôleur.
 * Le middleware de validation de payload assure que les données de réservation sont valides avant d’atteindre le contrôleur.
 * Le middleware de résolution d’identifiant assure que le catway est attaché à `req.catway` pour que le contrôleur puisse l’utiliser lors de la création de la réservation.
 * 
 * @returns {Object} 201 - Réservation créée
 * @returns {Object} 400 - Données de réservation invalides
 * @returns {Object} 404 - Catway introuvable
 * @returns {Object} 409 - Conflit de réservation (ex : créneau déjà réservé ou chevauchement de réservation)
 * @returns {Object} 500 - Erreur interne du serveur
 * 
 * @see module:middlewares/catwayMiddleware.validateCatwayId
 * @see module:middlewares/catwayMiddleware.resolveCatwayIdentifier
 * @see module:middlewares/reservationMiddleware.validateReservationPayload
 * @see module:controllers/reservationController.createReservation
 */
router.post(
    '/:id/reservations',
    validateCatwayId,
    resolveCatwayIdentifier,
    validateReservationPayload,
    createReservation
);
/**
 * DELETE /catways/:id/reservations/:idReservation
 * @summary Supprime une réservation d’un catway.
 * @description Cette route utilise les middlewares suivants :
 * 
 * - `validateCatwayId` : vérifie la validité syntaxique de l’identifiant du catway
 * - `resolveCatwayIdentifier` : résout l’identifiant hybride du catway et attache le catway à `req.catway`
 * - `validateReservationId` : vérifie la validité syntaxique de l’identifiant de réservation
 * - `resolveReservationIdentifier` : résout l’identifiant de réservation et attache la réservation à `req.reservation`
 * 
 * Le contrôleur `deleteReservation` suppose que les identifiants sont valides, que le catway existe et que la réservation existe.
 * Il se concentre donc sur la logique métier de suppression de la réservation.
 * Le middleware de validation d’identifiant assure que les identifiants sont valides et que les ressources existent avant d’atteindre le contrôleur.
 * Les middlewares de résolution d’identifiant assurent que les ressources sont attachées à `req.catway` et `req.reservation` pour que le contrôleur puisse les utiliser lors de la suppression de la réservation.
 * 
 * @returns {Object} 204 - Réservation supprimée
 * @returns {Object} 400 - Identifiant du catway ou de la réservation invalide
 * @returns {Object} 404 - Catway ou réservation introuvable
 * @returns {Object} 500 - Erreur interne du serveur
 * 
 * @see module:middlewares/catwayMiddleware.validateCatwayId
 * @see module:middlewares/catwayMiddleware.resolveCatwayIdentifier
 * @see module:middlewares/reservationMiddleware.validateReservationId
 * @see module:middlewares/reservationMiddleware.resolveReservationIdentifier
 * @see module:controllers/reservationController.deleteReservation
 */
router.delete(
    '/:id/reservations/:idReservation',
    validateCatwayId,
    resolveCatwayIdentifier,
    validateReservationId,
    resolveReservationIdentifier,
    deleteReservation
);