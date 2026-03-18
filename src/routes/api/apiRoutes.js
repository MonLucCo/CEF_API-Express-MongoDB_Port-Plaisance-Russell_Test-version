const express = require('express');
const router = express.Router();

const catwayRoutes = require('./catwayRoutes')
const reservationRoutes = require('./reservationRoutes')
const authMiddleware = require('../../middlewares/authMiddleware')

/**
 * Routes de l'API de l'application
 * 
 * Ces routes gèrent les fonctionnalités de l'API associées aux :
 * - utilisateurs (User)
 * - catways (Catway)
 * - réservations (Reservation)
 * 
 * La sécurisation est appliquée au niveau du routeur `API` afin d’éviter la duplication dans les modules catwayRoutes et 
 * reservationRoutes, et pour garantir une visibilité claire de la privatisation des routes.
 *  
 * Endpoints :
 * - User :
 *      - POST /register                                    → création d'un utilisateur
 *      - POST /login                                       → traitement de la connexion d'un utilisateur (génération du JWT)
 *      - DELETE /auth/delete/:id   (route protégée)        → suppression d’un utilisateur
 * 
 * - Catway :                       (routes protégées)
 *      - GET /catways                                      → liste des catways
 *      - GET /catways/:id                                  → détail d’un catway (identifiant hybride)
 *      - POST /catways                                     → création d’un catway
 *      - PUT /catways/:id                                  → mise à jour complète d’un catway
 *      - PATCH /catways/:id                                → mise à jour partielle d’un catway
 *      - DELETE /catways/:id                               → suppression d’un catway
 * 
 * - Reservation :                  (routes protégées)
 *      - GET /catways/:id/reservations                     → liste des réservations d’un catway
 *      - GET /catways/:id/reservations/:idReservation      → détail d’une réservation (catways : identifiant hybride)
 *      - POST /catways/:id/reservations                    → création d’une réservation
 *      - DELETE /catways/:id/reservations/:idReservation   → suppression d’une réservation
 * 
 * Ce routeur est monté dans `app.js` sur le chemin `/api` : app.use('/api', apiRoutes);
 * 
 * @module module:apiRoutes
 * @requires express
 * @requires module:authRoutes
 * @requires module:catwayRoutes
 * @requires module:reservationRoutes
 * @requires module:middlewares/authMiddleware
 * @version 0.2.0
 * 
 * @changes v0.2.0
 * - **Privatisation** complète des routes **Catways** et **Reservations** via **authMiddleware**
 * - **Centralisation** de la sécurité au niveau du routeur `API`
 */
router.use('/auth', require('./authRoutes'));
router.use('/catways', authMiddleware, catwayRoutes);
router.use('/catways', authMiddleware, reservationRoutes);

module.exports = router;
