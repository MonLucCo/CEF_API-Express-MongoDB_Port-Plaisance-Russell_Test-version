/**
 * Script d’import des données JSON dans MongoDB
 * Issue‑20B — Phase 3 : Modèles & données
 */

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Charger les variables d’environnement
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

// Modèles
const User = require('../src/models/user');
const Catway = require('../src/models/catway');
const Reservation = require('../src/models/reservation');

// Fichiers JSON
const usersFile = path.join(__dirname, '../data/users.json');
const catwaysFile = path.join(__dirname, '../data/catways.json');
const reservationsFile = path.join(__dirname, '../data/reservations.json');

// Connection MongoDB
const { initClientDBConnection, disconnectClientDBConnection } = require('../src/db/mongo');

async function importData() {
    try {
        console.log('📦 Début de l\'import…');
        await initClientDBConnection();

        console.log('🧹 Nettoyage des collections…');
        await User.deleteMany({});
        await Catway.deleteMany({});
        await Reservation.deleteMany({});

        // Suppression de la collection placeholder si elle existe
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        if (collections.some(c => c.name === 'placeholder')) {
            console.log('🗑 Suppression de la collection placeholder…');
            await db.dropCollection('placeholder');
        }

        console.log('📥 Import des utilisateurs…');
        const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
        await User.insertMany(users);

        console.log('📥 Import des catways…');
        const catways = JSON.parse(fs.readFileSync(catwaysFile, 'utf-8'));
        await Catway.insertMany(catways);

        console.log('📥 Import des réservations…');
        const reservations = JSON.parse(fs.readFileSync(reservationsFile, 'utf-8'));
        await Reservation.insertMany(reservations);
    } catch (error) {
        console.error('❌ Erreur lors de l’import :', error);
    } finally {
        await disconnectClientDBConnection();

        console.log('✅ Import terminé avec succès !');
    }
}

importData();
