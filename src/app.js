/**
 * @file app.js
 * @description Configuration principale de l'application Express :
 * - Middlewares globaux
 * - Montage des routeurs (accueil, auth, catways, reservations)
 * @version 0.5.0
 */
const express = require('express');
const accueilRoutes = require('./routes/accueilRoutes');
const authRoutes = require('./routes/authRoutes');
const catwayRoutes = require('./routes/catwayRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

// Middlewares pour lire le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', accueilRoutes);
app.use('/auth', authRoutes);
app.use('/catways', catwayRoutes);
app.use('/catways', reservationRoutes);

module.exports = app;
