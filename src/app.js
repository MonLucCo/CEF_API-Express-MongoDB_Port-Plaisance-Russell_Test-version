const express = require('express');
const accueilRoutes = require('./routes/accueilRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use('/', accueilRoutes);
app.use('/auth', authRoutes);

module.exports = app;
