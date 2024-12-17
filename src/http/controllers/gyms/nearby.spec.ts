import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gyms controller", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("shoud be able to list nearby gyms", async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "JavaScript Gym",
                description: "Some description",
                phone: "199999999",
                latitude: -22.7568428,
                longitude: -47.0170228
            });

        await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "TypeScript Gym",
                description: "Some description",
                phone: "199999999",
                latitude: -23.5288706,
                longitude: -46.6330218
            });

        const response = await request(app.server)
            .get("/gyms/nearby")
            .query({
                latitude: -22.7568428,
                longitude: -47.0170228
            })
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: "JavaScript Gym"
            })
        ]);
    });
});
