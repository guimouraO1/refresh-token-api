import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middlewares/verifyJwt";
import { create } from "./create.controller";
import { validate } from "./validate.controller";
import { history } from "./history.controller";
import { metrics } from "./metrics.controller";
import { varifyUserRole } from "@/http/middlewares/verify-user-role";

export async function checkInRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJwt);

    app.get("/check-ins/history", history);
    app.get("/check-ins/metrics", metrics);

    app.post("/gyms/:gymId/check-ins", create);
    app.patch(
        "/check-ins/:checkInId/validate",
        { onRequest: [varifyUserRole("ADMIN")] },
        validate
    );
}
