/**
 * Routes d'authentification.
 *
 * Ces routes gèrent l'inscription, la connexion et la suppression d'un utilisateur.
 * À partir de :
 *   - l’issue‑16, la suppression nécessite un token JWT valide.
 *   - l'issue-37, l'inscription et la suppression sont dépréciées et privatisées (token JWT valide).
 * 
 *
 * Endpoints :
 * - POST   /auth/register     → création d’un utilisateur (route dépréciée et protégée)
 * - POST   /auth/login        → connexion (génération du JWT)
 * - DELETE /auth/delete/:id   → suppression d’un utilisateur (route dépréciée et protégée)
 *
 * Sécurité :
 * - Les routes POST et DELETE sont protégées par le middleware JWT (authMiddleware).
 * 
 * Dépréciation :
 * - les routes dépréciée sont toujours fonctionnelles (présence du header X-Deprecated: True et du bloc JSON d'infos)
 *
 * @module routes/authRoutes
 * @requires express
 * @requires controllers/authController
 * @requires middlewares/authMiddleware
 * @requires middleware/deprecatedRoute
 * @version 0.3.0
 */

const express = require('express');
const router = express.Router();

const { register, login, deleteUser } = require('../../controllers/api/authController');
const authMiddleware = require('../../middlewares/authMiddleware');
const deprecatedRoute = require('../../middlewares/deprecatedRoute')
const attachDeprecatedInfo = require('../../middlewares/attachDeprecatedInfo')

// Route : connexion (publique)
router.post('/login', login);

// Route : inscription (dépréciée & protégée)
router.post('/register', authMiddleware, deprecatedRoute, attachDeprecatedInfo, register);

// Route : suppression d'un utilisateur (dépréciée & protégée)
router.delete('/delete/:id', authMiddleware, deprecatedRoute, attachDeprecatedInfo, deleteUser);

module.exports = router;
