/**
 * @file reservationController.js
 * @description Contrôleur des Reservations de l’API Port de Plaisance Russell.
 *
 * Les middlewares Catways et Reservations seront utilisés dans les issues 33 → 36.
 * 
 * Version issue‑32 : création du module et des quatre fonctions placeholders pour les routes de réservation.
 * Version issue‑33 : implémentation de la fonction getReservationsByCatway pour récupérer les réservations d’un catway.
 * Version issue‑34 : implémentation de la fonction getReservationById pour récupérer le détail d’une réservation.
 * Version issue‑35 : implémentation de la fonction createReservation pour créer une réservation.
 * 
 * La fonction deleteReservation est actuellement un placeholder avec une structure minimale, 
 * sans logique métier ni interaction avec la base de données. Elle sera implémentée progressivement dans l'issue‑36.
 *
 * Routes gérées par ce contrôleur :
 * - issue‑33 : GET /catways/:id/reservations   
 * - issue‑34 : GET /catways/:id/reservations/:idReservation
 * - issue‑35 : POST /catways/:id/reservations
 * - issue‑36 : DELETE /catways/:id/reservations/:idReservation
 *
 * @module controllers/reservationController
 * @requires ../models/reservation
 * @requires ../middlewares/reservationMiddleware
 *
 * @see module:middlewares/catwayMiddleware.validateCatwayId
 * @see module:middlewares/catwayMiddleware.resolveCatwayIdentifier
 * @see module:middlewares/reservationMiddleware.validateReservationId
 * @see module:middlewares/reservationMiddleware.resolveReservationIdentifier
 * @version 0.4.0
 */

const Reservation = require('../models/reservation');

/**
 * GET /catways/:id/reservations
 * @function getReservationsByCatway
 * @async
 * @description Récupère la liste des réservations associées à un catway.
 *
 * @param {Object} req - Objet Request Express (req.catway défini par resolveCatwayIdentifier)
 * @param {Object} res - Objet Response Express
 * @returns {Object} 200 - Liste des réservations
 * @throws {Object} 500 - Erreur interne lors de la récupération des réservations
 *
 * @requires ../models/reservation
 * @version 0.2.0
 */
exports.getReservationsByCatway = async (req, res) => {
    try {
        const reservations = await Reservation.find({ catwayNumber: req.catway.catwayNumber });
        return res.status(200).json(reservations);
    } catch (error) {
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

/**
 * GET /catways/:id/reservations/:idReservation
 * @function getReservationById
 * @description Renvoie le détail d’une réservation d’un catway.
 *
 * @param {Object} req - Express Request (req.catway et req.reservation définis par les middlewares)
 * @param {Object} res - Express Response
 * @returns {Object} 200 - Détail de la réservation
 * @throws {Object} 500 - Erreur interne
 *
 * @requires ../models/reservation
 *
 * @see module:middlewares/catwayMiddleware.validateCatwayId
 * @see module:middlewares/catwayMiddleware.resolveCatwayIdentifier
 * @see module:middlewares/reservationMiddleware.validateReservationId
 * @see module:middlewares/reservationMiddleware.resolveReservationIdentifier
 * 
 * @version 0.2.0
 */
exports.getReservationById = (req, res) => {
    try {
        return res.status(200).json(req.reservation);
    } catch (error) {
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

/**
 * POST /catways/:id/reservations
 * @function createReservation
 * @async
 * @description Crée une réservation pour un catway.
 *
 * Règles métier (issue‑35) :
 * - Le payload est validé par validateReservationPayload
 * - Le catwayNumber est injecté automatiquement depuis req.catway
 * - Le contrôleur ne fait aucune validation métier supplémentaire
 * - En cas de succès : 201 + réservation créée
 * - En cas d’erreur MongoDB : 500
 *
 * @param {Object} req - Objet Request Express (req.catway défini par resolveCatwayIdentifier)
 * @param {Object} res - Objet Response Express
 * @returns {Object} 201 - Réservation créée
 * @throws {Object} 500 - Erreur interne
 *
 * @requires ../models/reservation
 *
 * @version 0.2.0
 */
exports.createReservation = async (req, res) => {
    try {
        const { clientName, boatName, checkIn, checkOut } = req.body;

        // Injection automatique du catwayNumber
        const reservationData = {
            clientName,
            boatName,
            checkIn,
            checkOut,
            catwayNumber: req.catway.catwayNumber
        };

        const newReservation = await Reservation.create(reservationData);

        return res.status(201).json(newReservation);

    } catch (error) {
        return res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
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
