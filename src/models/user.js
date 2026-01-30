/**
 * Modèle User pour MongoDB utilisant Mongoose.
 * Représente un utilisateur de la capitainerie.
 *
 * Champs :
 * - name : nom de l'utilisateur
 * - email : adresse email unique
 * - password : mot de passe (hashé dans une étape ultérieure)
 * - createdAt / updatedAt : timestamps automatiques
 *
 * Structure du document :
 * {
 *   name: String,
 *   email: String,
 *   password: String,
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 *
 * Utilisations :
 * - inscription
 * - connexion
 * - gestion des profils
 * - permissions d'accès
 *
 * @module models/user
 * @requires mongoose
 * @version 1.0.0
 */


const mongoose = require('mongoose');

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

module.exports = mongoose.model('User', userSchema);
