import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";

describe("Register controller", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("shoud be able to register", async () => {
        const response = await request(app.server).post("/users").send({
            name: "Jhon Dow",
            email: "jhondoe@example.com",
            password: "123456"
        });

        expect(response.statusCode).toEqual(201);
    });
});
