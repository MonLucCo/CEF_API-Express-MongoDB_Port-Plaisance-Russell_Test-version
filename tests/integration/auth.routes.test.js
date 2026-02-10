/** 
 * Tests d’intégration – Niveau 2 – Routes d’authentification 
 * ---------------------------------------------------------- 
 * - Utilise MongoMemoryServer (base MongoDB en mémoire) 
 * - Utilise Supertest pour appeler Express
 * - Utilise Chai pour les assertions 
 * - bcrypt et JWT réels 
 * - Aucun mock → vrai test d’intégration 
 */

process.env.JWT_SECRET = 'testsecret'; // 🔐 Secret JWT pour les tests d’intégration

const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = require('../../src/app');
const User = require('../../src/models/user');

describe('Tests d’intégration - Niveau 2 – Routes d’authentification', () => {

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

    // -----------------------------
    // REGISTER
    // -----------------------------
    describe('POST /auth/register', () => {

        it('retourne 400 si champs manquants', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({ name: null, email: 'x@test.com', password: '1234' });

            expect(res.status).to.equal(400);
        });

        it('retourne 400 si email déjà utilisé', async () => {
            const res1 = await request(app)
                .post('/auth/register')
                .send({ name: 'X', email: 'x@test.com', password: '1234' });

            expect(res1.status).to.equal(201);  // Création de l'utilisateur pour le test de duplication

            const res2 = await request(app)
                .post('/auth/register')
                .send({ name: 'XX', email: 'x@test.com', password: '1234' });

            expect(res2.status).to.equal(400);
        });

        it('retourne 201 si création valide', async () => {
            const res = await request(app)
                .post('/auth/register')
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
                .post('/auth/login')
                .send({ email: '', password: '' });

            expect(res.status).to.equal(400);
        });

        it('retourne 401 si identifiants invalides', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'x@test.com', password: 'wrong' });

            expect(res.status).to.equal(401);
        });

        it('retourne 200 et un token si identifiants valides', async () => {
            const res1 = await request(app)
                .post('/auth/register')
                .send({ name: 'X', email: 'x@test.com', password: '1234' });

            expect(res1.status).to.equal(201);  // Création de l'utilisateur pour le test de connexion

            const res2 = await request(app)
                .post('/auth/login')
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
                .delete('/auth/delete/123');

            expect(res.status).to.equal(401);
        });

        it('retourne 401 si token invalide', async () => {
            const res = await request(app)
                .delete('/auth/delete/123')
                .set('Authorization', 'Bearer invalid.token');

            expect(res.status).to.equal(401);
        });

        it('retourne 404 si utilisateur introuvable', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const token = jwt.sign({ userId: fakeId }, process.env.JWT_SECRET);

            const res = await request(app)
                .delete(`/auth/delete/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(404);
        });

        it('retourne 200 si suppression valide', async () => {
            const user = await User.create({
                name: 'X',
                email: 'x@test.com',
                password: await bcrypt.hash('1234', 10)
            });

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

            const res = await request(app)
                .delete(`/auth/delete/${user._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
        });

    });

});
