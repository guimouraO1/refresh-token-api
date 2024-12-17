import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";

describe("Authenticate controller", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("shoud be able to authenticate", async () => {
        await request(app.server).post("/users").send({
            name: "Jhon Dow",
            email: "jhondoe@example.com",
            password: "123456"
        });

        const response = await request(app.server).post("/sessions").send({
            email: "jhondoe@example.com",
            password: "123456"
        });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({ token: expect.any(String) });
    });
});
