/** Testing the company routes */

const request = require("supertest");

const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");

// before each test, clean out data
beforeEach(createData);

afterAll(async () => {
    await db.end()
  })

describe("GET /", function () {
    test("Responds with a list of companies", async function () {
        const response = await request(app).get("/companies");
        expect(response.body).toEqual({
            "companies": [
                {code: "apple", name: "Apple"},
                {code: "ibm", name: "IBM"},
            ]
        });
    })
});

describe("GET /apple", function () {
    test("Should return with company object", async function () {
        const response = await request(app).get("/companies/apple");
        expect(response.body).toEqual({
            "company": {
                code: "apple",
                name: "Apple",
                description: "Maker of OSX.",
                invoices: [1, 2],
            }
        });
    })
    test("It should return 404 for no-such-company", async function () {
        const response = await request(app).get("/companies/blargh");
        expect(response.status).toEqual(404);
      })
});

describe("POST /", function () {
    test("It should return the new company object", async function () {
        const response = await request(app).post("/companies").send({name: "NuggetyNight", description: "mcYum!"});
        expect(response.body).toEqual({
            "company": {
                code: "nuggetynight",
                name: "NuggetyNight",
                description: "mcYum!"
            }
        });
    });
    test("Should return 500 if there is an issue", async function () {
        const response = await request(app).post("/companies").send({name: "Apple", description: "Huh?"});
        expect(response.status).toEqual(500);
    })
});

describe("PUT /apple", function () {
    test("It should return the updated version of the company object", async function () {
        const response = await request(app).put("/companies/apple").send({
            name: "AppleEdit", description: "NewDescrip, who dis?"
        });
        expect(response.body).toEqual({
            "company": {
                code: "apple",
                name: "AppleEdit",
                description: "NewDescrip, who dis?",
            }
        })
    });
    test("It should return a 404 if there is no such code", async function () {
        const response = await request(app).put("/companies/blubba").send({name: "BlubbaGump"});
        expect(response.status).toEqual(404);
    });
});

describe("DELETE /", function () {
    test("It should delete the company", async function () {
        const response = await request(app).delete("/companies/apple");
        expect(response.body).toEqual({"status": "deleted"});
    });
    test("Returns a 404 for non-existent company", async function () {
        const response = await request(app).delete("/companies/blubba");
        expect(response.status).toEqual(404);
    });
});