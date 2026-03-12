const express = require('express');
const router = express.Router();
const pagesController = require('../../controllers/pages/pagesController');

// Page d'accueil (statique pour commit-2)
router.get('/', pagesController.renderAccueil);

module.exports = router;
