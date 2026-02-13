/**
 * Tests unitaires (niveau‑1) du modèle User
 * Issue‑20A — Validation structurelle du schéma sans base MongoDB
 */

const { expect } = require('chai');
const mongoose = require('mongoose');
const User = require('../../src/models/user');

// Mode permissif (aucune connexion DB)
mongoose.set('strictQuery', false);

describe('Model User — Tests unitaires (niveau‑1)', () => {

    it('devrait valider un utilisateur correct', async () => {
        const user = new User({
            name: 'Alice',
            email: 'alice@example.com',
            password: '$2b$10$abcdefghijklmnopqrstuv' // hash bcrypt valide
        });

        const result = await user.validate();
        expect(result).to.equal(undefined);
    });

    it('devrait refuser un utilisateur sans email', async () => {
        const user = new User({
            name: 'Alice',
            password: '$2b$10$abcdefghijklmnopqrstuv'
        });

        try {
            await user.validate();
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.email).to.exist;
        }
    });

    it('devrait accepter un email avec majuscules', async () => {
        const user = new User({
            name: 'Alice',
            email: 'Alice@Example.com',
            password: '$2b$10$abcdefghijklmnopqrstuv'
        });

        const result = await user.validate();
        expect(result).to.equal(undefined);
    });

    it('devrait refuser un email invalide', async () => {
        const user = new User({
            name: 'Alice',
            email: 'not-an-email',
            password: '$2b$10$abcdefghijklmnopqrstuv'
        });

        try {
            await user.validate();
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.email).to.exist;
        }
    });

    it('devrait refuser un mot de passe non hashé', async () => {
        const user = new User({
            name: 'Alice',
            email: 'alice@example.com',
            password: 'plaintext'
        });

        try {
            await user.validate();
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.password).to.exist;
            expect(error.errors.password.message).to.include('bcrypt');
        }
    });
});
