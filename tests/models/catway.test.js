/**
 * Tests unitaires du modèle Catway (niveau‑1)
 * Vérifie la validation du schéma sans base MongoDB réelle.
 */

const { expect } = require('chai');
const mongoose = require('mongoose');
const Catway = require('../../src/models/catway');

describe('Model Catway – Tests unitaires (niveau‑1)', () => {

    before(async () => {
        // Initialisation minimale du driver Mongoose
        // Suppression du warning depuis Mongoose 7 :  pas de base réelle utilisée, pas de connexion nécessaire.
        await mongoose.set('strictQuery', false);
    });

    it('devrait valider un catway correct', async () => {
        const catway = new Catway({
            catwayNumber: 1,
            type: 'short',
            catwayState: 'bon état'
        });

        const result = await catway.validate();
        expect(result).to.equal(undefined);
    });

    it('devrait refuser un catway sans catwayNumber', async () => {
        const catway = new Catway({
            type: 'short',
            catwayState: 'bon état'
        });

        try {
            await catway.validate();
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.catwayNumber).to.exist;
        }
    });

    it('devrait refuser un type invalide', async () => {
        const catway = new Catway({
            catwayNumber: 2,
            type: 'medium',
            catwayState: 'bon état'
        });

        try {
            await catway.validate();
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.type).to.exist;
            expect(error.errors.type.message).to.include('short');
        }
    });

    it('devrait refuser un catway sans catwayState', async () => {
        const catway = new Catway({
            catwayNumber: 3,
            type: 'short'
        });

        try {
            await catway.validate();
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.catwayState).to.exist;
        }
    });

    it('devrait refuser un catwayNumber inférieur à 1', async () => {
        const catway = new Catway({
            catwayNumber: 0,
            type: 'short',
            catwayState: 'bon état'
        });

        try {
            await catway.validate();
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.catwayNumber).to.exist;
        }
    });
});
