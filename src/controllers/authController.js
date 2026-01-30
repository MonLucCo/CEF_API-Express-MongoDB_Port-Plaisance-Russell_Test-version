/**
 * Contrôleur d'authentification – version sans sécurité.  
 * Gère les opérations register, login et delete sur le modèle User.  
 * Ne contient ni hashage, ni JWT, ni middleware.
 *
 * @module controllers/authController
 * @requires models/user
 * @version 0.1.0
 */

const User = require('../models/user');

/**
 * Inscription d'un utilisateur (sans hashage)
 */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Vérification minimale
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Champs requis manquants" });
        }

        // Création brute
        const user = await User.create({ name, email, password });
        res.status(201).json({ message: "Utilisateur créé", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Connexion d'un utilisateur (sans vérification du mot de passe)
 */
const login = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email requis" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        res.status(200).json({ message: "Connexion simulée", user });
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
