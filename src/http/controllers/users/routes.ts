import { FastifyInstance } from "fastify";
import { register } from "./register.controller";
import { authenticate } from "./authenticate.controller";
import { profile } from "./profile.controller";
import { verifyJwt } from "../../middlewares/verifyJwt";
import { refresh } from "./refresh.controller";

export async function usersRoutes(app: FastifyInstance) {
    app.get("/user", { onRequest: [verifyJwt] }, profile);
    app.post("/user", register);
    app.post("/auth/session", authenticate);
    app.patch("/token/refresh", refresh);
}
