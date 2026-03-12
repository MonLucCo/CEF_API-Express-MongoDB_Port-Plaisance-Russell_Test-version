/**
 * Tests d’intégration du modèle Catway (niveau‑2)
 * Vérifie le comportement réel du modèle avec MongoMemoryServer.
 */

const { expect } = require('chai');
const Catway = require('../../src/models/catway');

describe('Model Catway – Tests d’intégration (niveau‑2)', () => {

    it('devrait enregistrer un catway valide en base', async () => {
        const catway = new Catway({
            catwayNumber: 1,
            type: 'short',
            catwayState: 'bon état'
        });

        const saved = await catway.save();

        expect(saved).to.have.property('_id');
        expect(saved.catwayNumber).to.equal(1);
        expect(saved.type).to.equal('short');
        expect(saved.catwayState).to.equal('bon état');
        expect(saved).to.have.property('createdAt');
        expect(saved).to.have.property('updatedAt');
    });

    it('devrait refuser un catwayNumber dupliqué (erreur E11000)', async () => {
        await Catway.create({
            catwayNumber: 1,
            type: 'short',
            catwayState: 'bon état'
        });

        try {
            await Catway.create({
                catwayNumber: 1,
                type: 'long',
                catwayState: 'en réparation'
            });
            throw new Error('Duplicate should have failed');
        } catch (error) {
            expect(error).to.exist;
            expect(error.code).to.equal(11000); // Erreur MongoDB E11000
        }
    });

    it('devrait refuser un type invalide (enum)', async () => {
        try {
            await Catway.create({
                catwayNumber: 2,
                type: 'medium',
                catwayState: 'bon état'
            });
            throw new Error('Enum should have failed');
        } catch (error) {
            expect(error.errors.type).to.exist;
        }
    });

    it('devrait refuser un catwayNumber < 1', async () => {
        try {
            await Catway.create({
                catwayNumber: 0,
                type: 'short',
                catwayState: 'bon état'
            });
            throw new Error('Min should have failed');
        } catch (error) {
            expect(error.errors.catwayNumber).to.exist;
        }
    });

    it('devrait refuser un catway sans catwayState', async () => {
        try {
            await Catway.create({
                catwayNumber: 3,
                type: 'short'
            });
            throw new Error('Required should have failed');
        } catch (error) {
            expect(error.errors.catwayState).to.exist;
        }
    });
});
