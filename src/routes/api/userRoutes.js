/**
 * @description Définition des routes Users de l’API Port de Plaisance Russell.
 *
 * Ce module regroupe l’ensemble des endpoints liés aux utilisateurs.
 * Il intègre les middlewares :
 * - de validation et de résolution d’identifiant
 * - de validation de payload
 *
 * Routes disponibles :
 * - GET /users                 → liste des utilisateurs
 * - POST /users                → création d’un utilisateur
 * - PATCH /users/:id           → mise à jour partielle d’un utilisateur
 * - DELETE /users/:id          → suppression d’un utilisateur
 *
 * Ce routeur est monté successivement dans :
 * - `app.js` sur le chemin `/api` : app.use('/api', apiRoutes);
 * - `apiRoutes.js` sur le chemin privatisé `/users` : app.use('/users', authMiddleware, userRoutes);
 * 
 * @module routes/userRoutes
 * @requires express
 * @requires module:controllers/userController
 * @requires module:middlewares/userMiddleware
 * @version 0.1.0
 */
const express = require('express');
const router = express.Router();

const {
    validateUserId,
    resolveUserIdentifier,
    validateUserPayload,
    validateUserPayloadPartial
} = require('../../middlewares/userMiddleware');

const {
    getUsers,
    createUser,
    patchUser,
    deleteUser
} = require('../../controllers/api/userController');

router.get('/', getUsers);
router.post('/', validateUserPayload, createUser);
router.patch('/:id', validateUserId, resolveUserIdentifier, validateUserPayloadPartial, patchUser);
router.delete('/:id', validateUserId, resolveUserIdentifier, deleteUser);

module.exports = router;
