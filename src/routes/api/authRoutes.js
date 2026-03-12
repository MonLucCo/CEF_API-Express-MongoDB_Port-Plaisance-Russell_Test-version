/**
 * Routes d'authentification.
 *
 * Ces routes gèrent l'inscription, la connexion et la suppression d'un utilisateur.
 * À partir de l’issue‑16, la suppression nécessite un token JWT valide.
 *
 * Endpoints :
 * - POST   /auth/register     → création d’un utilisateur
 * - POST   /auth/login        → connexion (génération du JWT)
 * - DELETE /auth/delete/:id   → suppression d’un utilisateur (route protégée)
 *
 * Sécurité :
 * - La route DELETE est protégée par le middleware JWT (authMiddleware).
 *
 * @module routes/authRoutes
 * @requires express
 * @requires controllers/authController
 * @requires middlewares/authMiddleware
 * @version 0.2.0
 */

const express = require('express');
const router = express.Router();

const { register, login, deleteUser } = require('../../controllers/api/authController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Route : inscription (publique)
router.post('/register', register);

// Route : connexion (publique)
router.post('/login', login);

// Route : suppression d'un utilisateur (protégée)
router.delete('/delete/:id', authMiddleware, deleteUser);

module.exports = router;
