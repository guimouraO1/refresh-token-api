import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middlewares/verifyJwt";
import { search } from "./search.controller";
import { nearby } from "./nearby.controller";
import { create } from "./create.controller";
import { varifyUserRole } from "@/http/middlewares/verify-user-role";

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJwt);

    app.get("/gyms/search", search);
    app.get("/gyms/nearby", nearby);

    app.post("/gyms", { onRequest: [varifyUserRole("ADMIN")] }, create);
}
