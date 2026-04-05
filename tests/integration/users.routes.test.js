const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const mongoose = require('mongoose');
const app = require('../../src/app');

const User = require('../../src/models/user');
const createTestUser = require('../helpers/createTestUser');

describe('Tests d’intégration - Niveau 2 – Routes Users', () => {

    // ------------------------------------------------------------------
    // Création d'un utilisateur et du testToken JWT avant chaque test
    // ------------------------------------------------------------------
    let testToken;

    beforeEach(async () => {
        const { token } = await createTestUser();

        testToken = token;
    });

    // ------------------------------------------------------------------
    // Tests des routes privatisées des Utilisateurs (/api/users)
    // ------------------------------------------------------------------
    // -----------------------------
    // GET /api/users
    // -----------------------------
    describe('GET /api/users — niveau‑2 (issue‑37 - étape-6)', () => {


        it('200 - liste les utilisateurs', async () => {

            // Nettoyage de la collection Users (supprime l’utilisateur du token)
            await User.deleteMany({});

            await User.create([
                {
                    name: 'Test User A',
                    email: 'a@test.com',
                    password: '$2b$10$abcdefghijklmnopqrstuv'
                },
                {
                    name: 'Test User B',
                    email: 'b@test.com',
                    password: '$2b$10$abcdefghijklmnopqrstuv'
                }
            ]);

            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${testToken}`);

            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(2);

            const names = res.body.map(r => r.name);
            expect(names).to.have.members([
                'Test User A',
                'Test User B'
            ]);

        });

        it('200 - retourne un tableau vide', async () => {

            // Nettoyage de la collection Users (supprime l’utilisateur du token)
            await User.deleteMany({});

            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${testToken}`)
                .expect(200);

            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(0);
        });

        it('500 — erreur interne simulée', async () => {
            sinon.stub(User, 'find').throws(new Error('Test error'));

            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${testToken}`)
                .expect(500);

            expect(res.body.error).to.equal('Erreur interne du serveur');

            sinon.restore();
        });

    });

    // -----------------------------
    // POST /api/users
    // -----------------------------
    describe('POST /api/users — niveau‑2 (issue‑37 - étape-6)', () => {

        it('201 - crée un utilisateur', async () => {
            const res = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${testToken}`)
                .send({
                    name: 'John',
                    email: 'john@test.com',
                    password: '123'
                });

            expect(res.status).to.equal(201);
        });

        it('400 — email déjà utilisé', async () => {
            await User.create({
                name: 'A',
                email: 'dup@test.com',
                password: '$2b$10$abcdefghijklmnopqrstuv'
            });

            const res = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${testToken}`)
                .send({
                    name: 'B',
                    email: 'dup@test.com',
                    password: '123'
                })
                .expect(400);

            expect(res.body.error).to.equal('Email déjà utilisé');
        });

        it('500 - erreur interne simulée', async () => {
            sinon.stub(User, 'create').throws(new Error('Erreur interne du serveur'));

            const res = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${testToken}`)
                .send({
                    name: 'John',
                    email: 'john@test.com',
                    password: '123'
                })
                .expect(500);

            expect(res.body.error).to.equal('Erreur interne du serveur');

            sinon.restore();
        });

    });

    // -----------------------------
    // PATCH /api/users/:id
    // -----------------------------
    describe('PATCH /api/users/:id — niveau‑2 (issue‑37 - étape-6)', () => {

        it('200 - met à jour un utilisateur', async () => {
            const user = await User.create({
                name: 'Old',
                email: 'old@test.com',
                password: '$2b$10$abcdefghijklmnopqrstuv'
            });

            const res = await request(app)
                .patch(`/api/users/${user._id}`)
                .set('Authorization', `Bearer ${testToken}`)
                .send({ name: 'New' });

            expect(res.status).be.equal(200);
        });

        it('400 - identifiant invalide', async () => {
            const res = await request(app)
                .patch('/api/users/abc')
                .set('Authorization', `Bearer ${testToken}`)
                .send({ name: 'New' })
                .expect(400);

            expect(res.body.error).to.equal("Identifiant d'utilisateur invalide");
        });

        it('400 - payload partiel vide', async () => {
            const user = await User.create({
                name: 'A',
                email: 'a@test.com',
                password: '$2b$10$abcdefghijklmnopqrstuv'
            });

            const res = await request(app)
                .patch(`/api/users/${user._id}`)
                .set('Authorization', `Bearer ${testToken}`)
                .send({})
                .expect(400);

            expect(res.body.error).to.equal("Au moins un champ (name, email, password) doit être fourni");
        });

        it('409 - si email déjà utilisé', async () => {
            const u1 = await User.create({
                name: 'A',
                email: 'a@test.com',
                password: '$2b$10$abcdefghijklmnopqrstuv'
            });

            const u2 = await User.create({
                name: 'B',
                email: 'b@test.com',
                password: '$2b$10$abcdefghijklmnopqrstuv'
            });

            const res = await request(app)
                .patch(`/api/users/${u2._id}`)
                .set('Authorization', `Bearer ${testToken}`)
                .send({ email: 'a@test.com' })
                .expect(409);

            expect(res.body.error).to.equal('Email déjà existant');
        });

        it('500 - erreur interne simulée', async () => {
            const user = await User.create({
                name: 'Old',
                email: 'old@test.com',
                password: '$2b$10$abcdefghijklmnopqrstuv'
            });

            sinon.stub(User.prototype, 'save').throws(new Error('Erreur interne du serveur'));

            const res = await request(app)
                .patch(`/api/users/${user._id}`)
                .set('Authorization', `Bearer ${testToken}`)
                .send({ name: 'New' })
                .expect(500);

            expect(res.body.error).to.equal('Erreur interne du serveur');

            sinon.restore();
        });

    });

    // -----------------------------
    // DELETE /api/users/:id
    // -----------------------------
    describe('DELETE /api/users/:id — niveau‑2 (issue‑37 - étape-6)', () => {

        it('200 - supprime un utilisateur', async () => {
            const user = await User.create({
                name: 'A',
                email: 'a@test.com',
                password: '$2b$10$abcdefghijklmnopqrstuv'
            });

            const res = await request(app)
                .delete(`/api/users/${user._id}`)
                .set('Authorization', `Bearer ${testToken}`);

            expect(res.status).be.equal(200);
        });

        it('400 - identifiant invalide', async () => {
            const res = await request(app)
                .delete('/api/users/abc')
                .set('Authorization', `Bearer ${testToken}`)
                .expect(400);

            expect(res.body.error).to.equal("Identifiant d'utilisateur invalide");
        });

        it('404 - utilisateur introuvable', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .delete(`/api/users/${fakeId}`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(404);

            expect(res.body.error).to.equal('Utilisateur introuvable');
        });

        it('500 - erreur interne simulée', async () => {
            const user = await User.create({
                name: 'A',
                email: 'a@test.com',
                password: '$2b$10$abcdefghijklmnopqrstuv'
            });

            sinon.stub(User.prototype, 'deleteOne').throws(new Error('Erreur interne du serveur'));

            const res = await request(app)
                .delete(`/api/users/${user._id}`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(500);

            expect(res.body.error).to.equal('Erreur interne du serveur');

            sinon.restore();
        });

    });

});
