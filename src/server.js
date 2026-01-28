require('dotenv').config();
const express = require('express');
const app = require('./app');

const IP = process.env.IP || '0.0.0.0';
const PORT = process.env.PORT || 3000;
const PREFIX = process.env.API_PREFIX || '/';

const expressApp = express();

// Montage de l'app sous le préfixe
expressApp.use(PREFIX, app);

expressApp.listen(PORT, IP, () => {
    console.log(`Server running on ${IP}:${PORT}${PREFIX}`);
});
