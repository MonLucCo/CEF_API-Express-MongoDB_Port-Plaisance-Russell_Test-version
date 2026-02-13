/**
 * Tests unitaires (niveau‑1) du modèle Reservation
 * Issue‑19 — Validation structurelle du schéma sans base MongoDB
 */

const { expect } = require('chai');
const mongoose = require('mongoose');
const Reservation = require('../../src/models/reservation');

// Mode permissif (aucune connexion DB)
mongoose.set('strictQuery', false);

describe('Model Reservation — Tests unitaires (niveau‑1)', () => {

    it('devrait valider une réservation correcte', async () => {
        const reservation = new Reservation({
            catwayNumber: 3,
            clientName: 'Thomas Martin',
            boatName: 'Carolina',
            checkIn: new Date('2022-05-21T06:00:00Z'),
            checkOut: new Date('2022-05-22T06:00:00Z'),
        });

        const result = await reservation.validate();
        expect(result).to.equal(undefined);
    });

    it('devrait refuser une réservation sans catwayNumber', async () => {
        const reservation = new Reservation({
            clientName: 'John Doe',
            boatName: 'Groeland',
            checkIn: new Date(),
            checkOut: new Date(Date.now() + 3600000),
        });

        try {
            await reservation.validate();
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.catwayNumber).to.exist;
        }
    });

    it('devrait refuser un catwayNumber < 1', async () => {
        const reservation = new Reservation({
            catwayNumber: 0,
            clientName: 'John Doe',
            boatName: 'Groeland',
            checkIn: new Date(),
            checkOut: new Date(Date.now() + 3600000),
        });

        try {
            await reservation.validate();
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.catwayNumber).to.exist;
        }
    });

    it('devrait refuser une réservation sans clientName', async () => {
        const reservation = new Reservation({
            catwayNumber: 2,
            boatName: 'Groeland',
            checkIn: new Date(),
            checkOut: new Date(Date.now() + 3600000),
        });

        try {
            await reservation.validate();
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.clientName).to.exist;
        }
    });

    it('devrait refuser une réservation sans boatName', async () => {
        const reservation = new Reservation({
            catwayNumber: 2,
            clientName: 'John Doe',
            checkIn: new Date(),
            checkOut: new Date(Date.now() + 3600000),
        });

        try {
            await reservation.validate();
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.boatName).to.exist;
        }
    });

    it('devrait refuser une réservation sans checkIn', async () => {
        const reservation = new Reservation({
            catwayNumber: 2,
            clientName: 'John Doe',
            boatName: 'Groeland',
            checkOut: new Date(),
        });

        try {
            await reservation.validate();
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.checkIn).to.exist;
        }
    });

    it('devrait refuser une réservation sans checkOut', async () => {
        const reservation = new Reservation({
            catwayNumber: 2,
            clientName: 'John Doe',
            boatName: 'Groeland',
            checkIn: new Date(),
        });

        try {
            await reservation.validate();
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.checkOut).to.exist;
        }
    });

    it('devrait refuser un checkOut antérieur à checkIn', async () => {
        const reservation = new Reservation({
            catwayNumber: 2,
            clientName: 'John Doe',
            boatName: 'Groeland',
            checkIn: new Date('2022-05-21T06:00:00Z'),
            checkOut: new Date('2022-05-20T06:00:00Z'),
        });

        try {
            await reservation.validate();
            throw new Error('Validation should have failed');
        } catch (error) {
            expect(error.errors.checkOut).to.exist;
            expect(error.errors.checkOut.message).to.include('postérieure');
        }
    });
});
