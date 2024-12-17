import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Gym controller", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("shoud be able to create a gym", async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        const response = await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "JavaScript Gym",
                description: "Some description",
                phone: "199999999",
                latitude: -22.7568428,
                longitude: -47.0170228
            });
        expect(response.statusCode).toEqual(201);
    });
});
