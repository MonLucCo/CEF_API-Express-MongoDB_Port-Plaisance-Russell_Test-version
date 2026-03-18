/**
 * Tests d’intégration – Niveau 2 – Routes d’authentification (v0.2.0)
 * ------------------------------------------------------------------
 * Ce fichier valide le comportement complet des routes d’authentification :
 *   - POST /auth/register
 *   - POST /auth/login
 *   - DELETE /auth/delete/:id
 *
 * Objectifs :
 *   - Vérifier les statuts HTTP attendus (400, 401, 404, 200).
 *   - Tester les validations, les erreurs, et les cas limites.
 *   - Vérifier la cohérence de la suppression d’utilisateur protégée par JWT.
 *
 * Architecture :
 *   - Base Mongo isolée via MongoMemoryServer (configurée dans root-hooks.js).
 *   - Utilise Supertest pour appeler Express sans serveur HTTP réel.
 *   - Utilise bcrypt et jsonwebtoken réels (aucun mock).
 *   - Utilise jwtConfig.secret pour signer les tokens, garantissant une
 *     cohérence totale avec le middleware d’authentification.
 *
 * Important :
 *   - Ce fichier ne crée pas d’utilisateur global : chaque test prépare
 *     ses propres données pour garantir l’isolation.
 *   - Le secret JWT n’est plus modifié dans ce fichier : il est désormais
 *     centralisé dans config/jwt.js et chargé via root-hooks.js.
 *
 * @module tests/integration/auth.routes.test
 * @requires chai
 * @requires supertest
 * @requires mongoose
 * @requires bcrypt
 * @requires jsonwebtoken
 * @requires module:src/app
 * @requires module:src/models/catway
 * @requires module:config/jwt
 * @version 0.2.0
 */
const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = require('../../src/app');
const User = require('../../src/models/user');
const jwtConfig = require('../../config/jwt')

describe('Tests d’intégration - Niveau 2 – Routes d’authentification', () => {

    // -----------------------------
    // REGISTER
    // -----------------------------
    describe('POST /auth/register', () => {

        it('retourne 400 si champs manquants', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: null, email: 'x@test.com', password: '1234' });

            expect(res.status).to.equal(400);
        });

        it('retourne 400 si email déjà utilisé', async () => {
            const res1 = await request(app)
                .post('/api/auth/register')
                .send({ name: 'X', email: 'x@test.com', password: '1234' });

            expect(res1.status).to.equal(201);  // Création de l'utilisateur pour le test de duplication

            const res2 = await request(app)
                .post('/api/auth/register')
                .send({ name: 'XX', email: 'x@test.com', password: '1234' });

            expect(res2.status).to.equal(400);
        });

        it('retourne 201 si création valide', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'X', email: 'x@test.com', password: '1234' });

            expect(res.status).to.equal(201);
        });

    });

    // -----------------------------
    // LOGIN
    // -----------------------------
    describe('POST /auth/login', () => {

        it('retourne 400 si champs manquants', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: '', password: '' });

            expect(res.status).to.equal(400);
        });

        it('retourne 401 si identifiants invalides', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'x@test.com', password: 'wrong' });

            expect(res.status).to.equal(401);
        });

        it('retourne 200 et un token si identifiants valides', async () => {
            const res1 = await request(app)
                .post('/api/auth/register')
                .send({ name: 'X', email: 'x@test.com', password: '1234' });

            expect(res1.status).to.equal(201);  // Création de l'utilisateur pour le test de connexion

            const res2 = await request(app)
                .post('/api/auth/login')
                .send({ email: 'x@test.com', password: '1234' });

            expect(res2.status).to.equal(200);
            expect(res2.body.token).to.be.a('string');
        });

    });

    // -----------------------------
    // DELETE USER (route protégée)
    // -----------------------------
    describe('DELETE /auth/delete/:id', () => {

        it('retourne 401 si token manquant', async () => {
            const res = await request(app)
                .delete('/api/auth/delete/123');

            expect(res.status).to.equal(401);
        });

        it('retourne 401 si token invalide', async () => {
            const res = await request(app)
                .delete('/api/auth/delete/123')
                .set('Authorization', 'Bearer invalid.token');

            expect(res.status).to.equal(401);
        });

        it('retourne 404 si utilisateur introuvable', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const token = jwt.sign({ userId: fakeId }, jwtConfig.secret);

            const res = await request(app)
                .delete(`/api/auth/delete/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(404);
        });

        it('retourne 200 si suppression valide', async () => {
            const user = await User.create({
                name: 'X',
                email: 'x@test.com',
                password: await bcrypt.hash('1234', 10)
            });

            const token = jwt.sign({ userId: user._id }, jwtConfig.secret);

            const res = await request(app)
                .delete(`/api/auth/delete/${user._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
        });

    });

});
