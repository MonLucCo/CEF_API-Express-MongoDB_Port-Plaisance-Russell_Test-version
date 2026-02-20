/**
 * @file catwayMiddleware.js
 * @description Middlewares Catways — validation et résolution de l’identifiant hybride.
 *
 * Ces middlewares assurent :
 * - la validation syntaxique de l’identifiant `/:id`
 * - la résolution de l’identifiant hybride (ObjectId MongoDB ou catwayNumber)
 * - l’attachement du catway trouvé à `req.catway`
 *
 * Ils sont utilisés par toutes les routes Catways nécessitant un identifiant.
 *
 * @module middlewares/catwayMiddleware
 * @requires module:models/catway
 * @version 0.1.0
 */
const mongoose = require('mongoose');
const Catway = require('../models/catway');

/**
 * @middleware validateCatwayId
 * @description
 * Vérifie que l’identifiant fourni dans `req.params.id` est valide.
 *
 * Un identifiant Catway peut être :
 * - un ObjectId MongoDB valide
 * - un identifiant métier `catwayNumber` (nombre entier positif)
 *
 * Si l’identifiant est invalide :
 * - renvoie un statut **400**
 * - n’appelle pas `next()`
 *
 * Sinon :
 * - laisse passer la requête vers le middleware suivant
 *
 * @param {Object} req - Objet Request Express
 * @param {Object} res - Objet Response Express
 * @param {Function} next - Fonction Express pour passer au middleware suivant
 * 
 * @throws {Object} 400 - Identifiant catway invalide
 *
 * @returns {void}
 *
 * @example
 * router.get('/:id', validateCatwayId, resolveCatwayIdentifier, getCatwayById);
 *
 * @requires mongoose
 * @version 0.1.0
 */
exports.validateCatwayId = (req, res, next) => {
    const { id } = req.params;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const isNumber = /^\d+$/.test(id);

    if (!isObjectId && !isNumber) {
        return res.status(400).json({ error: 'Identifiant catway invalide' });
    }

    next();
};

/**
 * @middleware resolveCatwayIdentifier
 * @async
 * @description
 * Résout l’identifiant Catway fourni dans `req.params.id` selon une logique hybride :
 *
 * 1. Si l’identifiant est un ObjectId valide → recherche via `Catway.findById()`
 * 2. Sinon → recherche via `Catway.findOne({ catwayNumber })`
 *
 * Si aucun catway n’est trouvé :
 * - renvoie un statut **404**
 *
 * Si une erreur interne survient :
 * - renvoie un statut **500**
 *
 * Si un catway est trouvé :
 * - l’attache à `req.catway`
 * - appelle `next()`
 *
 * @param {Object} req - Objet Request Express
 * @param {Object} res - Objet Response Express
 * @param {Function} next - Fonction Express pour passer au middleware suivant
 * 
 * @throws {Object} 404 - Catway introuvable
 * @throws {Object} 500 - Erreur interne du serveur
 *
 * @returns {Promise<void>}
 *
 * @example
 * router.get('/:id', validateCatwayId, resolveCatwayIdentifier, getCatwayById);
 *
 * @requires mongoose
 * @requires module:models/catway
 * @version 0.1.0
 */
exports.resolveCatwayIdentifier = async (req, res, next) => {
    const { id } = req.params;

    try {
        let catway = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            catway = await Catway.findById(id);
        } else {
            catway = await Catway.findOne({ catwayNumber: Number(id) });
        }

        if (!catway) {
            return res.status(404).json({ error: 'Catway introuvable' });
        }

        req.catway = catway;
        next();

    } catch (error) {
        console.error('Erreur middleware Catway :', error.message);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
