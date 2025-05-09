import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Profile controller", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("shoud be able to get user profile", async () => {
        const { token } = await createAndAuthenticateUser(app);

        const profileResponse = await request(app.server)
            .get("/user")
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(profileResponse.statusCode).toEqual(200);
        expect(profileResponse.body).toEqual(
            expect.objectContaining({
                email: "jhondoe@example.com"
            })
        );
    });
});
