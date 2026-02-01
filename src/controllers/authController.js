/**
 * Contrôleur d'authentification – version avec hashage bcrypt.
 * Gère les opérations register, login et delete sur le modèle User.  
 * Ne contient ni JWT, ni middleware.
 *
 * @module controllers/authController
 * @requires models/user
 * @requires bcrypt
 * @version 0.2.0
 */

const User = require('../models/user');
const bcrypt = require('bcrypt');

/**
 * Inscription d'un utilisateur (avec hashage du mot de passe)
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
        // Gestion des erreurs de validation Mongoose (section "Error handling")
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

/**
 * Connexion d'un utilisateur (avec vérification du mot de passe)
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe requis" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        // Vérification du mot de passe
        const isValid = await user.comparePassword(password);

        if (!isValid) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
        }

        res.status(200).json({ message: "Connexion réussie", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Suppression d'un utilisateur par ID
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        res.status(200).json({ message: "Utilisateur supprimé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login, deleteUser };
