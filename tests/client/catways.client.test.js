const { expect } = require("chai");
const request = require("supertest");
const app = require("../../src/app");
const createTestUser = require("../helpers/createTestUser");

describe("Tests Client – Catways", () => {

    let token;

    beforeEach(async () => {
        const result = await createTestUser();
        token = result.token;
    });

    it("1) devrait créer un catway", async () => {
        const res = await request(app)
            .post("/api/catways")
            .set("Authorization", `Bearer ${token}`)
            .send({ catwayNumber: 10, type: "long", catwayState: "ok" });

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("_id");
    });

    it("2) devrait lister les catways", async () => {
        const res = await request(app)
            .get("/api/catways")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array");
    });

    it("3) devrait afficher le détail d’un catway", async () => {
        const created = await request(app)
            .post("/api/catways")
            .set("Authorization", `Bearer ${token}`)
            .send({ catwayNumber: 20, type: "short", catwayState: "ok" });

        const id = created.body._id;

        const res = await request(app)
            .get(`/api/catways/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("catwayNumber", 20);
    });

    it("4) devrait modifier l’état d’un catway", async () => {
        const created = await request(app)
            .post("/api/catways")
            .set("Authorization", `Bearer ${token}`)
            .send({ catwayNumber: 30, type: "long", catwayState: "ok" });

        const id = created.body._id;

        const res = await request(app)
            .patch(`/api/catways/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ catwayState: "hs" });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("catwayState", "hs");
    });

    it("5) devrait supprimer un catway", async () => {
        const created = await request(app)
            .post("/api/catways")
            .set("Authorization", `Bearer ${token}`)
            .send({ catwayNumber: 40, type: "short", catwayState: "ok" });

        const id = created.body._id;

        const res = await request(app)
            .delete(`/api/catways/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).to.equal(204);
    });

});
