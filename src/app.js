const express = require('express');
const accueilRoutes = require('./routes/accueilRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares pour lire le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', accueilRoutes);
app.use('/auth', authRoutes);

module.exports = app;
