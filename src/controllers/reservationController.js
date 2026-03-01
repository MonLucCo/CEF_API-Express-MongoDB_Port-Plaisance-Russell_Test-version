/**
 * @file reservationController.js
 * @description Contrôleur des Reservations de l’API Port de Plaisance Russell.
 *
 * Version issue‑32 : implémentation minimale des fonctions du contrôleur,
 * sans logique métier, sans accès base, sans middlewares.
 *
 * Les middlewares Catways et Reservations seront utilisés dans les issues 33 → 36.
 * La logique métier complète sera introduite progressivement dans :
 * - issue‑33 : GET /catways/:id/reservations
 * - issue‑34 : GET /catways/:id/reservations/:idReservation
 * - issue‑35 : POST /catways/:id/reservations
 * - issue‑36 : DELETE /catways/:id/reservations/:idReservation
 *
 * @module controllers/reservationController
 * @version 0.1.0
 */

/**
 * GET /catways/:id/reservations
 * @function getReservationsByCatway
 * @description Récupère la liste des réservations associées à un catway.
 *
 * Version issue‑32 :
 * - structure interne minimale
 * - aucune logique métier
 * - aucune interaction avec la base
 *
 * @param {Object} req - Objet Request Express
 * @param {Object} res - Objet Response Express
 * @returns {Object} 200 - Réponse JSON simulée
 * 
 * @version 0.1.0
 * @todo Implémentation complète dans l’issue‑33
 */
exports.getReservationsByCatway = (req, res) => {
    res.status(200).json({
        message: 'GET reservations list — placeholder (issue‑32)',
        catwayId: req.params.id
    });
};

/**
 * GET /catways/:id/reservations/:idReservation
 * @function getReservationById
 * @description Récupère le détail d’une réservation d’un catway.
 *
 * Version issue‑32 :
 * - structure interne minimale
 * - aucune logique métier
 * - aucune interaction avec la base
 *
 * @param {Object} req - Objet Request Express
 * @param {Object} res - Objet Response Express
 * @returns {Object} 200 - Réponse JSON simulée
 * 
 * @version 0.1.0
 * @todo Implémentation complète dans l’issue‑34
 */
exports.getReservationById = (req, res) => {
    res.status(200).json({
        message: 'GET reservation detail — placeholder (issue‑32)',
        catwayId: req.params.id,
        reservationId: req.params.idReservation
    });
};

/**
 * POST /catways/:id/reservations
 * @function createReservation
 * @description Crée une réservation pour un catway.
 *
 * Version issue‑32 :
 * - structure interne minimale
 * - aucune logique métier
 * - aucune interaction avec la base
 *
 * @param {Object} req - Objet Request Express
 * @param {Object} res - Objet Response Express
 * @returns {Object} 201 - Réponse JSON simulée
 * 
 * @version 0.1.0
 * @todo Implémentation complète dans l’issue‑35
 */
exports.createReservation = (req, res) => {
    res.status(201).json({
        message: 'POST create reservation — placeholder (issue‑32)',
        catwayId: req.params.id,
        payload: req.body
    });
};

/**
 * DELETE /catways/:id/reservations/:idReservation
 * @function deleteReservation
 * @description Supprime une réservation d’un catway.
 *
 * Version issue‑32 :
 * - structure interne minimale
 * - aucune logique métier
 * - aucune interaction avec la base
 *
 * @param {Object} req - Objet Request Express
 * @param {Object} res - Objet Response Express
 * @returns {Object} 200 - Réponse JSON simulée
 * 
 * @version 0.1.0
 * @todo Implémentation complète dans l’issue‑36
 */
exports.deleteReservation = (req, res) => {
    res.status(200).json({
        message: 'DELETE reservation — placeholder (issue‑32)',
        catwayId: req.params.id,
        reservationId: req.params.idReservation
    });
};
