/**
 * @description Module de routes Catways — version 0.1.0.
 * 
 * Cette version connecte les routes Catways au contrôleur Catways créé
 * dans l’issue‑24. Chaque route appelle une méthode placeholder du
 * contrôleur, renvoyant un statut HTTP 501 (Not Implemented) avec un message
 * indiquant la fonctionnalité et l'issue concernée.
 * 
 * Les implémentations métier seront ajoutées progressivement dans les
 * issues 25 à 30.
 * 
 * @module routes/catwayRoutes
 * @requires express
 * @requires controllers/catwayController
 * @version 0.1.0
 */

const express = require('express');
const router = express.Router();

const catwayController = require('../controllers/catwayController');

// GET /catways — liste des catways
router.get('/', catwayController.getAllCatways);

// GET /catways/:id — détail d’un catway
router.get('/:id', catwayController.getCatwayById);

// POST /catways — création d’un catway
router.post('/', catwayController.createCatway);

// PUT /catways/:id — mise à jour complète
router.put('/:id', catwayController.updateCatway);

// PATCH /catways/:id — mise à jour partielle
router.patch('/:id', catwayController.patchCatway);

// DELETE /catways/:id — suppression
router.delete('/:id', catwayController.deleteCatway);

module.exports = router;
