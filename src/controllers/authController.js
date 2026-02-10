/**
 * Contrôleur d'authentification – version avec hashage bcrypt et token JWT.
 * Gère les opérations register, login et delete sur le modèle User.  
 * Ne contient pas de middleware.
 *
 * @module controllers/authController
 * @requires models/user
 * @requires bcrypt
 * @requires jsonwebtoken
 * @requires config/jwt
 * @requires mongoose
 * @version 0.4.0
 */

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');
const { default: mongoose } = require('mongoose');

/**
 * Inscription d'un utilisateur (avec hashage du mot de passe)
 * 
 * @function register
 * @memberof module:controllers/authController
 * @route POST /api/auth/register
 * @returns {Object} 201 - Utilisateur créé
 * @returns {Object} 400 - Champs manquants, validation Mongoose ou email déjà utilisé
 * @returns {Object} 500 - Erreur interne du serveur
 * 
 * @version 0.3.0
 */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Champs requis manquants" });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: "Utilisateur créé", user });

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
 * Connexion d'un utilisateur - vérification du mot de passe et génération d'un token JWT.
 * 
 * @function login
 * @memberof module:controllers/authController
 * @description
 * Vérifie les identifiants, valide le mot de passe via comparePassword,
 * puis génère un token JWT signé contenant l'identifiant utilisateur.
 * 
 * @route POST /api/auth/login
 * @returns {Object} 200 - { token: string }
 * @returns {Object} 400 - Champs requis manquants
 * @returns {Object} 401 - Identifiants invalides
 * @returns {Object} 500 - Erreur interne du serveur
 * 
 * @version 0.2.0
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe requis" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Identifiants invalides" });
        }

        // Vérification du mot de passe
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({ error: "Identifiants invalides" });
        }

        // Génération du token JWT
        const token = jwt.sign(
            { userId: user._id },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        // Réponse avec retour du token
        res.status(200).json({ token });

    } catch (error) {
        // Gestion des erreurs. En version 1.0.0, devient : res.status(500).json({ error: "Erreur interne du serveur" });
        res.status(500).json({ error: error.message });
    }
};

/**
 * Suppression d'un utilisateur par ID
 * 
 * @function deleteUser
 * @memberof module:controllers/authController
 * @route DELETE /api/auth/user/:id
 * @returns {Object} 200 - Utilisateur supprimé
 * @returns {Object} 400 - ID utilisateur invalide
 * @returns {Object} 404 - Utilisateur introuvable
 * @returns {Object} 500 - Erreur interne du serveur
 * 
 * @version 0.2.0
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID utilisateur invalide" });
        }

        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        res.status(200).json({ message: "Utilisateur supprimé" });
    } catch (error) {
        // Gestion des erreurs. En version 1.0.0, devient : res.status(500).json({ error: "Erreur interne du serveur" });
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login, deleteUser };
