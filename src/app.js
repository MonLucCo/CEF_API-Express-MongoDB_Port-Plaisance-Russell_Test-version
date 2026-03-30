/**
 * @file app.js
 * @description Configuration principale de l'application Express :
 * - Middlewares globaux
 * - Montage du routeur des Pages (EJS)
 * - Montage du routeurs API (REST)
 * - Configuration du moteur de vues EJS (views/)
 * - Configuration des fichiers statiques (public/)
 * 
 * Prise en compte du Préfixe dans la base de l'URL (accès dans les données locales d'Express)
 *
 * @module app
 * @requires express
 * @requires path
 * @version 0.5.3
 */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

// Import des routeurs
const pagesRoutes = require('./routes/pages/pagesRoutes');
const apiRoutes = require('./routes/api/apiRoutes');

const app = express();

/* ---------------------------------------------------------
   Configuration de la base URL des liens du frontend
--------------------------------------------------------- */
app.locals.BASE_URL = process.env.API_PREFIX || "/";

/* ---------------------------------------------------------
   Configuration du moteur de vues (EJS)
--------------------------------------------------------- */
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

/* ---------------------------------------------------------
   Fichiers statiques (CSS, JS, images)
--------------------------------------------------------- */
app.use(express.static(path.join(__dirname, '../public')));

/* ---------------------------------------------------------
   Middlewares globaux
--------------------------------------------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------------------------------------------------------
   Routes Pages (EJS)
--------------------------------------------------------- */
app.use('/', pagesRoutes);

/* ---------------------------------------------------------
   Routes API (REST)
--------------------------------------------------------- */
app.use('/api', apiRoutes);

/* ---------------------------------------------------------
   Export de l'application
--------------------------------------------------------- */
module.exports = app;
