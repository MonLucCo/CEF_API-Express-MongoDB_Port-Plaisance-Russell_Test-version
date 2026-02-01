/**
 * Routes d'authentification – version sans sécurité.
 * Appelle les fonctions du contrôleur d'authentification.
 *
 * Endpoints :  
 * - POST   /auth/register   → création d’un utilisateur  
 * - POST   /auth/login      → connexion (sans vérification du mot de passe)  
 * - DELETE /auth/delete/:id → suppression d’un utilisateur
 *
 * @module routes/authRoutes
 * @requires express
 * @requires controllers/authController
 * @version 0.1.0
 */

const express = require('express');
const router = express.Router();

const { register, login, deleteUser } = require('../controllers/authController');

// Route : inscription
router.post('/register', register);

// Route : connexion (sans vérification du mot de passe)
router.post('/login', login);

// Route : suppression d'un utilisateur
router.delete('/delete/:id', deleteUser);

module.exports = router;
