const express = require('express');
const router = express.Router();
const pagesController = require('../../controllers/pages/pagesController');
const requireAuthPage = require('../../middlewares/requireAuthPages');
const pagesDashboardRoutes = require('./pagesDashboardRoutes');
/**
 * Routes des pages de l'application.
 *
 * Ces routes gèrent le rendu des pages d'accueil, de connexion et du dashboard.
 * Le dashboard est protégé par le middleware d'authentification `requireAuthPage`, qui vérifie la présence d'un token JWT valide 
 * dans les cookies.
 *
 * Endpoints :
 * - GET /                      → page d'accueil (accueil.ejs)
 * - GET /login                 → page de connexion (login.ejs)
 * - POST /login                → traitement de la connexion (génération du JWT)
 * - POST /logout               → traitement de la déconnexion
 * - USE /dashboard             → routes du dashboard (pagesDashboardRoutes.js)
 * 
 * Sécurité :
 * - Les routes USE /dashboard sont protégées par le middleware `requireAuthPage`, qui redirige vers /login si l'utilisateur n'est pas 
 * authentifié.
 * - Les autres routes sont publiques et ne nécessitent pas d'authentification.
 * 
 * @module routes/pagesRoutes
 * @requires express
 * @requires middlewares/requireAuthPages
 * @requires controllers/pagesController
 * @requires routes/pages/pagesDashboardRoutes
 * @version 0.2.0
 * 
 * Note : les fonctionnalités spécifiques du dashboard seront développées dans les versions ultérieures. En version 0.1.0, le 
 * dashboard est un placeholder qui affiche simplement l'identifiant utilisateur extrait du token JWT.
 * En version 0.2.0, la page d'accueil est une interface utilisateur simple qui présente les informations de statut de l'API et 
 * un message de bienvenue. Les fonctionnalités de l'API seront progressivement activées au fil du développement, et cette page 
 * servira de point d'entrée pour les utilisateurs. 
 * 
 * Note : la logique de déconnexion est simple, elle consiste à effacer le cookie du token JWT et à rediriger l'utilisateur vers 
 * la page de connexion. En supprimant le cookie, l'utilisateur ne pourra plus accéder aux pages protégées jusqu'à ce qu'il se 
 * reconnecte et obtienne un nouveau token. Cette méthode est appelée depuis le dashboard lorsque l'utilisateur clique sur le 
 * bouton de déconnexion. 
 * En production, il est recommandé de mettre `secure: true` dans les options du cookie pour assurer que le token JWT ne soit 
 * transmis que sur des connexions HTTPS. De plus, il serait judicieux d'ajouter une expiration courte au token JWT pour limiter 
 * les risques en cas de compromission.
 * 
 * @see views/accueil.ejs
 * @see views/login.ejs
 * @see routes/pages/pagesDashboardRoutes.js
 * @see routes/api/authRoutes
 * @see middlewares/requireAuthPages
 * @see config/jwt
 */

// Accueil
router.get('/', pagesController.renderHome);

// Connexion (Login)
router.get('/login', pagesController.renderLogin);
router.post('/login', pagesController.handleLogin);

// Déconnexion (Logout)
router.get('/logout', pagesController.handleLogout);

// Dashboard (protégé par le middleware d'authentification)
router.use('/dashboard', requireAuthPage, pagesDashboardRoutes);

module.exports = router;
