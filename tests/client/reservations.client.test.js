const { expect } = require("chai");
const request = require("supertest");
const app = require("../../src/app");
const createTestUser = require("../helpers/createTestUser");

describe("Tests Client – Reservations", () => {

    let token;

    beforeEach(async () => {
        const result = await createTestUser();
        token = result.token;
    });

    async function createCatway() {
        const res = await request(app)
            .post("/api/catways")
            .set("Authorization", `Bearer ${token}`)
            .send({ catwayNumber: 99, type: "long", catwayState: "ok" });

        return res.body._id;
    }

    it("6) devrait créer une réservation", async () => {
        const catwayId = await createCatway();

        const res = await request(app)
            .post(`/api/catways/${catwayId}/reservations`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                clientName: "John Doe",
                boatName: "Blue Ocean",
                checkIn: "2025-01-01",
                checkOut: "2025-01-05"
            });

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("_id");
    });

    it("7) devrait supprimer une réservation", async () => {
        const catwayId = await createCatway();

        const created = await request(app)
            .post(`/api/catways/${catwayId}/reservations`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                clientName: "Jane",
                boatName: "SeaStar",
                checkIn: "2025-02-01",
                checkOut: "2025-02-03"
            });

        const res = await request(app)
            .delete(`/api/catways/${catwayId}/reservations/${created.body._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).to.equal(200);
    });

    it("8) devrait lister les réservations", async () => {
        const catwayId = await createCatway();

        await request(app)
            .post(`/api/catways/${catwayId}/reservations`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                clientName: "A",
                boatName: "B",
                checkIn: "2025-03-01",
                checkOut: "2025-03-02"
            });

        const res = await request(app)
            .get(`/api/catways/${catwayId}/reservations`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array");
    });

    it("9) devrait afficher le détail d’une réservation", async () => {
        const catwayId = await createCatway();

        const created = await request(app)
            .post(`/api/catways/${catwayId}/reservations`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                clientName: "Client",
                boatName: "Boat",
                checkIn: "2025-04-01",
                checkOut: "2025-04-02"
            });

        const res = await request(app)
            .get(`/api/catways/${catwayId}/reservations/${created.body._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("clientName", "Client");
    });

});
