/**
 * Contrôleur des utilisateurs.
 * Gère les opérations GET, POST, PATCH et DELETE sur le modèle User.
 * 
 * Les middlewares :
 * - de validation et de résolution d’identifiant sont utilisés par les méthodes nécessitant un identifiant d'utilisateur.
 * - de validation de payload est utilisé par les méthodes de création et de mise à jour.
 * 
 * Ainsi, les méthodes du contrôleur peuvent se concentrer sur la logique métier sans se soucier de la validation ou de la résolution 
 * d’identifiant, ainsi que la validité des données métiers (payload).
 * 
 * @see module:middlewares/userMiddleware
 *
 * @module controllers/userController
 * @requires models/user
 * @requires bcrypt
 * @version 0.1.0
 */

const User = require('../../models/user');
const bcrypt = require('bcrypt');

/**
 * @function getUsers
 * @async
 * @description Liste des utilisateurs
 * 
 * @route GET /api/users/
 * 
 * @returns {Array<Object>} 200 - Liste des utilisateurs
 * @throws {Object} 500 - Erreur interne du serveur
 *
 * @requires models/user
 * @version 0.1.0
 */
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error.message);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

/**
 * @function createUser
 * @async
 * @description Inscription d'un utilisateur (avec hashage du mot de passe)
 * 
 * Ce contrôleur suppose que le payload a été validé par le middleware `validateUserPayload`.
 * 
 * @route POST /api/users/
 * 
 * @returns {Object} 201 - Utilisateur créé
 * @returns {Object} 400 - Champs manquants, validation Mongoose ou email déjà utilisé
 * @returns {Object} 500 - Erreur interne du serveur
 *
 * @example
 * router.post('/', validateUserPayload, createUser);
 *
 * @requires models/user
 * @requires bcrypt 
 * @version 0.1.0
 */
exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Utilisateur créé",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        // Gestion des erreurs de duplication d'email (section "Error handling")
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email déjà utilisé" });
        }
        // Gestion des erreurs de validation Mongoose (section "Error handling")
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        // Gestion des erreurs. En version 1.0.0, devient : res.status(500).json({ error: "Erreur interne du serveur" });
        res.status(500).json({ error: error.message });
    }
};

/**
 * @function patchUser
 * @description Mise à jour partielle d’un utilisateur.
 *
 * Ce contrôleur suppose que :
 * - l’identifiant a été validé (validateUserId)
 * - l’utilisateur a été attaché à req.user (resolveUserIdentifier)
 * - le payload partiel a été validé (validateUserPayloadPartial)
 *
 * @route PATCH /api/users/:id
 * 
 * @returns {Object} 200 - Utilisateur mis à jour
 * @throws {Object} 409 - Email déjà existant
 * @throws {Object} 500 - Erreur interne du serveur
 *
 * @example
 * router.patch('/:id', validateUserId, resolveUserIdentifier, validateUserPayloadPartial, patchUser);
 *
 * @version 0.1.0
 */
exports.patchUser = async (req, res) => {
    try {
        const user = req.user;
        const { name, email, password } = req.body;

        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;

        if (password !== undefined) {
            user.password = await bcrypt.hash(password, 10);
        }

        const updated = await user.save();

        return res.status(200).json({
            id: updated._id,
            name: updated.name,
            email: updated.email
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({ error: "Email déjà existant" });
        }

        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

/**
 * @function deleteUser
 * @memberof module:controllers/userController
 * @async
 * @description Suppression d'un utilisateur par ID
 *
 * Ce contrôleur suppose que :
 * - l’identifiant a été validé (validateUserId)
 * - l’utilisateur a été attaché à req.user (resolveUserIdentifier)
 * 
 * @route DELETE /api/users/:id
 * 
 * @returns {Object} 200 - Utilisateur supprimé
 * @throws {Object} 500 - Erreur interne du serveur
 *
 * @example
 * router.delete('/:id', validateUserId, resolveUserIdentifier, deleteUser);
 *
 * @requires models/user 
 * @version 0.1.0
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = req.user;

        await user.deleteOne();

        return res.status(200).json({
            message: "Utilisateur supprimé",
            id: user._id
        });

    } catch (error) {
        // Gestion des erreurs. En version 1.0.0, devient : res.status(500).json({ error: "Erreur interne du serveur" });
        res.status(500).json({ error: error.message });
    }
};
