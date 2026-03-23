/**
 * @file userMiddleware.js
 * @description 
 * Middlewares de validation et de résolution des identifiants pour les users.
 * Middleware de validation du payload de création d'utilisateur.
 * Middleware de validation du payload partiel de mise à jour d'un utilisateur.
 *
 * Ces middlewares suivent la même architecture que ceux des Catways (issue‑26) :
 * - validation syntaxique de l’identifiant
 * - résolution de l’identifiant en base
 * - attachement de la ressource à l’objet `req`
 *
 * @module middlewares/userMiddleware
 * @requires mongoose
 * @requires ../models/user
 * 
 * @version 0.1.0
 */

const mongoose = require('mongoose');
const User = require('../models/user');

/**
 * @middleware validateUserId
 * @description
 * Vérifie la validité syntaxique de l’identifiant d'utilisateur.
 *
 * Règles :
 * - L’identifiant doit être un ObjectId MongoDB valide.
 * - Aucune requête en base n’est effectuée ici.
 *
 * @param {Object} req - Objet Request Express
 * @param {Object} res - Objet Response Express
 * @param {Function} next - Fonction Express pour passer au middleware suivant
 * 
 * @throws {Object} 400 - Identifiant d'utilisateur invalide
 *
 * @example
 * GET /api/users/65fabc1234567890
 * 
 * @requires mongoose
 * @version 0.1.0
 */
exports.validateUserId = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: 'Identifiant d\'utilisateur invalide'
        });
    }

    next();
};

/**
 * @middleware resolveUserIdentifier
 * @async
 * @description
 * Résout l’identifiant d'utilisateur et attache la ressource à `req.user`.
 *
 * Étapes :
 * 1. Recherche de la réservation via `findById(id)`
 * 2. Vérification de l’existence
 * 3. Attachement à `req.user`
 *
 * @notes :
 * - En cas d’échec de validation ou de résolution, une réponse 404 est renvoyée pour éviter les fuites d’information.
 * - En cas d’erreur interne, une réponse 500 est renvoyée.
 * 
 *
 * @param {Object} req - Objet Request Express
 * @param {Object} res - Objet Response Express
 * @param {Function} next - Fonction Express pour passer au middleware suivant
 * 
 * @throws {Object} 404 - Utilisateur introuvable
 * @throws {Object} 500 - Erreur interne du serveur
 *
 * @example
 * GET /api/users/65fabc1234567890
 * 
 * @requires mongoose
 * @requires ../models/user
 * @version 0.1.0
 */
exports.resolveUserIdentifier = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                error: 'Utilisateur introuvable'
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
};

/**
 * @middleware validateUserPayload
 * @description
 * Valide le payload de création d’un utilisateur.
 *
 * Règles :
 * - name : string obligatoire
 * - email : string obligatoire
 * - password : ??
 *
 * En cas d’erreur → 400
 * En cas de succès → next()
 *
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @param {Function} next - Fonction Express pour passer au middleware suivant
 *
 * @returns {void}
 * @throws {Object} 400 - Payload d'utilisateur invalide
 * 
 * @example
 * POST /api/users
 * 
 * @requires mongoose
 * @requires ../models/user
 *
 * @version 0.1.0
 */
exports.validateUserPayload = (req, res, next) => {
    const { name, email, password } = req.body;

    // Champs obligatoires
    if (!name || !email || !password) {
        return res.status(400).json({
            error: 'Les champs name, email et password sont obligatoires'
        });
    }

    next();
};

/**
 * @middleware validateUserPayloadPartial
 * @description
 * Valide le payload partiel pour la mise à jour d’un utilisateur (PATCH).
 *
 * Règles :
 * - Au moins un champ parmi { name, email, password } doit être présent.
 * - Chaque champ présent doit être valide.
 *
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @param {Function} next - Fonction Express
 *
 * @returns {void}
 * @throws {Object} 400 - Payload invalide
 *
 * @version 0.1.0
 */
exports.validateUserPayloadPartial = (req, res, next) => {
    const { name, email, password } = req.body;

    // Aucun champ fourni
    if (!name && !email && !password) {
        return res.status(400).json({
            error: "Au moins un champ (name, email, password) doit être fourni"
        });
    }

    // Validation simple des champs présents
    if (name !== undefined && typeof name !== 'string') {
        return res.status(400).json({ error: "Le champ name doit être une chaîne" });
    }

    if (email !== undefined && typeof email !== 'string') {
        return res.status(400).json({ error: "Le champ email doit être une chaîne" });
    }

    if (password !== undefined && typeof password !== 'string') {
        return res.status(400).json({ error: "Le champ password doit être une chaîne" });
    }

    next();
};
