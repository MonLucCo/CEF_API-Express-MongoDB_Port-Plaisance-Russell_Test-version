/**
 * Tests d’intégration (niveau‑2) du modèle User
 * Issue‑20A — Validation réelle en base MongoMemoryServer
 */

const { expect } = require('chai');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../src/models/user');

describe('Model User — Tests d’intégration (niveau‑2)', () => {
    let mongoServer;

    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    after(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('devrait insérer un utilisateur valide', async () => {
        const user = await User.create({
            name: 'Alice',
            email: 'alice@example.com',
            password: '$2b$10$abcdefghijklmnopqrstuv'
        });

        expect(user._id).to.exist;
        expect(user.name).to.equal('Alice');
        expect(user.email).to.equal('alice@example.com');
        expect(user.createdAt).to.exist;
        expect(user.updatedAt).to.exist;
    });

    it('devrait refuser un email déjà utilisé (E11000)', async () => {
        await User.create({
            name: 'Alice',
            email: 'alice@example.com',
            password: '$2b$10$abcdefghijklmnopqrstuv'
        });

        try {
            await User.create({
                name: 'Bob',
                email: 'alice@example.com',
                password: '$2b$10$abcdefghijklmnopqrstuv'
            });
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.code).to.equal(11000);
        }
    });

    it('devrait refuser un mot de passe non hashé', async () => {
        try {
            await User.create({
                name: 'Alice',
                email: 'alice@example.com',
                password: 'plaintext'
            });
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.password).to.exist;
        }
    });
});
