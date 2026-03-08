/**
 * @file app.js
 * @description Configuration principale de l'application Express :
 * - Middlewares globaux
 * - Montage des routeurs (accueil, auth, catways, reservations)
 * - Configuration du moteur de vues EJS
 * - Configuration des fichiers statiques (public/)
 *
 * @module app
 * @requires express
 * @version 0.5.1
 */

const express = require('express');
const path = require('path');

// Import des routeurs
const accueilRoutes = require('./routes/accueilRoutes');
const authRoutes = require('./routes/authRoutes');
const catwayRoutes = require('./routes/catwayRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

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

/* ---------------------------------------------------------
   Routes
--------------------------------------------------------- */
app.use('/', accueilRoutes);
app.use('/auth', authRoutes);
app.use('/catways', catwayRoutes);
app.use('/catways', reservationRoutes);

/* ---------------------------------------------------------
   Export de l'application
--------------------------------------------------------- */
module.exports = app;
