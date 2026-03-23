const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const catwayRoutes = require('./catwayRoutes');
const reservationRoutes = require('./reservationRoutes');
const authMiddleware = require('../../middlewares/authMiddleware');

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
 * - Auth :
 *      - POST /login                                       → traitement de la connexion d'un utilisateur (génération du JWT)
 *      - POST /register                                    → création d'un utilisateur (fonction redondante qui sera supprimée)
 *      - DELETE /auth/delete/:id   (route protégée)        → suppression d’un utilisateur (fonction redondante qui sera supprimée)
 * 
 * - User :                         (routes protégées)
 *      - GET /users                                        → liste des utilisateurs
 *      - POST /users/                                      → création d'un utilisateur
 *      - PUT /users/:id                                    → modification d'un utilisateur
 *      - DELETE /users/:id                                 → suppression d’un utilisateur
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
 * @requires module:userRoutes
 * @requires module:catwayRoutes
 * @requires module:reservationRoutes
 * @requires module:middlewares/authMiddleware
 * @version 0.3.0
 * 
 * @changes v0.2.0
 * - **Privatisation** complète des routes **Users**, **Catways** et **Reservations** via **authMiddleware**
 * - **Centralisation** de la sécurité au niveau du routeur `API`
 */
router.use('/auth', authRoutes);
router.use('/users', authMiddleware, userRoutes);
router.use('/catways', authMiddleware, catwayRoutes);
router.use('/catways', authMiddleware, reservationRoutes);

module.exports = router;
