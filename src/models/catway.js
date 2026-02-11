/**
 * @description Modèle Mongoose représentant un catway du port de plaisance Russell.
 * Un catway est une passerelle flottante permettant l’accès aux bateaux amarrés.
 *
 * @module models/catway
 * @requires mongoose
 * @version 1.0.0
 *
 * @typedef Catway
 * @property {number} catwayNumber - Numéro unique du catway (>= 1).
 * @property {string} type - Type du catway : "short" ou "long".
 * @property {string} catwayState - Description de l’état du catway.
 * @property {Date} createdAt - Date de création (générée automatiquement).
 * @property {Date} updatedAt - Date de mise à jour (générée automatiquement).
 *
 * @see docs-dev/architecture.md
 * @see docs-dev/tests-strategy.md
 */

const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema(
    {
        /**
         * Numéro unique du catway.
         * Exemple : 1, 2, 3...
         */
        catwayNumber: {
            type: Number,
            required: [true, 'Le numéro du catway est requis.'],
            unique: true,
            min: [1, 'Le numéro du catway doit être supérieur ou égal à 1.'],
        },

        /**
         * Type de catway : "short" ou "long".
         */
        type: {
            type: String,
            required: [true, 'Le type du catway est requis.'],
            enum: {
                values: ['short', 'long'],
                message: 'Le type du catway doit être "short" ou "long".',
            },
            trim: true,
            lowercase: true,
        },

        /**
         * Description de l’état du catway.
         * Exemple : "bon état", "en réparation", etc.
         */
        catwayState: {
            type: String,
            required: [true, 'L’état du catway est requis.'],
            trim: true,
        },
    },
    {
        // Ajout automatique des champs createdAt et updatedAt
        timestamps: true,
        // Suppression du champ __v généré par Mongoose
        versionKey: false,
    }
);

// Index optimisé pour les futures recherches (réservations)
catwaySchema.index({ catwayNumber: 1 });

module.exports = mongoose.model('Catway', catwaySchema);
