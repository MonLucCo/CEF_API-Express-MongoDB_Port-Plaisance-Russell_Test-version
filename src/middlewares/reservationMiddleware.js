/**
 * @file reservationMiddleware.js
 * @description 
 * Middlewares de validation et de résolution des identifiants pour les réservations (issue‑34).
 * Middleware de validation du payload de création de réservation (issue‑35).
 *
 * Ces middlewares suivent la même architecture que ceux des Catways (issue‑26) :
 * - validation syntaxique de l’identifiant
 * - résolution de l’identifiant en base
 * - attachement de la ressource à l’objet `req`
 *
 * @module middlewares/reservationMiddleware
 * @requires mongoose
 * @requires ../models/reservation
 * 
 * @version 0.2.0
 */

const mongoose = require('mongoose');
const Reservation = require('../models/reservation');

/**
 * @middleware validateReservationId
 * @description
 * Vérifie la validité syntaxique de l’identifiant de réservation.
 *
 * Règles :
 * - L’identifiant doit être un ObjectId MongoDB valide.
 * - Aucune requête en base n’est effectuée ici.
 *
 * @param {Object} req - Objet Request Express
 * @param {Object} res - Objet Response Express
 * @param {Function} next - Fonction Express pour passer au middleware suivant
 * 
 * @throws {Object} 400 - Identifiant de réservation invalide
 *
 * @example
 * GET /catways/1/reservations/65fabc1234567890
 * 
 * @requires mongoose
 * @version 0.1.0
 */
exports.validateReservationId = (req, res, next) => {
  const { idReservation } = req.params;

  if (!mongoose.Types.ObjectId.isValid(idReservation)) {
    return res.status(400).json({
      error: 'Identifiant de réservation invalide'
    });
  }

  next();
};

/**
 * @middleware resolveReservationIdentifier
 * @async
 * @description
 * Résout l’identifiant de réservation et attache la ressource à `req.reservation`.
 *
 * Étapes :
 * 1. Recherche de la réservation via `findById(idReservation)`
 * 2. Vérification de l’existence
 * 3. Vérification que la réservation appartient bien au catway :
 *      reservation.catwayNumber === req.catway.catwayNumber
 * 4. Attachement à `req.reservation`
 *
 * @notes :
 * - Ce middleware doit être utilisé après les middlewares de validation et de résolution du catway. Il s’appuie sur `req.catway` pour vérifier l’appartenance de la réservation.
 * - En cas d’échec de validation ou de résolution, une réponse 404 est renvoyée pour éviter les fuites d’information.
 * - En cas d’erreur interne, une réponse 500 est renvoyée.
 * 
 *
 * @param {Object} req - Objet Request Express
 * @param {Object} res - Objet Response Express
 * @param {Function} next - Fonction Express pour passer au middleware suivant
 * 
 * @throws {Object} 404 - Réservation introuvable
 * @throws {Object} 404 - Réservation non associée à ce catway
 * @throws {Object} 500 - Erreur interne du serveur
 *
 * @example
 * GET /catways/1/reservations/65fabc1234567890
 * 
 * @requires mongoose
 * @requires ../models/reservation
 * @version 0.1.0
 */
exports.resolveReservationIdentifier = async (req, res, next) => {
  try {
    const { idReservation } = req.params;

    const reservation = await Reservation.findById(idReservation);

    if (!reservation) {
      return res.status(404).json({
        error: 'Réservation introuvable'
      });
    }

    // Vérification d’appartenance au catway
    if (reservation.catwayNumber !== req.catway.catwayNumber) {
      return res.status(404).json({
        error: 'Réservation non associée à ce catway'
      });
    }

    req.reservation = reservation;
    next();

  } catch (error) {
    return res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

/**
 * @middleware validateReservationPayload
 * @description
 * Valide le payload de création d’une réservation (issue‑35).
 *
 * Règles :
 * - clientName : string obligatoire
 * - boatName : string obligatoire
 * - checkIn : date valide obligatoire
 * - checkOut : date valide obligatoire
 * - checkIn < checkOut (strict)
 * - catwayNumber ne doit PAS être fourni par le client (utilisé depuis req.catway)
 *
 * En cas d’erreur → 400
 * En cas de succès → next()
 *
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @param {Function} next - Fonction Express pour passer au middleware suivant
 *
 * @returns {void}
 * @throws {Object} 400 - Payload de réservation invalide
 * 
 * @example
 * POST /catways/1/reservations
 * 
 * @requires mongoose
 * @requires ../models/reservation
 *
 * @version 0.1.0
 */
exports.validateReservationPayload = (req, res, next) => {
  const { clientName, boatName, checkIn, checkOut, catwayNumber } = req.body;

  // Interdiction d’écraser le catwayNumber
  if (catwayNumber !== undefined) {
    return res.status(400).json({
      error: 'Le champ catwayNumber ne doit pas être fourni dans le payload'
    });
  }

  // Champs obligatoires
  if (!clientName || !boatName || !checkIn || !checkOut) {
    return res.status(400).json({
      error: 'Les champs clientName, boatName, checkIn et checkOut sont obligatoires'
    });
  }
  // Validation des dates
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      error: 'Les champs checkIn et checkOut doivent être des dates valides'
    });
  }
  // checkIn < checkOut (strict)
  if (start >= end) {
    return res.status(400).json({
      error: 'La date checkIn doit être strictement inférieure à checkOut'
    });
  }
  next();
};
