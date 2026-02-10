/**
 * Modèle User pour MongoDB utilisant Mongoose.
 * Représente un utilisateur de la capitainerie.
 *
 * Champs :
 * - name : nom de l'utilisateur
 * - email : adresse email unique
 * - password : mot de passe hashé (bcrypt)
 * - createdAt / updatedAt : timestamps automatiques
 *
 * Structure du document :
 * {
 *   name: String,
 *   email: String,
 *   password: String (hash bcrypt),
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 *
 * Règles structurelles :
 * - Le champ `password` doit obligatoirement contenir un hash bcrypt valide.
 *   Une validation personnalisée empêche l'enregistrement d'un mot de passe en clair.
 *
 * Méthodes d'instance :
 * - comparePassword(password: string): Promise<boolean>
 *   Compare un mot de passe en clair avec le hash stocké dans le document.
 *   Utilisée lors de la connexion.
 *
 * Utilisations :
 * - inscription (hashage dans la couche contrôleur)
 * - connexion (comparaison via méthode d'instance)
 * - gestion des profils
 * - permissions d'accès
 *
 * @module models/user
 * @requires mongoose
 * @requires bcrypt
 * @version 1.1.0
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir une adresse email valide']
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis']
    }
}, {
    // Ajoute des champs createdAt et updatedAt automatiquement
    timestamps: true
});

// Validation personnalisée pour s'assurer que le mot de passe est hashé
userSchema.path('password').validate(function (value) {
    return typeof value === 'string' && value.startsWith('$2b$');
}, 'Le mot de passe doit être un hash bcrypt.');

// Méthode pour comparer un mot de passe en clair avec le hash stocké
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
