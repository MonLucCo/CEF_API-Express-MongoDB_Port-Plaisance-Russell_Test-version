/**
 * @description Modèle Mongoose représentant une réservation d’un catway
 * du port de plaisance Russell.
 *
 * Une réservation associe un client, un bateau et une période de séjour
 * à un catway existant.
 *
 * @module models/reservation
 * @requires mongoose
 * @version 1.0.0
 *
 * @typedef Reservation
 * @property {number} catwayNumber - Numéro du catway réservé (>= 1).
 * @property {string} clientName - Nom du client effectuant la réservation.
 * @property {string} boatName - Nom du bateau amarré.
 * @property {Date} checkIn - Date de début de réservation.
 * @property {Date} checkOut - Date de fin de réservation (doit être > checkIn).
 * @property {Date} createdAt - Date de création (générée automatiquement).
 * @property {Date} updatedAt - Date de mise à jour (générée automatiquement).
 *
 * @see docs-dev/architecture.md
 * @see docs-dev/tests-strategy.md
 */

const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
    {
        /**
         * Numéro du catway réservé.
         * Exemple : 1, 2, 3...
         */
        catwayNumber: {
            type: Number,
            required: [true, 'Le numéro du catway est requis.'],
            min: [1, 'Le numéro du catway doit être supérieur ou égal à 1.'],
        },

        /**
         * Nom du client effectuant la réservation.
         * Exemple : "Thomas Martin"
         */
        clientName: {
            type: String,
            required: [true, 'Le nom du client est requis.'],
            trim: true,
        },

        /**
         * Nom du bateau amarré.
         * Exemple : "Carolina"
         */
        boatName: {
            type: String,
            required: [true, 'Le nom du bateau est requis.'],
            trim: true,
        },

        /**
         * Date de début de réservation.
         * Exemple : "2022-05-21T06:00:00Z"
         */
        checkIn: {
            type: Date,
            required: [true, 'La date de début de réservation est requise.'],
        },

        /**
         * Date de fin de réservation.
         * Exemple : "2022-10-27T06:00:00Z"
         */
        checkOut: {
            type: Date,
            required: [true, 'La date de fin de réservation est requise.'],
            validate: {
                validator: function (value) {
                    return this.checkIn && value > this.checkIn;
                },
                message: 'La date de fin doit être postérieure à la date de début.',
            },
        },
    },
    {
        // Ajout automatique des champs createdAt et updatedAt
        timestamps: true,
        // Suppression du champ __v généré par Mongoose
        versionKey: false,
    }
);

module.exports = mongoose.model('Reservation', reservationSchema);
